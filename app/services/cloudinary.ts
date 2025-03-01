/**
 * Configuración de Cloudinary para la aplicación
 */

// Configuración de Cloudinary
const cloudinaryConfig = {
  cloudName: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
  apiKey: process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY || "",
  apiSecret: process.env.EXPO_PUBLIC_CLOUDINARY_API_SECRET || "",
};

// Función para subir un video a Cloudinary
export const uploadVideo = async (uri: string, options = {}) => {
  try {
    const formData = new FormData();
    formData.append("file", {
      uri,
      type: "video/mp4",
      name: "upload.mp4",
    } as any);

    formData.append("upload_preset", "social_commerce_videos");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/video/upload`,
      {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return data;
  } catch (error) {
    console.error("Error al subir el video a Cloudinary:", error);
    throw error;
  }
};

// Función para obtener la URL de un video
export const getVideoUrl = (publicId: string) => {
  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/video/upload/${publicId}`;
};
