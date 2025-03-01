/**
 * Definiciones de tipos básicos para la aplicación
 */

import { User as SupabaseUser } from "@supabase/supabase-js";

// Tipo para usuario extendiendo el tipo de Supabase
export interface User
  extends Omit<SupabaseUser, "app_metadata" | "user_metadata"> {
  role?: "business" | "user"; // Rol: comercio o usuario regular
  displayName?: string;
  photoURL?: string;
  createdAt?: string;
}

// Tipo para video
export interface Video {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  userId: string; // ID del comercio que subió el video
  createdAt: string;
  likes: number;
  comments: number;
}

// Tipo para comentario
export interface Comment {
  id: string;
  videoId: string;
  userId: string;
  text: string;
  createdAt: string;
}

// Tipo para los parámetros de navegación
export type NavigationProps = {
  navigation: any;
  route: any;
};
