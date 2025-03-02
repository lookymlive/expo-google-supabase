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

## Fecha: 03/03/2025

### Implementación de Navegación y Pantallas Adicionales

Se han realizado las siguientes mejoras para implementar la navegación y pantallas adicionales:

1. **Pantalla de Registro (`app/screens/auth/RegisterScreen.tsx`)**:
   - Implementada la pantalla de registro con validación de formularios
   - Añadida la opción para seleccionar el tipo de usuario (comercio o usuario regular)
   - Integrada con Supabase para crear usuarios y perfiles

2. **Pantalla de Perfil (`app/screens/profile/ProfileScreen.tsx`)**:
   - Creada la pantalla de perfil con información del usuario
   - Implementada la funcionalidad para cerrar sesión
   - Añadida visualización condicional para usuarios de tipo comercio
   - Preparada la estructura para mostrar los videos del usuario

3. **Mejoras en la Navegación**:
   - Añadida la navegación por pestañas con iconos usando `@expo/vector-icons`
   - Configurados los estilos y opciones de navegación
   - Implementada la pantalla de carga mientras se verifica la autenticación

4. **Organización del Código**:
   - Creados archivos de índice para exportar componentes
   - Mejorada la estructura de importaciones
   - Añadidos comentarios explicativos

Estas mejoras proporcionan una estructura básica funcional para la aplicación, permitiendo a los usuarios registrarse, iniciar sesión, ver su perfil y navegar entre las diferentes secciones.

### Próximos Pasos

1. Implementar la pantalla de subida de videos (solo para comercios)
2. Mejorar la UI/UX de la aplicación
3. Implementar la funcionalidad de búsqueda de videos
4. Añadir interacciones sociales (likes, comentarios) 

## Fecha: 04/03/2025

### Configuración de Variables de Entorno para Expo

Se han realizado las siguientes mejoras para solucionar el error "supabaseUrl is required":

1. **Configuración de Variables de Entorno**:
   - Creado archivo `.env.js` con las variables de entorno necesarias para la aplicación
   - Actualizado archivo `.env` con los prefijos EXPO_PUBLIC_ para compatibilidad con Expo
   - Creado archivo `app.config.js` para cargar las variables de entorno en la configuración de Expo

2. **Mejoras en la Configuración de Supabase**:
   - Modificado el archivo `app/services/supabase.ts` para usar `Constants.expoConfig.extra`
   - Añadida verificación de variables de entorno para mostrar mensajes de error más claros
   - Mejorada la gestión de errores en la configuración de Supabase

3. **Dependencias Instaladas**:
   - Instalado `dotenv` para cargar variables de entorno
   - Instalado `react-native-dotenv` para integración con Babel

Estas mejoras permiten una mejor gestión de las variables de entorno en la aplicación, facilitando la configuración de servicios externos como Supabase y Cloudinary.

### Próximos Pasos

1. Completar la configuración de Supabase con los valores reales
2. Implementar la pantalla de subida de videos (solo para comercios)
3. Mejorar la UI/UX de la aplicación
4. Implementar la funcionalidad de búsqueda de videos
5. Añadir interacciones sociales (likes, comentarios) 

## Fecha: 05/03/2025

### Configuración de Servicios Externos (Supabase, Google, Cloudinary)

Se han configurado los servicios externos necesarios para el funcionamiento de la aplicación:

#### 1. Configuración de Supabase

