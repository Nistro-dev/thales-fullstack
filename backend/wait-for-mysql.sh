#!/bin/sh

# Set default values if not provided
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-3306}
DB_USER=${DB_USER:-root}
DB_PASS=${DB_PASS:-}

if [ "$NODE_ENV" = "integration_test" ] || [ "$NODE_ENV" = "test" ]; then
    echo "🔍 Attente de MySQL en mode test ($NODE_ENV)..."
    echo "🔗 Connexion vers $DB_HOST:$DB_PORT avec l'utilisateur $DB_USER"

    # Wait for MySQL port to be open
    echo "⏳ Vérification de la disponibilité du port MySQL..."
    timeout=60
    count=0
    until nc -z "$DB_HOST" "$DB_PORT" || [ $count -eq $timeout ]; do
        echo "⏳ MySQL n'est pas encore prêt sur $DB_HOST:$DB_PORT - attente... ($count/$timeout)"
        sleep 2
        count=$((count + 1))
    done

    if [ $count -eq $timeout ]; then
        echo "❌ Timeout: Impossible de se connecter à MySQL après ${timeout} tentatives"
        exit 1
    fi

    echo "✅ Port MySQL est ouvert sur $DB_HOST:$DB_PORT"

    # Additional wait for MySQL to be fully ready to accept connections
    echo "⏳ Attente supplémentaire pour que MySQL soit complètement prêt..."
    sleep 10

    # Try to connect to MySQL to verify it's ready
    echo "🔍 Vérification de la connexion MySQL..."
    if command -v mysql >/dev/null 2>&1; then
        timeout=30
        count=0
        until mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASS" -e "SELECT 1;" >/dev/null 2>&1 || [ $count -eq $timeout ]; do
            echo "⏳ MySQL n'accepte pas encore les connexions... ($count/$timeout)"
            sleep 2
            count=$((count + 1))
        done
        
        if [ $count -eq $timeout ]; then
            echo "⚠️ Warning: Impossible de vérifier la connexion MySQL, mais le port est ouvert"
        else
            echo "✅ MySQL accepte les connexions"
        fi
    else
        echo "ℹ️ Client MySQL non disponible, on continue avec la vérification du port uniquement"
    fi
fi

echo "🚀 Démarrage de l'application..."
exec npm start
