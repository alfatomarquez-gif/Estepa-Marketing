-- ============================================
-- ESTEPA MARKETING - SCHEMA COMPLETO SUPABASE
-- Sistema de Gestión Administrativa
-- ============================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================
-- TIPOS ENUMERADOS
-- ============================================

CREATE TYPE tipo_media AS ENUM ('imagen', 'video', 'documento', 'audio');
CREATE TYPE tipo_contenido AS ENUM ('post', 'story', 'reel', 'video', 'carousel');
CREATE TYPE estado_contenido AS ENUM ('borrador', 'aprobado', 'publicado', 'fallido');
CREATE TYPE red_social AS ENUM ('facebook', 'instagram', 'tiktok', 'youtube', 'twitter', 'linkedin');
CREATE TYPE canal_mensaje AS ENUM ('whatsapp', 'email', 'sms');
CREATE TYPE estado_mensaje AS ENUM ('pendiente', 'enviado', 'fallido', 'leido');

-- ============================================
-- TABLA: empresa
-- ============================================

CREATE TABLE empresa (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    sector VARCHAR(100),
    logo_url TEXT,
    web VARCHAR(255),
    email_contacto VARCHAR(255),
    telefono_whatsapp VARCHAR(50),
    instagram VARCHAR(255),
    facebook VARCHAR(255),
    tiktok VARCHAR(255),
    youtube VARCHAR(255),
    twitter VARCHAR(255),
    linkedin VARCHAR(255),
    facebook_access_token TEXT,
    instagram_access_token TEXT,
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT email_valid CHECK (email_contacto ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- ============================================
-- TABLA: media
-- ============================================

CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID NOT NULL REFERENCES empresa(id) ON DELETE CASCADE,
    tipo tipo_media NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    url_thumbnail TEXT,
    tamaño INTEGER CHECK (tamaño > 0),
    duracion INTEGER CHECK (duracion >= 0),
    ancho INTEGER CHECK (ancho > 0),
    alto INTEGER CHECK (alto > 0),
    formato VARCHAR(50),
    descripcion TEXT,
    alt_text VARCHAR(255),
    tags TEXT[],
    storage_path TEXT,
    bucket_name VARCHAR(100) DEFAULT 'media',
    fecha_subida TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLA: contenido
-- ============================================

CREATE TABLE contenido (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID NOT NULL REFERENCES empresa(id) ON DELETE CASCADE,
    tipo tipo_contenido NOT NULL,
    estado estado_contenido DEFAULT 'borrador',
    titulo VARCHAR(500),
    texto TEXT,
    hashtags TEXT[],
    media_ids UUID[],
    media_principal_id UUID REFERENCES media(id) ON DELETE SET NULL,
    redes_objetivo red_social[],
    fecha_programada TIMESTAMPTZ,
    fecha_publicado TIMESTAMPTZ,
    facebook_post_url TEXT,
    instagram_post_url TEXT,
    tiktok_post_url TEXT,
    youtube_post_url TEXT,
    likes INTEGER DEFAULT 0 CHECK (likes >= 0),
    comentarios INTEGER DEFAULT 0 CHECK (comentarios >= 0),
    compartidos INTEGER DEFAULT 0 CHECK (compartidos >= 0),
    vistas INTEGER DEFAULT 0 CHECK (vistas >= 0),
    creado_por VARCHAR(255),
    aprobado_por VARCHAR(255),
    log_publicacion JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT fecha_programada_futura CHECK (fecha_programada IS NULL OR fecha_programada > created_at),
    CONSTRAINT redes_no_vacio CHECK (redes_objetivo IS NULL OR array_length(redes_objetivo, 1) > 0)
);

-- ============================================
-- TABLA: mensajes
-- ============================================

CREATE TABLE mensajes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID NOT NULL REFERENCES empresa(id) ON DELETE CASCADE,
    canal canal_mensaje NOT NULL,
    destinatario VARCHAR(255) NOT NULL,
    asunto VARCHAR(500),
    mensaje TEXT NOT NULL,
    mensaje_html TEXT,
    media_ids UUID[],
    generado_por_ia BOOLEAN DEFAULT false,
    prompt_ia TEXT,
    estado estado_mensaje DEFAULT 'pendiente',
    fecha_programado TIMESTAMPTZ,
    fecha_envio TIMESTAMPTZ,
    fecha_leido TIMESTAMPTZ,
    mensaje_respuesta TEXT,
    tracking_id VARCHAR(255),
    abierto BOOLEAN DEFAULT false,
    clicks INTEGER DEFAULT 0 CHECK (clicks >= 0),
    proveedor VARCHAR(100),
    mensaje_id_proveedor VARCHAR(255),
    error_log TEXT,
    intentos_envio INTEGER DEFAULT 0 CHECK (intentos_envio >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT fecha_programado_futura CHECK (fecha_programado IS NULL OR fecha_programado > created_at)
);

-- ============================================
-- TABLA: faq
-- ============================================

CREATE TABLE faq (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID NOT NULL REFERENCES empresa(id) ON DELETE CASCADE,
    pregunta TEXT NOT NULL,
    respuesta TEXT NOT NULL,
    generado_por_ia BOOLEAN DEFAULT false,
    prompt_ia TEXT,
    modelo_ia VARCHAR(50),
    categoria VARCHAR(100),
    tags TEXT[],
    prioridad INTEGER DEFAULT 0 CHECK (prioridad >= 0 AND prioridad <= 10),
    publicado BOOLEAN DEFAULT false,
    fecha_publicacion TIMESTAMPTZ,
    vistas INTEGER DEFAULT 0 CHECK (vistas >= 0),
    votos_util INTEGER DEFAULT 0 CHECK (votos_util >= 0),
    votos_no_util INTEGER DEFAULT 0 CHECK (votos_no_util >= 0),
    editado BOOLEAN DEFAULT false,
    version INTEGER DEFAULT 1 CHECK (version > 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLA: plantillas
-- ============================================

CREATE TABLE plantillas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID REFERENCES empresa(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    contenido TEXT NOT NULL,
    variables JSONB,
    uso_contador INTEGER DEFAULT 0 CHECK (uso_contador >= 0),
    favorito BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLA: calendario
-- ============================================

CREATE TABLE calendario (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID NOT NULL REFERENCES empresa(id) ON DELETE CASCADE,
    contenido_id UUID REFERENCES contenido(id) ON DELETE SET NULL,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    tipo VARCHAR(50) NOT NULL,
    fecha_inicio TIMESTAMPTZ NOT NULL,
    fecha_fin TIMESTAMPTZ,
    todo_el_dia BOOLEAN DEFAULT false,
    recordatorio BOOLEAN DEFAULT false,
    minutos_antes INTEGER CHECK (minutos_antes >= 0),
    color VARCHAR(20) DEFAULT '#667eea',
    completado BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT fecha_fin_valida CHECK (fecha_fin IS NULL OR fecha_fin >= fecha_inicio)
);

-- ============================================
-- TABLA: analytics
-- ============================================

CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID NOT NULL REFERENCES empresa(id) ON DELETE CASCADE,
    contenido_id UUID REFERENCES contenido(id) ON DELETE SET NULL,
    red_social red_social NOT NULL,
    post_id_externo VARCHAR(255),
    impresiones INTEGER DEFAULT 0 CHECK (impresiones >= 0),
    alcance INTEGER DEFAULT 0 CHECK (alcance >= 0),
    likes INTEGER DEFAULT 0 CHECK (likes >= 0),
    comentarios INTEGER DEFAULT 0 CHECK (comentarios >= 0),
    compartidos INTEGER DEFAULT 0 CHECK (compartidos >= 0),
    guardados INTEGER DEFAULT 0 CHECK (guardados >= 0),
    clicks INTEGER DEFAULT 0 CHECK (clicks >= 0),
    vistas_video INTEGER DEFAULT 0 CHECK (vistas_video >= 0),
    engagement_rate DECIMAL(5,2) CHECK (engagement_rate >= 0),
    fecha_metrica DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(contenido_id, red_social, fecha_metrica)
);

-- ============================================
-- ÍNDICES
-- ============================================

-- Índices de Foreign Keys
CREATE INDEX idx_media_empresa ON media(empresa_id);
CREATE INDEX idx_contenido_empresa ON contenido(empresa_id);
CREATE INDEX idx_contenido_media_principal ON contenido(media_principal_id);
CREATE INDEX idx_mensajes_empresa ON mensajes(empresa_id);
CREATE INDEX idx_faq_empresa ON faq(empresa_id);
CREATE INDEX idx_plantillas_empresa ON plantillas(empresa_id);
CREATE INDEX idx_calendario_empresa ON calendario(empresa_id);
CREATE INDEX idx_calendario_contenido ON calendario(contenido_id);
CREATE INDEX idx_analytics_empresa ON analytics(empresa_id);
CREATE INDEX idx_analytics_contenido ON analytics(contenido_id);

-- Índices de búsqueda
CREATE INDEX idx_empresa_nombre ON empresa USING gin(nombre gin_trgm_ops);
CREATE INDEX idx_empresa_sector ON empresa(sector);
CREATE INDEX idx_empresa_activa ON empresa(activa);
CREATE INDEX idx_media_tipo ON media(tipo);
CREATE INDEX idx_media_nombre ON media USING gin(nombre gin_trgm_ops);
CREATE INDEX idx_contenido_tipo ON contenido(tipo);
CREATE INDEX idx_contenido_estado ON contenido(estado);
CREATE INDEX idx_mensajes_estado ON mensajes(estado);
CREATE INDEX idx_mensajes_canal ON mensajes(canal);
CREATE INDEX idx_faq_publicado ON faq(publicado);
CREATE INDEX idx_faq_categoria ON faq(categoria);

-- Índices de fechas
CREATE INDEX idx_empresa_created ON empresa(created_at DESC);
CREATE INDEX idx_media_fecha_subida ON media(fecha_subida DESC);
CREATE INDEX idx_media_created ON media(created_at DESC);
CREATE INDEX idx_contenido_created ON contenido(created_at DESC);
CREATE INDEX idx_contenido_updated ON contenido(updated_at DESC);
CREATE INDEX idx_contenido_fecha_programada ON contenido(fecha_programada);
CREATE INDEX idx_contenido_fecha_publicado ON contenido(fecha_publicado DESC);
CREATE INDEX idx_mensajes_created ON mensajes(created_at DESC);
CREATE INDEX idx_mensajes_fecha_programado ON mensajes(fecha_programado);
CREATE INDEX idx_mensajes_fecha_envio ON mensajes(fecha_envio DESC);
CREATE INDEX idx_faq_created ON faq(created_at DESC);
CREATE INDEX idx_calendario_fecha_inicio ON calendario(fecha_inicio);
CREATE INDEX idx_analytics_fecha_metrica ON analytics(fecha_metrica DESC);

-- Índices GIN para arrays
CREATE INDEX idx_media_tags ON media USING gin(tags);
CREATE INDEX idx_contenido_hashtags ON contenido USING gin(hashtags);
CREATE INDEX idx_contenido_redes_objetivo ON contenido USING gin(redes_objetivo);
CREATE INDEX idx_contenido_media_ids ON contenido USING gin(media_ids);
CREATE INDEX idx_mensajes_media_ids ON mensajes USING gin(media_ids);
CREATE INDEX idx_faq_tags ON faq USING gin(tags);

-- ============================================
-- FUNCIÓN DE TRIGGER: actualizar_updated_at
-- ============================================

CREATE OR REPLACE FUNCTION actualizar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

CREATE TRIGGER trigger_empresa_updated_at
    BEFORE UPDATE ON empresa
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trigger_contenido_updated_at
    BEFORE UPDATE ON contenido
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trigger_mensajes_updated_at
    BEFORE UPDATE ON mensajes
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trigger_faq_updated_at
    BEFORE UPDATE ON faq
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trigger_plantillas_updated_at
    BEFORE UPDATE ON plantillas
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trigger_calendario_updated_at
    BEFORE UPDATE ON calendario
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trigger_analytics_updated_at
    BEFORE UPDATE ON analytics
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_updated_at();

-- ============================================
-- VISTAS
-- ============================================

-- Vista: Resumen de empresas con contadores
CREATE OR REPLACE VIEW vista_resumen_empresas AS
SELECT 
    e.id,
    e.nombre,
    e.sector,
    e.logo_url,
    e.activa,
    e.created_at,
    COUNT(DISTINCT c.id) as total_contenido,
    COUNT(DISTINCT m.id) as total_media,
    COUNT(DISTINCT msg.id) as total_mensajes,
    COUNT(DISTINCT f.id) as total_faqs,
    COUNT(DISTINCT c.id) FILTER (WHERE c.estado = 'publicado') as contenido_publicado,
    COUNT(DISTINCT c.id) FILTER (WHERE c.estado = 'borrador') as contenido_borrador,
    COUNT(DISTINCT c.id) FILTER (WHERE c.estado = 'aprobado') as contenido_aprobado
FROM empresa e
LEFT JOIN contenido c ON e.id = c.empresa_id
LEFT JOIN media m ON e.id = m.empresa_id
LEFT JOIN mensajes msg ON e.id = msg.empresa_id
LEFT JOIN faq f ON e.id = f.empresa_id
GROUP BY e.id, e.nombre, e.sector, e.logo_url, e.activa, e.created_at
ORDER BY e.created_at DESC;

-- Vista: Contenido programado próximo a publicar
CREATE OR REPLACE VIEW vista_contenido_programado AS
SELECT 
    c.id,
    c.empresa_id,
    e.nombre as empresa_nombre,
    e.logo_url as empresa_logo,
    c.tipo,
    c.titulo,
    c.texto,
    c.hashtags,
    c.redes_objetivo,
    c.fecha_programada,
    c.media_principal_id,
    m.url as media_url,
    m.url_thumbnail as media_thumbnail,
    c.created_at
FROM contenido c
INNER JOIN empresa e ON c.empresa_id = e.id
LEFT JOIN media m ON c.media_principal_id = m.id
WHERE c.estado = 'aprobado'
AND c.fecha_programada IS NOT NULL
AND c.fecha_programada > NOW()
ORDER BY c.fecha_programada ASC;

-- Vista: Rendimiento de empresas con métricas agregadas
CREATE OR REPLACE VIEW vista_rendimiento_empresas AS
SELECT 
    e.id,
    e.nombre,
    e.sector,
    COUNT(DISTINCT c.id) as total_publicaciones,
    COALESCE(SUM(a.likes), 0) as total_likes,
    COALESCE(SUM(a.comentarios), 0) as total_comentarios,
    COALESCE(SUM(a.compartidos), 0) as total_compartidos,
    COALESCE(SUM(a.impresiones), 0) as total_impresiones,
    COALESCE(SUM(a.alcance), 0) as total_alcance,
    COALESCE(AVG(a.engagement_rate), 0) as engagement_promedio,
    MAX(c.fecha_publicado) as ultima_publicacion
FROM empresa e
LEFT JOIN contenido c ON e.id = c.empresa_id AND c.estado = 'publicado'
LEFT JOIN analytics a ON c.id = a.contenido_id
WHERE e.activa = true
GROUP BY e.id, e.nombre, e.sector
ORDER BY engagement_promedio DESC;

-- ============================================
-- POLÍTICAS RLS (Row Level Security)
-- ============================================
-- Nota: Descomentar estas líneas cuando se implemente autenticación

-- ALTER TABLE empresa ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE media ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE contenido ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE mensajes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE plantillas ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE calendario ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- ============================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- ============================================

-- Insertar empresa de ejemplo
INSERT INTO empresa (nombre, descripcion, sector, email_contacto, telefono_whatsapp, activa)
VALUES (
    'Empresa Demo',
    'Esta es una empresa de demostración para probar el sistema',
    'Tecnología',
    'demo@ejemplo.com',
    '+1234567890',
    true
);

-- ============================================
-- COMENTARIOS
-- ============================================

COMMENT ON TABLE empresa IS 'Gestión de empresas cliente';
COMMENT ON TABLE media IS 'Galería centralizada de archivos multimedia';
COMMENT ON TABLE contenido IS 'Posts y publicaciones para redes sociales';
COMMENT ON TABLE mensajes IS 'Sistema de mensajería WhatsApp, Email y SMS';
COMMENT ON TABLE faq IS 'Preguntas frecuentes con generación por IA';
COMMENT ON TABLE plantillas IS 'Templates reutilizables de contenido';
COMMENT ON TABLE calendario IS 'Calendario de eventos y publicaciones';
COMMENT ON TABLE analytics IS 'Métricas de rendimiento de publicaciones';

-- ============================================
-- FIN DEL SCHEMA
-- ============================================
