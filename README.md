# SocialCommerce App

Una aplicación de comercio social que permite a los comercios compartir videos de sus productos y a los usuarios descubrir y comprar productos a través de videos.

## Tecnologías Utilizadas

- React Native con Expo
- TypeScript
- Supabase (Autenticación y Base de Datos)
- Cloudinary (Almacenamiento de Videos)
- Google Authentication

## Requisitos Previos

- Node.js (v14 o superior)
- npm o yarn
- Cuenta en Supabase
- Cuenta en Cloudinary
- Proyecto configurado en Google Cloud Platform (para autenticación con Google)

## Configuración del Proyecto

1. Clona el repositorio:
   ```
   git clone https://github.com/tu-usuario/social-commerce.git
   cd social-commerce
   ```

2. Instala las dependencias:
   ```
   npm install
   ```

3. Configura las variables de entorno:
   
   **Opción 1: Configuración asistida**
   ```
   npm run setup-env
   ```
   Este comando te guiará paso a paso para configurar todas las variables de entorno necesarias.
   
   **Opción 2: Configuración manual**
   - Crea una cuenta en [Supabase](https://supabase.io/)
   - Crea una cuenta en [Cloudinary](https://cloudinary.com/)
   - Configura un proyecto en [Google Cloud Platform](https://console.cloud.google.com/)
   - Copia el archivo `.env.example` a `.env` y completa con tus credenciales:
     ```
     cp .env.example .env
     ```
   - Edita el archivo `.env` con tus credenciales
   - Edita el archivo `.env.js` con las mismas credenciales

4. Verifica la configuración:
   ```
   npm run check-env
   ```
   Este comando verificará que todas las variables de entorno estén correctamente configuradas.

5. Configura la base de datos en Supabase:
   - Crea una tabla `profiles` con los siguientes campos:
     - `id` (uuid, primary key)
     - `display_name` (text)
     - `avatar_url` (text, nullable)
     - `role` (text, default: 'user')
     - `created_at` (timestamp with timezone)
   - Crea una tabla `videos` con los siguientes campos:
     - `id` (uuid, primary key)
     - `user_id` (uuid, foreign key to profiles.id)
     - `title` (text)
     - `description` (text, nullable)
     - `video_url` (text)
     - `thumbnail_url` (text, nullable)
     - `created_at` (timestamp with timezone)
     - `updated_at` (timestamp with timezone)

## Ejecución del Proyecto

1. Inicia el servidor de desarrollo:
   ```
   npm start
   ```

2. Escanea el código QR con la aplicación Expo Go en tu dispositivo o presiona:
   - `a` para abrir en un emulador de Android
   - `i` para abrir en un simulador de iOS
   - `w` para abrir en un navegador web

## Estructura del Proyecto

```
expo-google-supabase/
├── app/
│   ├── components/
│   │   ├── auth/
│   │   ├── feed/
│   │   ├── profile/
│   │   └── ui/
│   ├── hooks/
│   ├── navigation/
│   ├── screens/
│   │   ├── auth/
│   │   ├── feed/
│   │   ├── profile/
│   │   └── upload/
│   ├── services/
│   │   ├── cloudinary.ts
│   │   └── supabase.ts
│   ├── types/
│   │   └── index.ts
│   └── utils/
├── assets/
├── .env
├── .env.js
├── app.config.js
├── babel.config.js
├── App.tsx
└── package.json
```

## Funcionalidades Principales

- Autenticación de usuarios (registro, inicio de sesión, cierre de sesión)
- Dos tipos de usuarios: Comercios y Usuarios regulares
- Feed de videos para descubrir productos
- Perfil de usuario con información y estadísticas
- Subida de videos (solo para comercios)
- Interacciones sociales (likes, comentarios) - En desarrollo

## Contribución

1. Haz un fork del repositorio
2. Crea una rama para tu funcionalidad (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Haz push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles. 