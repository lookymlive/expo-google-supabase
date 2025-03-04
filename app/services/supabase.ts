/**
 * Configuración de Supabase para la aplicación
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";
import "react-native-url-polyfill/auto";

// Adaptador para almacenamiento usando AsyncStorage como alternativa a SecureStore
const AsyncStorageAdapter = {
  getItem: async (key: string) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error("AsyncStorage getItem error:", error);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error("AsyncStorage setItem error:", error);
    }
  },
  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error("AsyncStorage removeItem error:", error);
    }
  },
};

// Obtener las variables de entorno desde Constants
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || "";
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || "";

// Verificar si las variables están definidas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Error: Las variables de entorno de Supabase no están definidas correctamente."
  );
  console.error("supabaseUrl:", supabaseUrl);
  console.error("supabaseAnonKey:", supabaseAnonKey);
}

// Crear el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Función para obtener el usuario actual
export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

// Función para obtener el rol del usuario
export const getUserRole = async () => {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error al obtener el rol del usuario:", error);

    // Si el perfil no existe, crear uno nuevo
    if (error.code === "PGRST116") {
      console.log("Perfil no encontrado, creando uno nuevo...");
      return await createUserProfile(user.id, user.email);
    }

    return null;
  }

  return data?.role;
};

// Función para crear un perfil de usuario manualmente
export const createUserProfile = async (userId: string, email?: string) => {
  try {
    // Crear un perfil para el usuario con rol 'user' por defecto
    const { data, error } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        display_name: email || "Usuario",
        role: "user",
      })
      .select("role")
      .single();

    if (error) {
      console.error("Error al crear perfil de usuario:", error);
      return null;
    }

    console.log("Perfil creado con éxito:", data);
    return data?.role;
  } catch (error) {
    console.error("Error al crear perfil:", error);
    return null;
  }
};

// Función para verificar y diagnosticar problemas comunes
export const diagnoseSupabaseIssues = async () => {
  const results = {
    connection: false,
    auth: false,
    profile: false,
    tables: {
      profiles: false,
      videos: false,
      comments: false,
      likes: false,
    },
    triggers: false,
    errors: [] as string[],
  };

  try {
    // 1. Verificar conexión básica
    const { data: healthCheck, error: healthError } = await supabase
      .from("_rpc/diagnose_issues")
      .select("*");
    results.connection = !healthError;

    if (healthError) {
      results.errors.push(`Error de conexión: ${healthError.message}`);
      return results;
    }

    // 2. Verificar tablas
    try {
      const { error: profilesError } = await supabase
        .from("profiles")
        .select("count")
        .limit(1);
      results.tables.profiles = !profilesError;

      if (profilesError) {
        results.errors.push(
          `Error en tabla profiles: ${profilesError.message}`
        );
      }
    } catch (e) {
      results.errors.push("La tabla profiles no existe o no es accesible");
    }

    try {
      const { error: videosError } = await supabase
        .from("videos")
        .select("count")
        .limit(1);
      results.tables.videos = !videosError;

      if (videosError) {
        results.errors.push(`Error en tabla videos: ${videosError.message}`);
      }
    } catch (e) {
      results.errors.push("La tabla videos no existe o no es accesible");
    }

    // 3. Verificar autenticación
    const { data: session, error: sessionError } =
      await supabase.auth.getSession();
    results.auth = !!session?.session;

    if (sessionError) {
      results.errors.push(`Error de sesión: ${sessionError.message}`);
    }

    // 4. Si hay sesión, verificar perfil
    if (session?.session) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.session.user.id)
        .single();

      results.profile = !!profile;

      if (profileError) {
        results.errors.push(
          `Error al verificar perfil: ${profileError.message}`
        );

        // Intentar crear el perfil si no existe
        if (profileError.code === "PGRST116") {
          const roleResult = await createUserProfile(
            session.session.user.id,
            session.session.user.email
          );

          if (roleResult) {
            results.profile = true;
            results.errors.push(
              "Perfil creado manualmente - el trigger no funcionó"
            );
          }
        }
      }
    }

    return results;
  } catch (error: any) {
    results.errors.push(`Error general: ${error.message}`);
    return results;
  }
};
