/**
 * ESTEPA MARKETING - CONFIGURACIÓN DE SUPABASE
 * 
 * IMPORTANTE: Este es un archivo de ejemplo
 * 1. Copia este archivo y renómbralo a 'supabase-config.js'
 * 2. Reemplaza los valores de ejemplo con tus credenciales reales
 * 3. NUNCA subas el archivo con credenciales reales a Git
 * 4. Asegúrate de que 'supabase-config.js' esté en .gitignore
 */

export const CONFIG = {
  // Configuración de Supabase
  supabase: {
    // URL de tu proyecto Supabase
    // Ejemplo: 'https://xxxxxxxxxxxxx.supabase.co'
    url: 'https://xxx.supabase.co',
    
    // Anon Key de Supabase (clave pública)
    // Se obtiene desde: Settings > API > Project API keys > anon public
    anonKey: 'tu-anon-key-aqui',
    
    // Service Role Key (solo para funciones edge/backend)
    // ⚠️ NUNCA expongas esta clave en el frontend
    // Se obtiene desde: Settings > API > Project API keys > service_role secret
    serviceRoleKey: 'tu-service-role-key-aqui'
  },
  
  // Configuración de OpenAI
  openai: {
    // API Key de OpenAI
    // Se obtiene desde: https://platform.openai.com/api-keys
    // ⚠️ Esta key debe configurarse en Supabase Edge Functions
    // No la incluyas en el código del frontend
    apiKey: 'sk-xxx'
  },
  
  // Configuración de Storage
  storage: {
    // Nombre del bucket principal para media
    mediaBucket: 'media',
    
    // Tamaño máximo de archivo (en bytes)
    maxFileSize: 50 * 1024 * 1024, // 50 MB
    
    // Tipos de archivo permitidos
    allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    allowedVideoTypes: ['video/mp4', 'video/webm', 'video/mov'],
    allowedDocumentTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  },
  
  // Configuración de la aplicación
  app: {
    // Nombre de la aplicación
    name: 'Estepa Marketing Admin',
    
    // URL base de la aplicación
    baseUrl: 'http://localhost:8000',
    
    // Activar modo debug
    debug: true,
    
    // Paginación por defecto
    defaultPageSize: 20,
    
    // Idioma por defecto
    defaultLanguage: 'es'
  }
}

// Validar configuración en desarrollo
if (CONFIG.app.debug) {
  console.log('⚠️ Modo debug activado')
  
  if (CONFIG.supabase.url === 'https://xxx.supabase.co') {
    console.warn('⚠️ ADVERTENCIA: Configura tu URL de Supabase en config/supabase-config.js')
  }
  
  if (CONFIG.supabase.anonKey === 'tu-anon-key-aqui') {
    console.warn('⚠️ ADVERTENCIA: Configura tu Anon Key de Supabase en config/supabase-config.js')
  }
}
