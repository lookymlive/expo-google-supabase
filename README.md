# SocialCommerce App

Una aplicación similar a Instagram/TikTok donde los comercios pueden subir videos y los usuarios pueden verlos. Desarrollada con Expo React Native para Android y Web.

## Tecnologías Utilizadas

- **Frontend**: Expo React Native, TypeScript
- **Autenticación**: Google Auth, Supabase Auth
- **Backend**: Supabase
- **Almacenamiento de Videos**: Cloudinary
- **Navegación**: React Navigation

## Características Principales

- **Autenticación**: Inicio de sesión con Google y Supabase
- **Roles de Usuario**: Comercios (pueden subir videos) y Usuarios (solo pueden ver)
- **Feed de Videos**: Visualización de videos en formato similar a TikTok/Instagram
- **Perfiles de Comercio**: Información y videos publicados por cada comercio
- **Interacciones**: Me gusta, comentarios y compartir

## Estructura del Proyecto

```
expo-google-supabase/
├── app/                      # Carpeta principal de la aplicación
│   ├── components/           # Componentes reutilizables
│   │   ├── auth/             # Componentes relacionados con autenticación
│   │   ├── feed/             # Componentes para el feed de videos
│   │   ├── profile/          # Componentes para perfiles
│   │   └── ui/               # Componentes de UI generales
│   ├── hooks/                # Custom hooks
│   ├── navigation/           # Configuración de navegación
│   ├── screens/              # Pantallas de la aplicación
│   │   ├── auth/             # Pantallas de autenticación
│   │   ├── feed/             # Pantallas del feed
│   │   ├── profile/          # Pantallas de perfil
│   │   └── upload/           # Pantallas para subir videos (solo comercios)
│   ├── services/             # Servicios (API, Supabase, Cloudinary)
│   ├── types/                # Definiciones de tipos TypeScript
│   └── utils/                # Utilidades y helpers
├── assets/                   # Imágenes, fuentes, etc.
├── App.tsx                   # Punto de entrada de la aplicación
└── ...                       # Archivos de configuración
```

## Instalación y Configuración

1. Clonar el repositorio
2. Instalar dependencias: `npm install`
3. Configurar variables de entorno (ver `.env.example`)
4. Ejecutar la aplicación: `npm start`

## Flujo de Desarrollo

1. Configuración del proyecto y dependencias
2. Implementación de autenticación con Google y Supabase
3. Configuración de roles (comercio/usuario)
4. Desarrollo de la interfaz de usuario
5. Implementación de subida y visualización de videos
6. Implementación de interacciones sociales
7. Pruebas y optimización

## Licencia

Este proyecto está bajo la Licencia MIT. 