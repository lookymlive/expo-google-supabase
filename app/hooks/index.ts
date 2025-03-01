/**
 * Hooks personalizados para la aplicación
 */

import { useEffect, useState } from "react";
import { getCurrentUser, getUserRole, supabase } from "../services/supabase";
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
        const currentUser = await getCurrentUser();
        setUser(currentUser as User | null);

        if (currentUser) {
          const userRole = await getUserRole();
          setRole(userRole);
        }
      } catch (error) {
        console.error("Error al cargar el usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();

    // Suscribirse a cambios de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user as User | null);

        if (session?.user) {
          const userRole = await getUserRole();
          setRole(userRole);
        } else {
          setRole(null);
        }
      }
    );

    return () => {
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
