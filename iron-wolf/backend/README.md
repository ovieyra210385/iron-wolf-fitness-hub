# Iron Wolf Backend

## Descripción
Iron Wolf es una plataforma SaaS diseñada para la gestión integral de gimnasios, estudios boutique, centros de crossfit, yoga, pickleball y nutrición. Este backend proporciona las funcionalidades necesarias para soportar la aplicación, incluyendo la gestión de usuarios, pagos, reservas, y más.

## Estructura del Proyecto
El backend está organizado en varias carpetas que contienen los siguientes elementos:

- **src/**: Contiene el código fuente del backend.
  - **controllers/**: Controladores que manejan la lógica de negocio y las respuestas a las solicitudes.
  - **services/**: Servicios que encapsulan la lógica de acceso a datos y otras operaciones.
  - **models/**: Modelos de datos que representan las entidades de la aplicación.
  - **routes/**: Definiciones de las rutas de la API.
  - **utils/**: Funciones utilitarias que pueden ser utilizadas en todo el backend.
  - **main.ts**: Punto de entrada del backend que configura el servidor y las rutas principales.

- **supabase/**: Contiene las migraciones y scripts para poblar la base de datos con datos iniciales.

## Instalación
1. Clona el repositorio:
   ```
   git clone <url-del-repositorio>
   cd iron-wolf/backend
   ```

2. Instala las dependencias:
   ```
   npm install
   ```

3. Configura las variables de entorno. Copia el archivo `.env.example` a `.env` y ajusta los valores según sea necesario.

4. Inicia el servidor:
   ```
   npm start
   ```

## API
La API está documentada en el archivo `docs/API.md`. Asegúrate de revisar los endpoints disponibles y su uso.

## Contribuciones
Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request para discutir cambios o mejoras.

## Licencia
Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.