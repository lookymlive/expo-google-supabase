const ENV = require("./.env.js");

export default {
  expo: {
    name: "SocialCommerce",
    slug: "social-commerce",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      supabaseUrl: ENV.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: ENV.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      googleClientId: ENV.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
      cloudinaryCloudName: ENV.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME,
      cloudinaryApiKey: ENV.EXPO_PUBLIC_CLOUDINARY_API_KEY,
      cloudinaryApiSecret: ENV.EXPO_PUBLIC_CLOUDINARY_API_SECRET,
    },
  },
};
