/**
 * ESTEPA MARKETING - SUPABASE CLIENT
 * Sistema de Gestión Administrativa - API Integration
 */

// Inicializar Supabase client
// NOTA: Actualizar estas credenciales con las reales desde el panel de Supabase
const SUPABASE_URL = 'https://xxx.supabase.co';
const SUPABASE_KEY = 'xxx';

let supabase;

// Inicializar cliente de Supabase
function initSupabase() {
  if (typeof window.supabase !== 'undefined') {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('Supabase client initialized');
  } else {
    console.error('Supabase library not loaded. Include the Supabase CDN script.');
  }
}

// ============================================
// CRUD EMPRESAS
// ============================================

/**
 * Obtener todas las empresas
 * @param {Object} filters - Filtros opcionales
 * @returns {Promise<{data, error}>}
 */
async function obtenerEmpresas(filters = {}) {
  let query = supabase
    .from('empresa')
    .select('*');
  
  if (filters.activa !== undefined) {
    query = query.eq('activa', filters.activa);
  }
  
  if (filters.sector) {
    query = query.eq('sector', filters.sector);
  }
  
  if (filters.busqueda) {
    query = query.ilike('nombre', `%${filters.busqueda}%`);
  }
  
  query = query.order('created_at', { ascending: false });
  
  const { data, error } = await query;
  return { data, error };
}

/**
 * Obtener una empresa por ID
 * @param {string} id - UUID de la empresa
 * @returns {Promise<{data, error}>}
 */
async function obtenerEmpresa(id) {
  const { data, error } = await supabase
    .from('empresa')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
}

/**
 * Crear una nueva empresa
 * @param {Object} empresaData - Datos de la empresa
 * @returns {Promise<{data, error}>}
 */
async function crearEmpresa(empresaData) {
  const { data, error } = await supabase
    .from('empresa')
    .insert([empresaData])
    .select();
  return { data, error };
}

/**
 * Actualizar una empresa existente
 * @param {string} id - UUID de la empresa
 * @param {Object} empresaData - Datos a actualizar
 * @returns {Promise<{data, error}>}
 */
async function actualizarEmpresa(id, empresaData) {
  const { data, error } = await supabase
    .from('empresa')
    .update(empresaData)
    .eq('id', id)
    .select();
  return { data, error };
}

/**
 * Eliminar una empresa
 * @param {string} id - UUID de la empresa
 * @returns {Promise<{error}>}
 */
async function eliminarEmpresa(id) {
  const { error } = await supabase
    .from('empresa')
    .delete()
    .eq('id', id);
  return { error };
}

// ============================================
// CRUD CONTENIDO
// ============================================

/**
 * Obtener contenido con filtros
 * @param {Object} filtros - Filtros opcionales
 * @returns {Promise<{data, error}>}
 */
async function obtenerContenido(filtros = {}) {
  let query = supabase
    .from('contenido')
    .select(`
      *,
      empresa:empresa_id(nombre, logo_url),
      media_principal:media_principal_id(url, url_thumbnail, tipo)
    `);
  
  if (filtros.empresa_id) {
    query = query.eq('empresa_id', filtros.empresa_id);
  }
  
  if (filtros.estado) {
    query = query.eq('estado', filtros.estado);
  }
  
  if (filtros.tipo) {
    query = query.eq('tipo', filtros.tipo);
  }
  
  if (filtros.fecha_inicio && filtros.fecha_fin) {
    query = query
      .gte('fecha_programada', filtros.fecha_inicio)
      .lte('fecha_programada', filtros.fecha_fin);
  }
  
  query = query.order('created_at', { ascending: false });
  
  const { data, error } = await query;
  return { data, error };
}

/**
 * Crear nuevo contenido
 * @param {Object} contenidoData - Datos del contenido
 * @returns {Promise<{data, error}>}
 */
async function crearContenido(contenidoData) {
  const { data, error } = await supabase
    .from('contenido')
    .insert([contenidoData])
    .select();
  return { data, error };
}

/**
 * Actualizar contenido
 * @param {string} id - UUID del contenido
 * @param {Object} contenidoData - Datos a actualizar
 * @returns {Promise<{data, error}>}
 */
async function actualizarContenido(id, contenidoData) {
  const { data, error } = await supabase
    .from('contenido')
    .update(contenidoData)
    .eq('id', id)
    .select();
  return { data, error };
}

