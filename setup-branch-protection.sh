#!/bin/bash

# Script de configuration des protections de branche GitHub
# Usage: ./setup-branch-protection.sh

echo "🔒 Configuration des protections de branche..."

# Protection de la branche main
echo "📋 Configuration de la branche main..."
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["Lint","Test","Build","Docker Build"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_code_owner_reviews":false}' \
  --field restrictions=null \
  --field allow_force_pushes=false \
  --field allow_deletions=false

# Protection de la branche dev
echo "📋 Configuration de la branche dev..."
gh api repos/:owner/:repo/branches/dev/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["Lint","Test","Build"]}' \
  --field enforce_admins=false \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_code_owner_reviews":false}' \
  --field restrictions=null \
  --field allow_force_pushes=false \
  --field allow_deletions=false

echo "✅ Protections de branche configurées avec succès!"
echo ""
echo "🔍 Règles appliquées:"
echo "   • main: Protection complète, 1 review requis, CI obligatoire"
echo "   • dev: Protection standard, 1 review requis, CI obligatoire"
echo ""
echo "📝 Pour modifier ces paramètres, utilisez l'interface GitHub ou modifiez ce script."
