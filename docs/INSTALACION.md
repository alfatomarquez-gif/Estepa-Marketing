# 📚 Guía de Instalación - Sistema de Gestión Administrativa

Esta guía te llevará paso a paso por la instalación y configuración del dashboard administrativo de Estepa Marketing.

## 📋 Prerequisitos

Antes de comenzar, asegúrate de tener:

- ✅ Una cuenta en [Supabase](https://supabase.com) (gratuita)
- ✅ Una cuenta en [OpenAI](https://platform.openai.com) (para FAQs con IA)
- ✅ Un navegador web moderno (Chrome, Firefox, Safari, Edge)
- ✅ Un servidor web local (opcional para desarrollo)

## 🚀 Instalación

### Paso 1: Crear Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com) y crea una cuenta o inicia sesión
2. Haz clic en "New Project"
3. Completa los datos:
   - **Name**: Estepa Marketing
   - **Database Password**: (guarda esta contraseña de forma segura)
   - **Region**: Elige la más cercana a tu ubicación
4. Haz clic en "Create new project" y espera 1-2 minutos

### Paso 2: Ejecutar el Schema de Base de Datos

1. En tu proyecto de Supabase, ve a la sección **SQL Editor** en el menú lateral
2. Haz clic en "New query"
3. Abre el archivo `database/schema.sql` de este repositorio
4. Copia TODO el contenido del archivo
5. Pégalo en el editor SQL de Supabase
6. Haz clic en "Run" (▶️) para ejecutar el script
7. Verifica que no haya errores (deberías ver "Success. No rows returned")

**Verificación**: Ve a "Table Editor" y deberías ver las 9 tablas creadas:
- empresa
- media
- contenido
- mensajes
- faq
- plantillas
- calendario
- analytics

### Paso 3: Configurar Storage (Bucket de Media)

1. En Supabase, ve a **Storage** en el menú lateral
2. Haz clic en "Create a new bucket"
3. Completa los datos:
   - **Name**: `media`
   - **Public bucket**: ✅ Activar (para acceso público a archivos)
4. Haz clic en "Create bucket"

**Configurar Políticas de Storage**:
1. Haz clic en el bucket `media` que acabas de crear
2. Ve a "Policies"
3. Crea las siguientes políticas:

**Política de SELECT (lectura pública)**:
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'media' );
```

**Política de INSERT (upload autenticado)**:
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'media' );
```

### Paso 4: Deploy de Edge Functions (FAQ con IA)

**Opción A: Usando Supabase CLI (Recomendado)**

1. Instala Supabase CLI:
```bash
npm install -g supabase
```

2. Inicia sesión:
```bash
supabase login
```

3. Vincula tu proyecto:
```bash
supabase link --project-ref tu-project-ref
```
*(Encuentra tu project-ref en Settings > General > Reference ID)*

4. Despliega la función:
```bash
cd supabase/functions/generar-faq
supabase functions deploy generar-faq
```

**Opción B: Manualmente en el Dashboard**

1. Ve a **Edge Functions** en Supabase
2. Crea una nueva función llamada `generar-faq`
3. Copia el contenido de `supabase/functions/generar-faq/index.ts`
4. Pégalo en el editor
5. Haz clic en "Deploy"

### Paso 5: Configurar Variables de Entorno

1. En Supabase, ve a **Settings > Edge Functions**
2. En la sección "Secrets", agrega las siguientes variables:
   - **OPENAI_API_KEY**: Tu API key de OpenAI
   - **SUPABASE_URL**: La URL de tu proyecto (ya está configurada)
   - **SUPABASE_SERVICE_ROLE_KEY**: Ya está configurada

**Obtener API Key de OpenAI**:
1. Ve a [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Inicia sesión o crea una cuenta
3. Haz clic en "Create new secret key"
4. Copia la key y guárdala de forma segura

### Paso 6: Configurar el Frontend

1. Ve a **Settings > API** en Supabase
2. Copia las siguientes credenciales:
   - **Project URL**
   - **anon public key**

3. En el repositorio, copia el archivo de configuración:
```bash
cp config/supabase-config.example.js config/supabase-config.js
```

4. Abre `config/supabase-config.js` y actualiza:
```javascript
export const CONFIG = {
  supabase: {
    url: 'TU-PROJECT-URL-AQUI',
    anonKey: 'TU-ANON-KEY-AQUI',
  },
  // ... resto de la configuración
}
```

5. **IMPORTANTE**: Actualiza también las credenciales en `assets/js/supabase-client.js`:
```javascript
const SUPABASE_URL = 'TU-PROJECT-URL-AQUI';
const SUPABASE_KEY = 'TU-ANON-KEY-AQUI';
```

### Paso 7: Configurar Row Level Security (RLS) - Opcional

Por defecto, el schema tiene RLS deshabilitado para facilitar el desarrollo. En producción, se recomienda activarlo:

1. Ve a **Authentication > Policies** en Supabase
2. Para cada tabla, crea políticas según tus necesidades de seguridad

**Ejemplo de política básica**:
```sql
-- Permitir todo a usuarios autenticados
CREATE POLICY "Enable all for authenticated users"
ON empresa
FOR ALL
USING (auth.role() = 'authenticated');
```

## 🌐 Ejecutar la Aplicación

### Desarrollo Local

**Opción 1: Python (Simple HTTP Server)**
```bash
cd /ruta/al/proyecto
python -m http.server 8000
```

**Opción 2: Node.js (npx serve)**
```bash
cd /ruta/al/proyecto
npx serve
```

**Opción 3: PHP**
```bash
cd /ruta/al/proyecto
php -S localhost:8000
```

Luego abre tu navegador en: `http://localhost:8000/admin/dashboard.html`

### Producción

Para producción, puedes usar:

1. **Netlify**: 
   - Conecta tu repositorio de GitHub
   - Deploy automático en cada push

2. **Vercel**:
   - Conecta tu repositorio
   - Configuración automática

3. **GitHub Pages**:
   - Habilita Pages en la configuración del repositorio
   - Selecciona la rama main

4. **Servidor tradicional**:
   - Sube los archivos vía FTP/SFTP
   - Configura tu dominio

## ✅ Verificación de la Instalación

1. **Verifica la conexión a Supabase**:
   - Abre el dashboard (`admin/dashboard.html`)
   - Abre la consola del navegador (F12)
   - Deberías ver: "Supabase client initialized"

2. **Prueba crear una empresa**:
   - Ve a "Empresas" en el sidebar
   - Haz clic en "Nueva Empresa"
   - Completa el formulario
   - Guarda

3. **Prueba el generador de FAQs**:
   - Ve a "FAQs con IA"
   - Selecciona la empresa que creaste
   - Escribe un prompt
   - Haz clic en "Generar FAQs"

4. **Verifica el upload de archivos**:
   - Ve a "Media"
   - Arrastra un archivo al área de drop
   - Verifica que se suba correctamente

## 🔒 Seguridad

### Mejores Prácticas

1. **Nunca subas credenciales a Git**:
   - El archivo `config/supabase-config.js` está en `.gitignore`
   - Mantén tus API keys seguras

2. **Usa variables de entorno en producción**:
   ```javascript
   const SUPABASE_URL = process.env.SUPABASE_URL || 'fallback-url';
   ```

3. **Habilita RLS en producción**:
   - Protege tus datos con políticas de acceso
   - Restringe operaciones por roles

4. **Configura CORS apropiadamente**:
   - En Supabase Settings > API
   - Agrega solo los dominios permitidos

5. **Mantén actualizado Supabase**:
   - Revisa regularmente el dashboard de Supabase
   - Aplica actualizaciones de seguridad

## 🐛 Solución de Problemas

### Error: "Invalid API key"
- Verifica que copiaste correctamente la URL y API key
- Asegúrate de usar `anon public` key, no `service_role`

### Error: "relation does not exist"
- Verifica que ejecutaste el schema completo
- Ve a Table Editor y confirma que las tablas existen

### Error en Edge Functions
- Verifica que la función está desplegada
- Revisa los logs en Supabase > Edge Functions > Logs
- Confirma que OPENAI_API_KEY está configurada

### Archivos no se suben
- Verifica que el bucket `media` existe
- Confirma que las políticas de storage están creadas
- Revisa el tamaño del archivo (límite: 50MB)

### No carga el dashboard
- Verifica que estás usando un servidor web (no file://)
- Abre la consola del navegador para ver errores
- Confirma que los archivos CSS/JS están cargando

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs de la consola del navegador (F12)
2. Revisa los logs de Supabase (Logs > Edge Functions)
3. Consulta la documentación de [Supabase](https://supabase.com/docs)
4. Abre un issue en el repositorio

## 🎉 ¡Listo!

Tu sistema de gestión administrativa está completamente instalado y configurado. ¡Comienza a gestionar tus empresas, contenido y campañas!

### Próximos Pasos

- 📱 Conecta las APIs de redes sociales
- 🤖 Personaliza los prompts de IA
- 📊 Configura integraciones de analytics
- 🎨 Personaliza el diseño según tu marca
- 👥 Configura autenticación de usuarios

---

**¿Necesitas ayuda?** Consulta la documentación completa en el README.md
