#!/bin/bash

# Script de prueba para los endpoints de la API HuertoHogar

API_URL="http://localhost:8080"

echo "=========================================="
echo "Pruebas de API - HuertoHogar Backend"
echo "=========================================="

# 1. Registrar nuevo usuario
echo ""
echo "1. Registrando nuevo usuario..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Usuario Test",
    "email": "test@example.com",
    "password": "test123456",
    "passwordConfirm": "test123456"
  }')
echo "Respuesta: $REGISTER_RESPONSE"

# 2. Login con usuario cliente existente
echo ""
echo "2. Login con usuario cliente..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cliente@demo.com",
    "password": "cliente123"
  }')
echo "Respuesta: $LOGIN_RESPONSE"

# Extraer token (requiere jq: apt-get install jq)
TOKEN=$(echo $LOGIN_RESPONSE | grep -oP '"token":"\K[^"]*')
echo "Token obtenido: ${TOKEN:0:20}..."

# 3. Obtener usuario actual
echo ""
echo "3. Obteniendo usuario actual..."
curl -s -X GET "$API_URL/api/auth/me" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | sed 's/,/,\n/g'

# 4. Listar productos
echo ""
echo ""
echo "4. Listando todos los productos..."
curl -s -X GET "$API_URL/api/productos" \
  -H "Content-Type: application/json" | sed 's/,/,\n/g' | head -20

# 5. Obtener un producto específico
echo ""
echo ""
echo "5. Obteniendo producto con ID 1..."
curl -s -X GET "$API_URL/api/productos/1" \
  -H "Content-Type: application/json" | sed 's/,/,\n/g'

# 6. Buscar productos por nombre
echo ""
echo ""
echo "6. Buscando productos por nombre 'tomate'..."
curl -s -X GET "$API_URL/api/productos/search?nombre=tomate" \
  -H "Content-Type: application/json" | sed 's/,/,\n/g' | head -10

# 7. Buscar productos por categoría
echo ""
echo ""
echo "7. Buscando productos de la categoría 'Frutas'..."
curl -s -X GET "$API_URL/api/productos/categoria/Frutas" \
  -H "Content-Type: application/json" | sed 's/,/,\n/g' | head -10

# 8. Agregar producto al carrito
echo ""
echo ""
echo "8. Agregando producto (ID 1) al carrito..."
curl -s -X POST "$API_URL/api/carrito/agregar" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productoId": 1,
    "cantidad": 2
  }' | sed 's/,/,\n/g'

# 9. Obtener carrito
echo ""
echo ""
echo "9. Obteniendo carrito del usuario..."
curl -s -X GET "$API_URL/api/carrito" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | sed 's/,/,\n/g'

# 10. Crear pedido desde carrito
echo ""
echo ""
echo "10. Creando pedido desde carrito..."
PEDIDO_RESPONSE=$(curl -s -X POST "$API_URL/api/pedidos/desde-carrito" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")
echo "Respuesta: $PEDIDO_RESPONSE" | sed 's/,/,\n/g'

# Extraer ID del pedido
PEDIDO_ID=$(echo $PEDIDO_RESPONSE | grep -oP '"id":\K[^,]*' | head -1)
echo "ID del pedido: $PEDIDO_ID"

# 11. Obtener pedidos del usuario
echo ""
echo ""
echo "11. Obteniendo pedidos del usuario..."
curl -s -X GET "$API_URL/api/pedidos" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | sed 's/,/,\n/g'

# 12. Obtener un pedido específico
if [ ! -z "$PEDIDO_ID" ]; then
  echo ""
  echo ""
  echo "12. Obteniendo pedido con ID $PEDIDO_ID..."
  curl -s -X GET "$API_URL/api/pedidos/$PEDIDO_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" | sed 's/,/,\n/g'
fi

# 13. Login como admin
echo ""
echo ""
echo "13. Login como admin..."
ADMIN_LOGIN=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@demo.com",
    "password": "admin123"
  }')
ADMIN_TOKEN=$(echo $ADMIN_LOGIN | grep -oP '"token":"\K[^"]*')
echo "Token de admin obtenido: ${ADMIN_TOKEN:0:20}..."

# 14. Cambiar estado de pedido (solo admin)
if [ ! -z "$PEDIDO_ID" ] && [ ! -z "$ADMIN_TOKEN" ]; then
  echo ""
  echo ""
  echo "14. Cambiando estado del pedido a 'CONFIRMADO' (admin)..."
  curl -s -X PUT "$API_URL/api/pedidos/$PEDIDO_ID/estado" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "estado": "CONFIRMADO"
    }' | sed 's/,/,\n/g'
fi

# 15. Crear nuevo producto (admin)
echo ""
echo ""
echo "15. Creando nuevo producto (admin)..."
curl -s -X POST "$API_URL/api/productos" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Lechuga Morada",
    "descripcion": "Lechuga fresca de huerta",
    "precio": 2.99,
    "stock": 50,
    "categoria": "Hortalizas"
  }' | sed 's/,/,\n/g'

echo ""
echo ""
echo "=========================================="
echo "Pruebas completadas!"
echo "=========================================="