/**
 * Eliminar contenido
 * @param {string} id - UUID del contenido
 * @returns {Promise<{error}>}
 */
async function eliminarContenido(id) {
  const { error } = await supabase
    .from('contenido')
    .delete()
    .eq('id', id);
  return { error };
}

// ============================================
// MEDIA / STORAGE
// ============================================

/**
 * Subir archivo a Supabase Storage
 * @param {File} file - Archivo a subir
 * @param {string} empresaId - ID de la empresa
 * @returns {Promise<{data, error}>}
 */
async function subirArchivo(file, empresaId) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${empresaId}/${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('media')
    .upload(fileName, file);
  
  if (error) return { error };
  
  const { data: urlData } = supabase.storage
    .from('media')
    .getPublicUrl(fileName);
  
  return { 
    data: { 
      path: fileName, 
      url: urlData.publicUrl 
    }, 
    error: null 
  };
}

/**
 * Guardar metadata de media en la base de datos
 * @param {Object} mediaData - Datos del archivo
 * @returns {Promise<{data, error}>}
 */
async function guardarMedia(mediaData) {
  const { data, error } = await supabase
    .from('media')
    .insert([mediaData])
    .select();
  return { data, error };
}

/**
 * Obtener archivos media
 * @param {Object} filtros - Filtros opcionales
 * @returns {Promise<{data, error}>}
 */
async function obtenerMedia(filtros = {}) {
  let query = supabase
    .from('media')
    .select('*, empresa:empresa_id(nombre)');
  
  if (filtros.empresa_id) {
    query = query.eq('empresa_id', filtros.empresa_id);
  }
  
  if (filtros.tipo) {
    query = query.eq('tipo', filtros.tipo);
  }
  
  if (filtros.busqueda) {
    query = query.ilike('nombre', `%${filtros.busqueda}%`);
  }
  
  query = query.order('created_at', { ascending: false });
  
  const { data, error } = await query;
  return { data, error };
}

/**
 * Eliminar archivo media
 * @param {string} id - UUID del archivo
 * @param {string} storagePath - Ruta en storage
 * @returns {Promise<{error}>}
 */
async function eliminarMedia(id, storagePath) {
  // Eliminar del storage
  const { error: storageError } = await supabase.storage
    .from('media')
    .remove([storagePath]);
  
  if (storageError) return { error: storageError };
  
  // Eliminar de la base de datos
  const { error } = await supabase
    .from('media')
    .delete()
    .eq('id', id);
  
  return { error };
}

// ============================================
// MENSAJES
// ============================================

/**
 * Crear mensaje
 * @param {Object} mensajeData - Datos del mensaje
 * @returns {Promise<{data, error}>}
 */
async function crearMensaje(mensajeData) {
  const { data, error } = await supabase
    .from('mensajes')
    .insert([mensajeData])
    .select();
  return { data, error };
}

/**
 * Obtener mensajes
 * @param {Object} filtros - Filtros opcionales
 * @returns {Promise<{data, error}>}
 */
async function obtenerMensajes(filtros = {}) {
  let query = supabase
    .from('mensajes')
    .select('*, empresa:empresa_id(nombre, logo_url)');
  
  if (filtros.empresa_id) {
    query = query.eq('empresa_id', filtros.empresa_id);
  }
  
  if (filtros.canal) {
    query = query.eq('canal', filtros.canal);
  }
  
  if (filtros.estado) {
    query = query.eq('estado', filtros.estado);
  }
  
  query = query.order('created_at', { ascending: false });
  
  const { data, error } = await query;
  return { data, error };
}

/**
 * Actualizar mensaje
 * @param {string} id - UUID del mensaje
 * @param {Object} mensajeData - Datos a actualizar
 * @returns {Promise<{data, error}>}
 */
async function actualizarMensaje(id, mensajeData) {
  const { data, error } = await supabase
    .from('mensajes')
    .update(mensajeData)
    .eq('id', id)
    .select();
  return { data, error };
}

// ============================================
// FAQ
// ============================================

/**
 * Generar FAQs con IA (Edge Function)
 * @param {string} empresaId - ID de la empresa
 * @param {string} prompt - Prompt para la IA
 * @param {number} cantidad - Número de FAQs a generar
 * @returns {Promise<{data, error}>}
 */
