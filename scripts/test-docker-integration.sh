#!/bin/bash

# Script de test d'intégration Docker Compose
# Vérifie que tous les services démarrent correctement et sont healthy

set -e

echo "🧪 Démarrage des tests d'intégration Docker Compose..."

# Variables
COMPOSE_FILE="docker-compose.test.yml"
TIMEOUT=300  # 5 minutes
CHECK_INTERVAL=10
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
NPM_REGISTRY_TIMEOUT=120 # Timeout pour les erreurs du registre npm en secondes

# Aller dans le répertoire racine du projet
cd "$PROJECT_ROOT"

# Vérifier que le fichier docker-compose existe
if [ ! -f "$COMPOSE_FILE" ]; then
    echo "❌ Fichier $COMPOSE_FILE non trouvé dans $PROJECT_ROOT"
    exit 1
fi

# Fonction pour nettoyer à la fin
cleanup() {
    echo "🧹 Nettoyage des conteneurs de test..."
    docker-compose -f "$COMPOSE_FILE" down -v --remove-orphans 2>/dev/null || true
    docker system prune -f 2>/dev/null || true
}

# Nettoyer en cas d'interruption
trap cleanup EXIT INT TERM

# Nettoyer les ressources existantes
cleanup

# Vérifier la connectivité au registre npm
check_npm_registry() {
    echo "🔍 Vérification de la connectivité au registre npm..."
    if curl -s --max-time 10 "https://registry.npmjs.org/" -o /dev/null; then
        echo "✅ Connectivité au registre npm: OK"
        return 0
    else
        echo "⚠️ Problème de connectivité au registre npm"
        return 1
    fi
}

# Créer un fichier .npmrc temporaire avec des configurations optimisées
create_optimized_npmrc() {
    cat > .npmrc.tmp <<EOF
registry=https://registry.npmjs.org/
fetch-retries=5
fetch-retry-mintimeout=20000
fetch-retry-maxtimeout=120000
network-timeout=300000
prefer-offline=true
strict-ssl=false
EOF

    # Mettre à jour le Dockerfile temporaire pour utiliser ce fichier .npmrc
    for dockerfile in backend/Dockerfile frontend/Dockerfile; do
        if [ -f "$dockerfile" ]; then
            sed -i.bak 's|RUN npm |COPY .npmrc.tmp /root/.npmrc\nRUN npm |g' "$dockerfile"
        fi
    done
}

# Restaurer les fichiers originaux
restore_original_files() {
    rm -f .npmrc.tmp
    for dockerfile in backend/Dockerfile frontend/Dockerfile; do
        if [ -f "$dockerfile.bak" ]; then
            mv "$dockerfile.bak" "$dockerfile"
        fi
    done
}

# Démarrer les services avec plusieurs tentatives
echo "🚀 Démarrage des services de test..."
max_attempts=3
attempt=1

# Vérifier la connectivité npm avant de commencer
if ! check_npm_registry; then
    echo "⚠️ Problèmes avec le registre npm détectés, mise en place de configurations optimisées..."
    create_optimized_npmrc
    trap restore_original_files EXIT INT TERM
fi

while [ $attempt -le $max_attempts ]; do
    echo "Tentative $attempt de $max_attempts pour démarrer les services..."
    
    # Construire les images avec un timeout suffisamment long
    if DOCKER_BUILDKIT=1 COMPOSE_HTTP_TIMEOUT=300 docker-compose -f "$COMPOSE_FILE" up -d --build; then
        echo "✅ Services démarrés avec succès"
        break
    else
        echo "⚠️ Échec du démarrage des services (tentative $attempt/$max_attempts)"
          # Vérifier si c'est un problème avec le registre npm
        if docker-compose -f "$COMPOSE_FILE" logs | grep -q -E "(ERR_PNPM_FETCH_503|npm ERR.*503|ETIMEDOUT|ECONNREFUSED)"; then
            echo "⚠️ Détection d'erreurs npm registry 503, attente de la résolution..."
            
            # Attendre que le registre npm soit à nouveau disponible
            wait_time=0
            while [ $wait_time -lt $NPM_REGISTRY_TIMEOUT ]; do
                if check_npm_registry; then
                    echo "✅ Registre npm à nouveau disponible!"
                    break
                fi
                echo "⏳ Attente de la disponibilité du registre npm... ${wait_time}s/${NPM_REGISTRY_TIMEOUT}s"
                sleep 10
                wait_time=$((wait_time + 10))
            done
            
            if [ $wait_time -ge $NPM_REGISTRY_TIMEOUT ]; then
                echo "⚠️ Timeout atteint en attendant le registre npm, tentative avec des miroirs alternatifs..."
                # Configurer des miroirs alternatifs
                cat > .npmrc.tmp <<EOF
registry=https://registry.yarnpkg.com/
fetch-retries=5
fetch-retry-mintimeout=20000
fetch-retry-maxtimeout=120000
network-timeout=300000
EOF
            fi
        fi
        
        if [ $attempt -lt $max_attempts ]; then
            echo "🧹 Nettoyage avant nouvelle tentative..."
            docker-compose -f "$COMPOSE_FILE" down -v --remove-orphans
            docker builder prune -f
            echo "⏳ Attente de 60 secondes avant nouvelle tentative..."
            sleep 60
        else
            echo "❌ Échec du démarrage des services après $max_attempts tentatives"
            docker-compose -f "$COMPOSE_FILE" logs
            exit 1
        fi
    fi
    
    attempt=$((attempt + 1))
