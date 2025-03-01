# Notas de Desarrollo - SocialCommerce App

Este documento registra los pasos seguidos durante el desarrollo de la aplicación SocialCommerce.

## Fecha: 01/03/2025

### Configuración Inicial del Proyecto

1. Creación del proyecto Expo con TypeScript:
   ```
   npx create-expo-app -t expo-template-blank-typescript (. si ya teniamos una carpeta con nombre de la app)
   ```

2. Instalación de dependencias de navegación:
   ```
   npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
   ```

3. Instalación de dependencias para autenticación y almacenamiento:
   ```
   npm install @supabase/supabase-js expo-auth-session expo-web-browser expo-secure-store
   ```

4. Instalación de dependencias para manejo de multimedia:
   ```
   npm install expo-image-picker expo-av expo-file-system
   ```

5. Instalación de dependencias para Cloudinary:
   ```
   npm install cloudinary-react-native
   ```

6. Instalación de dependencias adicionales de Expo:
   ```
   npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler expo-constants expo-status-bar
   ```

### Creación de la Estructura de Carpetas

1. Creación de la carpeta principal:
   ```
   mkdir app
   ```

2. Creación de subcarpetas principales:
   ```
   mkdir app\components
   mkdir app\hooks
   mkdir app\navigation
   mkdir app\screens
   mkdir app\services
   mkdir app\types
   mkdir app\utils
   ```

3. Creación de subcarpetas de componentes:
   ```
   mkdir app\components\auth
   mkdir app\components\feed
   mkdir app\components\profile
   mkdir app\components\ui
   ```

4. Creación de subcarpetas de pantallas:
   ```
   mkdir app\screens\auth
   mkdir app\screens\feed
   mkdir app\screens\profile
   mkdir app\screens\upload
   ```

5. Creación de archivos de servicios básicos:
   ```
   echo // Configuración de Supabase > app\services\supabase.ts
   echo // Configuración de Cloudinary > app\services\cloudinary.ts
   ```

6. Creación de archivo de tipos básicos:
   ```
   echo // Definiciones de tipos básicos > app\types\index.ts
   ```

7. Creación de archivos de configuración de entorno:
   ```
   echo SUPABASE_URL=your_supabase_url > .env.example
   echo SUPABASE_ANON_KEY=your_supabase_anon_key >> .env.example
   echo GOOGLE_CLIENT_ID=your_google_client_id >> .env.example
   echo CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name >> .env.example
   echo CLOUDINARY_API_KEY=your_cloudinary_api_key >> .env.example
   echo CLOUDINARY_API_SECRET=your_cloudinary_api_secret >> .env.example
   
   echo SUPABASE_URL= > .env
   echo SUPABASE_ANON_KEY= >> .env
   echo GOOGLE_CLIENT_ID= >> .env
   echo CLOUDINARY_CLOUD_NAME= >> .env
   echo CLOUDINARY_API_KEY= >> .env
   echo CLOUDINARY_API_SECRET= >> .env
   ```

### Estructura del Proyecto Actual

La estructura actual del proyecto es la siguiente:

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
├── node_modules/
├── .env
├── .env.example
├── App.tsx
├── app.json
├── index.ts
├── package.json
├── package-lock.json
├── README.md
└── tsconfig.json
```

## Fecha: 02/03/2025

### Corrección de Errores de Tipado TypeScript

Se han realizado las siguientes correcciones para solucionar los errores de tipado en TypeScript:

1. **Mejoras en el archivo de tipos (`app/types/index.ts`)**:
   - Modificada la interfaz `User` para extender el tipo de usuario de Supabase, haciéndola compatible con la API de autenticación
   - Añadido el tipo `NavigationProps` para manejar las propiedades de navegación en los componentes
   - Ajustados los campos opcionales en las interfaces para mayor flexibilidad

2. **Correcciones en los hooks personalizados (`app/hooks/index.ts`)**:
   - Añadidos tipos genéricos a los estados (`useState<User | null>`, `useState<Video[]>`)
   - Importados los tipos desde el archivo de tipos
   - Añadidos castings de tipo para manejar correctamente los datos de Supabase

3. **Mejoras en la pantalla de login (`app/screens/auth/LoginScreen.tsx`)**:
   - Añadido tipado para el componente (`React.FC<NavigationProps>`)
   - Corregido el manejo de errores con tipado adecuado (`error: any`)
   - Eliminada la opción `useProxy` que estaba causando errores
   - Añadido manejo de errores más robusto con fallbacks para mensajes de error

4. **Correcciones en la pantalla de feed (`app/screens/feed/FeedScreen.tsx`)**:
   - Añadido tipado para el componente (`React.FC`)
   - Corregido el uso de `ResizeMode` importándolo correctamente desde `expo-av`
   - Añadido tipado para el ref de FlatList (`useRef<FlatList<VideoType>>(null)`)
   - Añadido tipado para los elementos de la lista y los ViewToken
   - Corregido el casting de índice en el manejador de elementos visibles

Estas correcciones mejoran la seguridad de tipos y hacen que el código sea más robusto y mantenible, reduciendo la posibilidad de errores en tiempo de ejecución.

### Próximos Pasos

1. Implementar la pantalla de registro
2. Crear la pantalla de perfil
3. Implementar la pantalla de subida de videos (solo para comercios)
4. Mejorar la UI/UX de la aplicación

### Notas Importantes

- La aplicación tendrá dos tipos de usuarios: Comercios (pueden subir videos) y Usuarios regulares (solo pueden ver)
- Se utilizará Supabase para gestionar la autenticación y los roles de usuario
- Los videos se almacenarán en Cloudinary
- La aplicación se desarrollará inicialmente para Android y Web usando Expo 