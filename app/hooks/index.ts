/**
 * Hooks personalizados para la aplicación
 */

import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { User, Video } from "../types";

// Hook para manejar la autenticación
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar usuario al iniciar
    const loadUser = async () => {
      try {
        console.log("useAuth: Cargando usuario...");

        // Obtener sesión actual primero
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) {
          console.error("useAuth: Error al obtener sesión:", sessionError);
          setLoading(false);
          return;
        }

        // Verificar si hay una sesión activa
        if (sessionData?.session) {
          console.log(
            "useAuth: Sesión encontrada, usuario:",
            sessionData.session.user.email
          );
          setUser(sessionData.session.user as User);

          // Intentar obtener el rol del usuario
          try {
            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("role")
              .eq("id", sessionData.session.user.id)
              .single();

            if (profileError) {
              // Si el perfil no existe, es posible que el trigger no se haya ejecutado
              if (profileError.code === "PGRST116") {
                console.warn(
                  "useAuth: No se encontró el perfil del usuario, creando uno nuevo..."
                );

                // Crear el perfil manualmente si no existe
                const { error: insertError } = await supabase
                  .from("profiles")
                  .insert({
                    id: sessionData.session.user.id,
                    display_name: sessionData.session.user.email,
                    role: "user",
                  });

                if (insertError) {
                  console.error("useAuth: Error al crear perfil:", insertError);
                } else {
                  console.log("useAuth: Perfil creado correctamente");
                  setRole("user");
                }
              } else {
                console.error("useAuth: Error al obtener rol:", profileError);
              }
            } else {
              console.log("useAuth: Rol obtenido:", profileData?.role);
              setRole(profileData?.role || null);
            }
          } catch (roleError) {
            console.error("useAuth: Error al procesar rol:", roleError);
          }
        } else {
          console.log("useAuth: No hay sesión activa");
          setUser(null);
          setRole(null);
        }
      } catch (error) {
        console.error("useAuth: Error general al cargar el usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();

    // Suscribirse a cambios de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("useAuth: Evento de autenticación:", event);

        if (session) {
          console.log("useAuth: Usuario autenticado:", session.user.email);
          setUser(session.user as User);

          // Obtener rol después de la autenticación
          try {
            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("role")
              .eq("id", session.user.id)
              .single();

            if (profileError) {
              // Si el perfil no existe, intentar crearlo
              if (profileError.code === "PGRST116") {
                console.warn(
                  "useAuth: No se encontró el perfil en cambio de estado, creando uno nuevo..."
                );

                // Crear el perfil manualmente si no existe
                const { error: insertError } = await supabase
                  .from("profiles")
                  .insert({
                    id: session.user.id,
                    display_name: session.user.email,
                    role: "user",
                  });

                if (insertError) {
                  console.error(
                    "useAuth: Error al crear perfil en cambio de estado:",
                    insertError
                  );
                } else {
                  console.log(
                    "useAuth: Perfil creado correctamente en cambio de estado"
                  );
                  setRole("user");
                }
              } else {
                console.error(
                  "useAuth: Error al obtener rol en cambio de estado:",
                  profileError
                );
              }
            } else {
              console.log(
                "useAuth: Rol obtenido en cambio de estado:",
                profileData?.role
              );
              setRole(profileData?.role || null);
            }
          } catch (roleError) {
            console.error(
              "useAuth: Error al procesar rol en cambio de estado:",
              roleError
            );
          }
        } else {
          console.log("useAuth: Usuario desconectado");
          setUser(null);
          setRole(null);
        }
      }
    );

    return () => {
      console.log("useAuth: Cancelando suscripción a eventos de autenticación");
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return { user, role, loading };
};

// Hook para manejar videos
export const useVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const { data, error } = await supabase
          .from("videos")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setVideos((data as Video[]) || []);
      } catch (error) {
        console.error("Error al cargar los videos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  return { videos, loading };
};
