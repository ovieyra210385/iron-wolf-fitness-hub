# Iron Wolf

Iron Wolf es una plataforma SaaS diseñada para la gestión integral de gimnasios, estudios boutique, centros de crossfit, yoga, pickleball y nutrición. Nuestro objetivo es ofrecer una solución completa y moderna que unifique diversas funcionalidades en un solo sistema, superando las capacidades de soluciones existentes como Gymforce, EVO o Fitco.

## Características Principales

- **Gestión de Socios y Membresías**: Altas, bajas, renovaciones y planes recurrentes.
- **Control de Acceso**: Acceso mediante QR, huella, RFID o reconocimiento facial.
- **Reservas y Programación**: Agenda de clases, entrenadores y equipos, con listas de espera y cancelaciones.
- **Pagos y Facturación**: Integración con múltiples métodos de pago y facturación electrónica.
- **CRM Integrado**: Seguimiento de clientes y comunicación automatizada.
- **Reportes y Analítica**: Métricas de asistencia, ingresos y retención.
- **App Móvil**: Acceso a reservas, pagos y seguimiento de progreso.
- **Módulo de Entrenamiento y Nutrición**: Rutinas y dietas personalizadas.
- **Integraciones Corporativas**: Con plataformas como Wellhub, TotalPass y Gympass.
- **E-commerce**: Venta de suplementos y accesorios.

## Tecnologías Utilizadas

- **Frontend**: React.js o Next.js
- **Backend**: Node.js (NestJS) o Python (FastAPI)
- **Base de Datos**: PostgreSQL
- **Mobile**: Flutter (Android/iOS)
- **Analítica**: Metabase o Power BI
- **Infraestructura**: SaaS multi-tenant en la nube (AWS o GCP)

## Instalación

Para configurar el proyecto, sigue estos pasos:

1. Clona el repositorio:
   ```
   git clone <url-del-repositorio>
   cd iron-wolf
   ```

2. Configura las variables de entorno:
   Copia el archivo `.env.example` a `.env` y ajusta las configuraciones según tus necesidades.

3. Instala las dependencias:
   Para el backend:
   ```
   cd backend
   npm install
   ```

   Para el panel de administración:
   ```
   cd apps/admin-panel
   npm install
   ```

   Para la aplicación del cliente:
   ```
   cd apps/client-app
   npm install
   ```

   Para la aplicación móvil:
   ```
   cd mobile
   flutter pub get
   ```

4. Ejecuta la aplicación:
   Para el backend:
   ```
   npm start
   ```

   Para el panel de administración y la aplicación del cliente, utiliza el comando correspondiente en sus directorios.

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request para discutir cambios o mejoras.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.