1. **Crear una cuenta y proyecto en Supabase**:
   - Registrarse en [https://supabase.com](https://supabase.com)
   - Crear un nuevo proyecto con nombre "SocialCommerce"
   - Seleccionar la región más cercana a los usuarios

2. **Obtener credenciales**:
   - En Configuración > API, copiar:
     - URL del proyecto (`https://xxxxxxxxxxxx.supabase.co`)
     - Clave anónima (anon key)

3. **Configurar tablas en la base de datos**:
   - Tabla `profiles`:
     ```sql
     CREATE TABLE profiles (
       id UUID PRIMARY KEY REFERENCES auth.users(id),
       display_name TEXT NOT NULL,
       avatar_url TEXT,
       role TEXT DEFAULT 'user',
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
     );
     ```
   - Tabla `videos`:
     ```sql
     CREATE TABLE videos (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       user_id UUID REFERENCES profiles(id),
       title TEXT NOT NULL,
       description TEXT,
       video_url TEXT NOT NULL,
       thumbnail_url TEXT,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
     );
     ```

4. **Configurar políticas de seguridad RLS (Row Level Security)**:
   - Para `profiles`:
     ```sql
     -- Permitir lectura pública
     CREATE POLICY "Perfiles visibles para todos" ON profiles
       FOR SELECT USING (true);
     
     -- Permitir actualización solo al propio usuario
     CREATE POLICY "Los usuarios pueden actualizar sus perfiles" ON profiles
       FOR UPDATE USING (auth.uid() = id);
     ```
   - Para `videos`:
     ```sql
     -- Permitir lectura pública
     CREATE POLICY "Videos visibles para todos" ON videos
       FOR SELECT USING (true);
     
     -- Permitir inserción solo a usuarios autenticados
     CREATE POLICY "Los usuarios pueden insertar sus videos" ON videos
       FOR INSERT WITH CHECK (auth.uid() = user_id);
     
     -- Permitir actualización solo al propietario
     CREATE POLICY "Los usuarios pueden actualizar sus videos" ON videos
       FOR UPDATE USING (auth.uid() = user_id);
     
     -- Permitir eliminación solo al propietario
     CREATE POLICY "Los usuarios pueden eliminar sus videos" ON videos
       FOR DELETE USING (auth.uid() = user_id);
     ```

#### 2. Configuración de Google Auth

1. **Crear proyecto en Google Cloud Platform**:
   - Ir a [https://console.cloud.google.com](https://console.cloud.google.com)
   - Crear nuevo proyecto "SocialCommerce"

2. **Configurar pantalla de consentimiento OAuth**:
   - En "APIs y servicios" > "Pantalla de consentimiento de OAuth"
   - Seleccionar "Externo"
   - Completar información requerida (nombre, correo de soporte, etc.)

3. **Crear credenciales OAuth**:
   - En "APIs y servicios" > "Credenciales"
   - Crear "ID de cliente de OAuth" para aplicación web
   - Agregar orígenes autorizados:
     - `http://localhost:8081`
     - `https://auth.expo.io`
   - Agregar URIs de redirección:
     - `https://auth.expo.io/@tu-usuario/social-commerce`

4. **Habilitar APIs necesarias**:
   - Google Sign-In API
   - Google People API

#### 3. Configuración de Cloudinary

1. **Crear cuenta en Cloudinary**:
   - Registrarse en [https://cloudinary.com](https://cloudinary.com)

2. **Obtener credenciales**:
   - Del dashboard, copiar:
     - Cloud name
     - API Key
     - API Secret

3. **Configurar un preset para subida de videos**:
   - En Settings > Upload
   - Crear un nuevo upload preset
   - Configurar como "Unsigned"
   - Establecer carpeta de destino (por ejemplo, "social_commerce_videos")
   - Configurar transformaciones automáticas si es necesario

#### 4. Actualización de archivos de configuración

1. **Actualizar `.env` y `.env.js` con las credenciales reales**:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   EXPO_PUBLIC_GOOGLE_CLIENT_ID=123456789-xxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
   EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=tu-cloud-name
   EXPO_PUBLIC_CLOUDINARY_API_KEY=123456789012345
   EXPO_PUBLIC_CLOUDINARY_API_SECRET=xxxxxxxxxxxxxxxxxxxxxx
   ```

2. **Verificar la configuración**:
   - Reiniciar la aplicación
   - Comprobar que no aparecen errores relacionados con las variables de entorno
   - Verificar que la autenticación funciona correctamente

#### 5. Scripts de Ayuda para la Configuración

Para facilitar la configuración de las variables de entorno, se han creado dos scripts:

1. **Script de configuración asistida**:
   - Ubicación: `scripts/setup-env.js`
   - Ejecución: `npm run setup-env`
   - Funcionalidad: Guía al usuario paso a paso para configurar todas las variables de entorno necesarias, actualizando automáticamente los archivos `.env` y `.env.js`.

2. **Script de verificación de configuración**:
   - Ubicación: `scripts/check-env.js`
   - Ejecución: `npm run check-env`
   - Funcionalidad: Verifica que todas las variables de entorno estén correctamente configuradas en los archivos `.env` y `.env.js`, mostrando mensajes de error o advertencia según corresponda.

Estos scripts mejoran la experiencia de desarrollo al simplificar el proceso de configuración y reducir los errores relacionados con las variables de entorno.

### Próximos Pasos

1. Implementar la pantalla de subida de videos (solo para comercios)
2. Mejorar la UI/UX de la aplicación
3. Implementar la funcionalidad de búsqueda de videos
4. Añadir interacciones sociales (likes, comentarios) 