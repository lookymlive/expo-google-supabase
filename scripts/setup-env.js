/**
 * Script para ayudar a configurar las variables de entorno
 * Ejecutar con: node scripts/setup-env.js
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Rutas de archivos
const envPath = path.join(__dirname, "..", ".env");
const envJsPath = path.join(__dirname, "..", ".env.js");
const envExamplePath = path.join(__dirname, "..", ".env.example");

// Variables requeridas
const requiredVars = [
  {
    name: "EXPO_PUBLIC_SUPABASE_URL",
    description:
      "URL de tu proyecto Supabase (ej: https://xxxxxxxxxxxx.supabase.co)",
    example: "https://abcdefghijkl.supabase.co",
  },
  {
    name: "EXPO_PUBLIC_SUPABASE_ANON_KEY",
    description:
      "Clave anónima de Supabase (encontrada en Configuración > API)",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  },
  {
    name: "EXPO_PUBLIC_GOOGLE_CLIENT_ID",
    description: "ID de cliente de OAuth de Google",
    example: "123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com",
  },
  {
    name: "EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME",
    description: "Nombre de la nube de Cloudinary",
    example: "tu-nombre-de-nube",
  },
  {
    name: "EXPO_PUBLIC_CLOUDINARY_API_KEY",
    description: "Clave API de Cloudinary",
    example: "123456789012345",
  },
  {
    name: "EXPO_PUBLIC_CLOUDINARY_API_SECRET",
    description: "Secreto API de Cloudinary",
    example: "abcdefghijklmnopqrstuvwxyz",
  },
];

// Verificar si los archivos existen
if (!fs.existsSync(envExamplePath)) {
  console.error("❌ Error: No se encontró el archivo .env.example");
  process.exit(1);
}

// Cargar valores existentes si existen
let existingEnvValues = {};
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      existingEnvValues[match[1]] = match[2];
    }
  });
}

let existingEnvJsValues = {};
if (fs.existsSync(envJsPath)) {
  try {
    const envJs = require(envJsPath);
    existingEnvJsValues = envJs;
  } catch (error) {
    console.warn("⚠️ No se pudo cargar .env.js:", error.message);
  }
}

console.log("🔧 Configuración de variables de entorno para SocialCommerce");
console.log("📝 Por favor, ingresa los valores para las siguientes variables:");
console.log("💡 Presiona Enter para mantener el valor actual (si existe)");
console.log("");

// Función para solicitar valores
const askForValues = async () => {
  const values = {};

  for (const variable of requiredVars) {
    const currentValue = existingEnvValues[variable.name] || "";
    const displayValue = currentValue ? ` (actual: ${currentValue})` : "";

    const answer = await new Promise((resolve) => {
      rl.question(`${variable.name}${displayValue}: `, (answer) => {
        resolve(answer || currentValue);
      });
    });

    values[variable.name] = answer;
  }

  return values;
};

// Función para guardar valores en .env
const saveEnvFile = (values) => {
  let content = "";
  for (const [key, value] of Object.entries(values)) {
    content += `${key}=${value}\n`;
  }

  fs.writeFileSync(envPath, content);
  console.log("✅ Archivo .env guardado correctamente");
};

// Función para guardar valores en .env.js
const saveEnvJsFile = (values) => {
  let content = `// Configuración de variables de entorno para Expo
// Este archivo debe ser importado en app.config.js

module.exports = {
`;

  for (const [key, value] of Object.entries(values)) {
    content += `  ${key}: "${value}",\n`;
  }

  content += "};";

  fs.writeFileSync(envJsPath, content);
  console.log("✅ Archivo .env.js guardado correctamente");
};

// Ejecutar el script
(async () => {
  try {
    const values = await askForValues();

    // Guardar valores
    saveEnvFile(values);
    saveEnvJsFile(values);

    console.log("");
    console.log("🎉 Configuración completada con éxito!");
    console.log("🚀 Ahora puedes ejecutar la aplicación con: npm start");
    console.log("");
    console.log(
      "💡 Para verificar que todo está configurado correctamente, ejecuta:"
    );
    console.log("   npm run check-env");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    rl.close();
  }
})();
