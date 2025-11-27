#!/bin/bash

# ============================================
# Script de Despliegue en AWS EC2
# ============================================
# Ejecutar: bash deploy.sh

echo "🚀 Iniciando despliegue en AWS EC2..."

# ============================================
# 1. Variables de configuración
# ============================================
echo "📋 Configurando variables..."

JAR_FILE="demo-0.0.1-SNAPSHOT.jar"
APP_DIR="/home/ec2-user/huertohogar"
JAR_PATH="$APP_DIR/$JAR_FILE"
CONFIG_FILE="$APP_DIR/application-prod.properties"
LOG_FILE="$APP_DIR/app.log"
PID_FILE="$APP_DIR/app.pid"

# ============================================
# 2. Detener aplicación anterior (si existe)
# ============================================
echo "🛑 Deteniendo aplicación anterior..."
if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    kill -15 $PID 2>/dev/null || true
    sleep 2
fi

# ============================================
# 3. Crear directorio si no existe
# ============================================
echo "📁 Preparando directorios..."
mkdir -p "$APP_DIR"

# ============================================
# 4. Copiar JAR (si se proporciona en parámetro)
# ============================================
if [ ! -z "$1" ]; then
    echo "📦 Copiando JAR..."
    cp "$1" "$JAR_PATH"
fi

# ============================================
# 5. Verificar que el JAR existe
# ============================================
if [ ! -f "$JAR_PATH" ]; then
    echo "❌ Error: JAR no encontrado en $JAR_PATH"
    echo "Uso: bash deploy.sh [ruta-al-jar]"
    echo "Ejemplo: bash deploy.sh /tmp/demo-0.0.1-SNAPSHOT.jar"
    exit 1
fi

# ============================================
# 6. Crear archivo de configuración si no existe
# ============================================
if [ ! -f "$CONFIG_FILE" ]; then
    echo "⚙️  Creando archivo de configuración..."
    cat > "$CONFIG_FILE" << 'EOF'
server.port=8080

# MySQL RDS
spring.datasource.url=jdbc:mysql://${DB_HOST}:3306/${DB_NAME}?useSSL=true&serverTimezone=UTC
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
spring.jpa.hibernate.ddl-auto=validate

# JWT
app.jwtSecret=${JWT_SECRET}
app.jwtExpirationMs=86400000

# CORS
app.cors.allowedOrigins=https://tu-dominio.com

# Logging
logging.level.root=WARN
logging.level.com.example.demo=INFO
EOF
    echo "⚠️  Actualiza $CONFIG_FILE con tus valores de RDS y JWT"
fi

# ============================================
# 7. Iniciar la aplicación
# ============================================
echo "🟢 Iniciando la aplicación..."
nohup java -jar "$JAR_PATH" \
    --spring.profiles.active=prod \
    --spring.config.location="file:$CONFIG_FILE" \
    > "$LOG_FILE" 2>&1 &

APP_PID=$!
echo $APP_PID > "$PID_FILE"

echo "✅ Aplicación iniciada con PID: $APP_PID"
echo "📊 Logs en: $LOG_FILE"

# ============================================
# 8. Esperar a que inicie
# ============================================
echo "⏳ Esperando que inicie la aplicación..."
sleep 5

# ============================================
# 9. Verificar que está corriendo
# ============================================
if ps -p $APP_PID > /dev/null; then
    echo "✅ Aplicación ejecutándose correctamente"
    
    # Mostrar primeras líneas del log
    echo ""
    echo "📋 Primeras líneas del log:"
    head -20 "$LOG_FILE"
    echo ""
else
    echo "❌ Error: La aplicación no inició correctamente"
    echo "📋 Logs:"
    cat "$LOG_FILE"
    exit 1
fi

# ============================================
# 10. Información de acceso
# ============================================
echo ""
echo "================================================"
echo "🎉 DESPLIEGUE COMPLETADO"
echo "================================================"
echo "API URL:      http://tu-ec2-ip:8080"
echo "Swagger UI:   http://tu-ec2-ip:8080/swagger-ui/index.html"
echo "PID File:     $PID_FILE"
echo "Log File:     $LOG_FILE"
echo ""
echo "Para ver logs en tiempo real:"
echo "  tail -f $LOG_FILE"
echo ""
echo "Para detener la aplicación:"
echo "  kill $(cat $PID_FILE)"
echo "================================================"
