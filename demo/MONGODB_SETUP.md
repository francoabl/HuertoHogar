# Configuración de MongoDB Atlas para HuertoHogar

## Pasos para configurar MongoDB Atlas

### 1. Crear una cuenta en MongoDB Atlas

1. Ve a [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Regístrate con tu correo electrónico o cuenta de Google/GitHub
3. Completa el cuestionario inicial (puedes elegir opciones gratuitas)

### 2. Crear un Cluster

1. En el dashboard de MongoDB Atlas, haz clic en "Build a Database"
2. Selecciona la opción **FREE** (M0 Sandbox)
3. Elige un proveedor de nube:
   - **AWS**, **Google Cloud** o **Azure**
   - Selecciona la región más cercana a tu ubicación
4. Dale un nombre a tu cluster (ejemplo: `HuertoHogarCluster`)
5. Haz clic en "Create"

### 3. Configurar acceso de red

1. En el menú lateral, ve a **Network Access**
2. Haz clic en "Add IP Address"
3. Opciones:
   - **Para desarrollo**: Selecciona "Allow Access from Anywhere" (0.0.0.0/0)
   - **Para producción**: Agrega solo las IPs específicas que necesiten acceso
4. Haz clic en "Confirm"

### 4. Crear un usuario de base de datos

1. En el menú lateral, ve a **Database Access**
2. Haz clic en "Add New Database User"
3. Elige el método de autenticación: **Password**
4. Crea un nombre de usuario y contraseña segura
   - **Importante**: Guarda estas credenciales, las necesitarás más adelante
   - Ejemplo:
     - Username: `huertohogar_user`
     - Password: `TuPasswordSegura123!`
5. En "Database User Privileges", selecciona **Read and write to any database**
6. Haz clic en "Add User"

### 5. Obtener la cadena de conexión

1. Ve a la pestaña **Database** en el menú lateral
2. En tu cluster, haz clic en el botón "Connect"
3. Selecciona "Connect your application"
4. Selecciona:
   - Driver: **Java**
   - Version: **4.3 or later**
5. Copia la cadena de conexión (Connection String)
   - Se verá algo así:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 6. Configurar la aplicación Spring Boot

1. Abre el archivo `src/main/resources/application.properties`

2. Reemplaza los valores de configuración con tu información:

```properties
# MongoDB Atlas Configuration
spring.mongodb.uri=mongodb+srv://<username>:<password>@<cluster-url>/huertohogar?retryWrites=true&w=majority
spring.mongodb.database=huertohogar
```

3. **Importante**: Reemplaza:
   - `<username>` con el nombre de usuario que creaste (ej: `huertohogar_user`)
   - `<password>` con la contraseña que creaste (ej: `TuPasswordSegura123!`)
   - `<cluster-url>` con tu URL de cluster (ej: `cluster0.xxxxx.mongodb.net`)

**Ejemplo completo:**
```properties
spring.mongodb.uri=mongodb+srv://huertohogar_user:TuPasswordSegura123!@cluster0.ab1cd.mongodb.net/huertohogar?retryWrites=true&w=majority
spring.mongodb.database=huertohogar
```

### 7. Variables de entorno (Recomendado para producción)

Para mayor seguridad, usa variables de entorno:

**Windows PowerShell:**
```powershell
$env:MONGODB_URI="mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/huertohogar?retryWrites=true&w=majority"
```

**Linux/Mac:**
```bash
export MONGODB_URI="mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/huertohogar?retryWrites=true&w=majority"
```

Luego en `application.properties`:
```properties
spring.mongodb.uri=${MONGODB_URI}
```

### 8. Verificar la conexión

1. Inicia la aplicación:
```powershell
cd demo
.\mvnw spring-boot:run
```

2. Deberías ver en los logs:
```
Cluster created with settings {hosts=[cluster0.xxxxx.mongodb.net...
```

3. Si hay errores de conexión, verifica:
   - Usuario y contraseña correctos
   - IP permitida en Network Access
   - URL de conexión correcta

### 9. Inicializar datos

La aplicación creará automáticamente:
- Colecciones: `usuarios`, `roles`, `productos`, `pedidos`, `carrito_items`
- Datos iniciales a través de `DataLoader.java`

### 10. Ver los datos en MongoDB Atlas

1. En MongoDB Atlas, ve a **Database** > **Browse Collections**
2. Selecciona la base de datos `huertohogar`
3. Podrás ver todas las colecciones y documentos

## Solución de problemas comunes

### Error: "Authentication failed"
- Verifica que el usuario y contraseña sean correctos
- Asegúrate de que el usuario tenga permisos de lectura/escritura

### Error: "IP not whitelisted"
- Ve a Network Access y agrega tu IP actual
- O permite acceso desde cualquier lugar (0.0.0.0/0) para desarrollo

### Error: "Connection timeout"
- Verifica tu conexión a internet
- Asegúrate de que no haya firewall bloqueando el puerto 27017

### Caracteres especiales en la contraseña
Si tu contraseña tiene caracteres especiales, debes codificarlos en URL:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- etc.

## Límites del plan gratuito (M0)

- **Almacenamiento**: 512 MB
- **RAM**: Compartida
- **Conexiones simultáneas**: 500
- **Ideal para**: Desarrollo y proyectos pequeños

## Migración de datos desde H2

Los datos se crearán automáticamente al iniciar la aplicación gracias a `DataLoader.java`, que incluye:
- 2 roles: ROLE_USER, ROLE_ADMIN
- 2 usuarios de prueba
- Productos iniciales

## Recursos adicionales

- [Documentación oficial de MongoDB Atlas](https://docs.atlas.mongodb.com/)
- [Spring Data MongoDB Reference](https://docs.spring.io/spring-data/mongodb/docs/current/reference/html/)
- [MongoDB University - Cursos gratuitos](https://university.mongodb.com/)
