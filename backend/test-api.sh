#!/bin/bash

# Script de test de l'API Backend
# Assurez-vous que le serveur backend est démarré sur localhost:5000

echo "🧪 Test de l'API Backend - Institut 2iE"
echo "====================================="

# URL de base
BASE_URL="http://localhost:5000"

echo
echo "1. Test de santé de l'API..."
curl -s "$BASE_URL/api/health" | python3 -m json.tool
echo

echo
echo "2. Test de la page d'accueil..."
curl -s "$BASE_URL/" | python3 -m json.tool
echo

echo
echo "3. Test d'inscription d'un utilisateur..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Test",
    "prenom": "Utilisateur",
    "email": "test@2ie.edu",
    "password": "TestPassword123!",
    "role": "lecteur",
    "service": "Direction Générale",
    "telephone": "+226 70 00 00 00"
  }')

echo "$REGISTER_RESPONSE" | python3 -m json.tool

# Extraire le token de la réponse d'inscription
TOKEN=$(echo "$REGISTER_RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if data.get('success'):
        print(data['data']['token'])
    else:
        print('NO_TOKEN')
except:
    print('NO_TOKEN')
")

echo
echo "4. Test de connexion..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@2ie.edu",
    "password": "TestPassword123!"
  }')

echo "$LOGIN_RESPONSE" | python3 -m json.tool

# Utiliser le token de connexion si l'inscription a échoué
if [ "$TOKEN" = "NO_TOKEN" ]; then
    TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if data.get('success'):
        print(data['data']['token'])
    else:
        print('NO_TOKEN')
except:
    print('NO_TOKEN')
")
fi

if [ "$TOKEN" != "NO_TOKEN" ]; then
    echo
    echo "5. Test de vérification du token..."
    curl -s -X POST "$BASE_URL/api/auth/verify" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" | python3 -m json.tool
    
    echo
    echo "6. Test de récupération du profil..."
    curl -s -X GET "$BASE_URL/api/auth/profile" \
      -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
    
    echo
    echo "7. Test de mise à jour du profil..."
    curl -s -X PUT "$BASE_URL/api/auth/profile" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "nom": "Test Modifié",
        "prenom": "Utilisateur Modifié",
        "telephone": "+226 75 00 00 00"
      }' | python3 -m json.tool
    
    echo
    echo "8. Test de déconnexion..."
    curl -s -X POST "$BASE_URL/api/auth/logout" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" | python3 -m json.tool
else
    echo
    echo "❌ Impossible de récupérer le token d'authentification"
    echo "Vérifiez que le serveur backend est démarré et que MySQL est configuré"
fi

echo
echo "✅ Tests terminés !"
echo
echo "Pour utiliser l'API dans votre frontend :"
echo "- URL de base : $BASE_URL"
echo "- Les tokens JWT sont valides pendant 30 jours"
echo "- Ajoutez 'Bearer TOKEN' dans l'header Authorization"
