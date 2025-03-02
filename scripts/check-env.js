/**
 * Script para verificar que las variables de entorno estén correctamente configuradas
 * Ejecutar con: node scripts/check-env.js
 */

const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Cargar variables de entorno
dotenv.config();

// Variables requeridas
const requiredVars = [
  "EXPO_PUBLIC_SUPABASE_URL",
  "EXPO_PUBLIC_SUPABASE_ANON_KEY",
  "EXPO_PUBLIC_GOOGLE_CLIENT_ID",
  "EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME",
  "EXPO_PUBLIC_CLOUDINARY_API_KEY",
  "EXPO_PUBLIC_CLOUDINARY_API_SECRET",
];

// Verificar .env
console.log("🔍 Verificando archivo .env...");
const envPath = path.join(__dirname, "..", ".env");

if (!fs.existsSync(envPath)) {
  console.error("❌ Error: No se encontró el archivo .env");
  console.log(
    "💡 Tip: Copia .env.example a .env y completa con tus credenciales"
  );
  process.exit(1);
}

// Verificar .env.js
console.log("🔍 Verificando archivo .env.js...");
const envJsPath = path.join(__dirname, "..", ".env.js");

if (!fs.existsSync(envJsPath)) {
  console.error("❌ Error: No se encontró el archivo .env.js");
  console.log(
    "💡 Tip: Crea el archivo .env.js con el mismo contenido que .env"
  );
  process.exit(1);
}

// Verificar variables en .env
let missingVars = [];
for (const varName of requiredVars) {
  if (
    !process.env[varName] ||
    process.env[varName].includes("tu-") ||
    process.env[varName] === ""
  ) {
    missingVars.push(varName);
  }
}

if (missingVars.length > 0) {
  console.error(
    "❌ Error: Faltan las siguientes variables en .env o tienen valores de ejemplo:"
  );
  missingVars.forEach((varName) => console.error(`  - ${varName}`));
  console.log("💡 Tip: Completa estas variables con tus credenciales reales");
  process.exit(1);
}

// Verificar variables en .env.js
try {
  const envJs = require(envJsPath);
  let missingJsVars = [];

  for (const varName of requiredVars) {
    if (
      !envJs[varName] ||
      envJs[varName].includes("tu-") ||
      envJs[varName] === ""
    ) {
      missingJsVars.push(varName);
    }
  }

  if (missingJsVars.length > 0) {
    console.error(
      "❌ Error: Faltan las siguientes variables en .env.js o tienen valores de ejemplo:"
    );
    missingJsVars.forEach((varName) => console.error(`  - ${varName}`));
    console.log("💡 Tip: Completa estas variables con tus credenciales reales");
    process.exit(1);
  }
} catch (error) {
  console.error("❌ Error al leer .env.js:", error.message);
  process.exit(1);
}

// Verificar que las variables coincidan entre .env y .env.js
try {
  const envJs = require(envJsPath);
  let mismatchVars = [];

  for (const varName of requiredVars) {
    if (process.env[varName] !== envJs[varName]) {
      mismatchVars.push(varName);
    }
  }

  if (mismatchVars.length > 0) {
    console.warn(
      "⚠️ Advertencia: Las siguientes variables no coinciden entre .env y .env.js:"
    );
    mismatchVars.forEach((varName) => console.warn(`  - ${varName}`));
    console.log(
      "💡 Tip: Asegúrate de que los valores sean idénticos en ambos archivos"
    );
  }
} catch (error) {
  console.error("❌ Error al comparar variables:", error.message);
}

console.log(
  "✅ Todas las variables de entorno están correctamente configuradas"
);
console.log("🚀 Puedes ejecutar la aplicación con: npm start");