async function generarFAQConIA(empresaId, prompt, cantidad = 10) {
  const { data, error } = await supabase.functions.invoke('generar-faq', {
    body: { 
      empresaId, 
      prompt, 
      cantidad 
    }
  });
  return { data, error };
}

/**
 * Guardar FAQ
 * @param {Object} faqData - Datos del FAQ
 * @returns {Promise<{data, error}>}
 */
async function guardarFAQ(faqData) {
  const { data, error } = await supabase
    .from('faq')
    .insert([faqData])
    .select();
  return { data, error };
}

/**
 * Guardar múltiples FAQs
 * @param {Array} faqsData - Array de FAQs
 * @returns {Promise<{data, error}>}
 */
async function guardarFAQs(faqsData) {
  const { data, error } = await supabase
    .from('faq')
    .insert(faqsData)
    .select();
  return { data, error };
}

/**
 * Obtener FAQs
 * @param {Object} filtros - Filtros opcionales
 * @returns {Promise<{data, error}>}
 */
async function obtenerFAQs(filtros = {}) {
  let query = supabase
    .from('faq')
    .select('*, empresa:empresa_id(nombre)');
  
  if (filtros.empresa_id) {
    query = query.eq('empresa_id', filtros.empresa_id);
  }
  
  if (filtros.publicado !== undefined) {
    query = query.eq('publicado', filtros.publicado);
  }
  
  if (filtros.categoria) {
    query = query.eq('categoria', filtros.categoria);
  }
  
  query = query.order('created_at', { ascending: false });
  
  const { data, error } = await query;
  return { data, error };
}

/**
 * Actualizar FAQ
 * @param {string} id - UUID del FAQ
 * @param {Object} faqData - Datos a actualizar
 * @returns {Promise<{data, error}>}
 */
async function actualizarFAQ(id, faqData) {
  const { data, error } = await supabase
    .from('faq')
    .update(faqData)
    .eq('id', id)
    .select();
  return { data, error };
}

/**
 * Eliminar FAQ
 * @param {string} id - UUID del FAQ
 * @returns {Promise<{error}>}
 */
async function eliminarFAQ(id) {
  const { error } = await supabase
    .from('faq')
    .delete()
    .eq('id', id);
  return { error };
}

// ============================================
// CALENDARIO
// ============================================

/**
 * Obtener eventos del calendario
 * @param {Object} filtros - Filtros opcionales
 * @returns {Promise<{data, error}>}
 */
async function obtenerEventos(filtros = {}) {
  let query = supabase
    .from('calendario')
    .select('*, empresa:empresa_id(nombre), contenido:contenido_id(titulo, tipo)');
  
  if (filtros.empresa_id) {
    query = query.eq('empresa_id', filtros.empresa_id);
  }
  
  if (filtros.fecha_inicio && filtros.fecha_fin) {
    query = query
      .gte('fecha_inicio', filtros.fecha_inicio)
      .lte('fecha_inicio', filtros.fecha_fin);
  }
  
  query = query.order('fecha_inicio', { ascending: true });
  
  const { data, error } = await query;
  return { data, error };
}

/**
 * Crear evento
 * @param {Object} eventoData - Datos del evento
 * @returns {Promise<{data, error}>}
 */
async function crearEvento(eventoData) {
  const { data, error } = await supabase
    .from('calendario')
    .insert([eventoData])
    .select();
  return { data, error };
}

/**
 * Actualizar evento
 * @param {string} id - UUID del evento
 * @param {Object} eventoData - Datos a actualizar
 * @returns {Promise<{data, error}>}
 */
async function actualizarEvento(id, eventoData) {
  const { data, error } = await supabase
    .from('calendario')
    .update(eventoData)
    .eq('id', id)
    .select();
  return { data, error };
}

/**
 * Eliminar evento
 * @param {string} id - UUID del evento
 * @returns {Promise<{error}>}
 */
async function eliminarEvento(id) {
  const { error } = await supabase
    .from('calendario')
    .delete()
    .eq('id', id);
  return { error };
}

// ============================================
// ANALYTICS
// ============================================

/**
 * Obtener analytics
 * @param {string} empresaId - ID de la empresa
 * @param {string} fechaInicio - Fecha de inicio (YYYY-MM-DD)
 * @param {string} fechaFin - Fecha de fin (YYYY-MM-DD)
 * @returns {Promise<{data, error}>}
 */