done

# Restaurer les fichiers originaux si nécessaire
if [ -f ".npmrc.tmp" ]; then
    restore_original_files
fi

# Attendre que les services démarrent
echo "⏸️  Attendre 30 secondes que les services se stabilisent..."
sleep 30

# Afficher l'état des conteneurs pour debug
echo "📊 État actuel des conteneurs:"
docker-compose -f "$COMPOSE_FILE" ps

# Fonction pour vérifier le statut d'un service
check_service_health() {
    local service_name=$1
    local max_attempts=$((TIMEOUT / CHECK_INTERVAL))
    local attempt=0

    echo "⏳ Vérification de la santé du service: $service_name"
    
    while [ $attempt -lt $max_attempts ]; do
        # Méthode plus robuste pour vérifier la santé des services
        container_status=$(docker-compose -f $COMPOSE_FILE ps --format "table {{.Service}}\t{{.State}}\t{{.Status}}" | grep "$service_name" | awk '{print $2}')
        health_info=$(docker-compose -f $COMPOSE_FILE ps --format "table {{.Service}}\t{{.State}}\t{{.Status}}" | grep "$service_name" | awk '{for(i=3;i<=NF;i++) printf "%s ", $i; print ""}')
        
        # Vérifier si le conteneur est en cours d'exécution
        if [ "$container_status" = "running" ]; then
            # Si pas de health check défini, considérer comme healthy si running
            if echo "$health_info" | grep -q "healthy"; then
                echo "✅ Service $service_name est healthy"
                return 0
            elif echo "$health_info" | grep -q "unhealthy"; then
                echo "❌ Service $service_name est unhealthy"
                docker-compose -f $COMPOSE_FILE logs $service_name
                return 1
            elif echo "$health_info" | grep -q "starting"; then
                echo "⏸️  Service $service_name en cours de démarrage... (tentative $((attempt + 1))/$max_attempts)"
            else
                # Pas de health check défini, vérifier que le conteneur répond
                echo "🔍 Service $service_name running, test de connectivité..."
                if test_service_connectivity "$service_name"; then
                    echo "✅ Service $service_name est opérationnel"
                    return 0
                else
                    echo "⏸️  Service $service_name pas encore prêt... (tentative $((attempt + 1))/$max_attempts)"
                fi
            fi
        else
            echo "⏸️  Service $service_name état: $container_status (tentative $((attempt + 1))/$max_attempts)"
        fi
        
        sleep $CHECK_INTERVAL
        attempt=$((attempt + 1))
    done
    
    echo "⏰ Timeout atteint pour le service $service_name"
    docker-compose -f $COMPOSE_FILE logs $service_name
    return 1
}

# Fonction pour tester la connectivité d'un service
test_service_connectivity() {
    local service_name=$1
    
    case $service_name in
        "mysql_test")
            # Test de connexion MySQL
            docker-compose -f $COMPOSE_FILE exec -T mysql_test mysqladmin ping -h localhost >/dev/null 2>&1
            return $?
            ;;
        "thales_backend_test")
            # Test de l'endpoint health
            docker run --rm --network thales_test_network curlimages/curl:latest \
                -s -f http://thales_backend_test:3000/health >/dev/null 2>&1
            return $?
            ;;
        "thales_frontend_test")
            # Test que nginx répond
            docker run --rm --network thales_test_network curlimages/curl:latest \
                -s -f http://thales_frontend_test:80 >/dev/null 2>&1
            return $?
            ;;
        *)
            return 0
            ;;
    esac
}

# Fonction pour tester un endpoint
test_endpoint() {
    local url=$1
    local expected_status=$2
    local description=$3
    
    echo "🔍 Test: $description"
    
    response=$(docker run --rm --network thales_test_network curlimages/curl:latest \
        -s -o /dev/null -w "%{http_code}" "$url" || echo "000")
    
    if [ "$response" = "$expected_status" ]; then
        echo "✅ $description: OK (Status: $response)"
        return 0
    else
        echo "❌ $description: FAILED (Expected: $expected_status, Got: $response)"
        return 1
    fi
}

# Vérifier les services un par un
echo "🏥 Vérification de la santé des services..."

services=("mysql_test" "thales_backend_test" "thales_frontend_test")
for service in "${services[@]}"; do
    if ! check_service_health "$service"; then
        echo "❌ Échec du test d'intégration: Service $service non healthy"
        echo "🔍 Affichage des logs pour diagnostic:"
        docker-compose -f $COMPOSE_FILE logs $service
        exit 1
    fi
done

# Tests des endpoints
echo "🌐 Tests des endpoints..."

# Test du health check du backend
if ! test_endpoint "http://thales_backend_test:3000/health" "200" "Backend Health Check"; then
    exit 1
fi

# Test du frontend
if ! test_endpoint "http://thales_frontend_test:80" "200" "Frontend Accessibility"; then
    exit 1
fi

# Test de l'API Swagger (si disponible)
if ! test_endpoint "http://thales_backend_test:3000/api-docs.json" "200" "Swagger Documentation"; then
    echo "⚠️  Swagger documentation non accessible (non critique)"
fi

echo "🎉 Tous les tests d'intégration Docker Compose ont réussi !"
echo "📊 Résumé:"
echo "  - ✅ Base de données MySQL: Healthy"
echo "  - ✅ Backend API: Healthy"
echo "  - ✅ Frontend: Healthy"
echo "  - ✅ Connectivité inter-services: OK"

exit 0