async function obtenerAnalytics(empresaId, fechaInicio, fechaFin) {
  let query = supabase
    .from('analytics')
    .select('*, contenido:contenido_id(titulo, tipo), empresa:empresa_id(nombre)');
  
  if (empresaId) {
    query = query.eq('empresa_id', empresaId);
  }
  
  if (fechaInicio) {
    query = query.gte('fecha_metrica', fechaInicio);
  }
  
  if (fechaFin) {
    query = query.lte('fecha_metrica', fechaFin);
  }
  
  query = query.order('fecha_metrica', { ascending: false });
  
  const { data, error } = await query;
  return { data, error };
}

/**
 * Guardar métricas de analytics
 * @param {Object} analyticsData - Datos de analytics
 * @returns {Promise<{data, error}>}
 */
async function guardarAnalytics(analyticsData) {
  const { data, error } = await supabase
    .from('analytics')
    .insert([analyticsData])
    .select();
  return { data, error };
}

/**
 * Obtener resumen de analytics por empresa
 * @param {string} empresaId - ID de la empresa
 * @returns {Promise<{data, error}>}
 */
async function obtenerResumenAnalytics(empresaId) {
  const { data, error } = await supabase
    .from('vista_rendimiento_empresas')
    .select('*')
    .eq('id', empresaId)
    .single();
  return { data, error };
}

// ============================================
// VISTAS
// ============================================

/**
 * Obtener resumen de empresas con contadores
 * @returns {Promise<{data, error}>}
 */
async function obtenerResumenEmpresas() {
  const { data, error } = await supabase
    .from('vista_resumen_empresas')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
}

/**
 * Obtener contenido programado
 * @returns {Promise<{data, error}>}
 */
async function obtenerContenidoProgramado() {
  const { data, error } = await supabase
    .from('vista_contenido_programado')
    .select('*')
    .limit(10);
  return { data, error };
}

// ============================================
// PLANTILLAS
// ============================================

/**
 * Obtener plantillas
 * @param {Object} filtros - Filtros opcionales
 * @returns {Promise<{data, error}>}
 */
async function obtenerPlantillas(filtros = {}) {
  let query = supabase
    .from('plantillas')
    .select('*');
  
  if (filtros.empresa_id) {
    query = query.or(`empresa_id.eq.${filtros.empresa_id},empresa_id.is.null`);
  } else {
    query = query.is('empresa_id', null);
  }
  
  if (filtros.tipo) {
    query = query.eq('tipo', filtros.tipo);
  }
  
  query = query.order('favorito', { ascending: false })
             .order('uso_contador', { ascending: false });
  
  const { data, error } = await query;
  return { data, error };
}

/**
 * Crear plantilla
 * @param {Object} plantillaData - Datos de la plantilla
 * @returns {Promise<{data, error}>}
 */
async function crearPlantilla(plantillaData) {
  const { data, error } = await supabase
    .from('plantillas')
    .insert([plantillaData])
    .select();
  return { data, error };
}

// ============================================
// EXPORTAR API
// ============================================

// Inicializar al cargar el script
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', initSupabase);
}

// Exportar funciones para uso global
window.SupabaseAPI = {
  // Empresas
  obtenerEmpresas,
  obtenerEmpresa,
  crearEmpresa,
  actualizarEmpresa,
  eliminarEmpresa,
  
  // Contenido
  obtenerContenido,
  crearContenido,
  actualizarContenido,
  eliminarContenido,
  
  // Media
  subirArchivo,
  guardarMedia,
  obtenerMedia,
  eliminarMedia,
  
  // Mensajes
  crearMensaje,
  obtenerMensajes,
  actualizarMensaje,
  
  // FAQ
  generarFAQConIA,
  guardarFAQ,
  guardarFAQs,
  obtenerFAQs,
  actualizarFAQ,
  eliminarFAQ,
  
  // Calendario
  obtenerEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
  
  // Analytics
  obtenerAnalytics,
  guardarAnalytics,
  obtenerResumenAnalytics,
  
  // Vistas
  obtenerResumenEmpresas,
  obtenerContenidoProgramado,
  
  // Plantillas
  obtenerPlantillas,
  crearPlantilla,
  
  // Cliente Supabase
  getClient: () => supabase
};
