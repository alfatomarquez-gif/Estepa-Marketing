import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { empresaId, prompt, cantidad, tono } = await req.json()
    
    // Validar parámetros
    if (!empresaId || !prompt) {
      return new Response(
        JSON.stringify({ error: 'empresaId y prompt son requeridos' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    // Inicializar Supabase client con service role key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    // Obtener información de la empresa
    const { data: empresa, error: empresaError } = await supabase
      .from('empresa')
      .select('*')
      .eq('id', empresaId)
      .single()
    
    if (empresaError || !empresa) {
      return new Response(
        JSON.stringify({ error: 'Empresa no encontrada' }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    // Construir contexto para la IA
    const contexto = `
Empresa: ${empresa.nombre}
Sector: ${empresa.sector || 'No especificado'}
Descripción: ${empresa.descripcion || 'No especificada'}
Web: ${empresa.web || 'No especificada'}

Información adicional del usuario:
${prompt}
    `.trim()
    
    // Definir tono del mensaje
    const tonoInstruccion = {
      'formal': 'Usa un tono profesional y formal.',
      'informal': 'Usa un tono amigable e informal.',
      'tecnico': 'Usa un tono técnico y preciso.'
    }[tono || 'formal'] || 'Usa un tono profesional y formal.'
    
    // Llamar a OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Eres un experto en crear FAQs (Preguntas Frecuentes) profesionales para empresas. 
${tonoInstruccion}
Genera FAQs relevantes, útiles y bien redactadas basadas en la información de la empresa.
Responde ÚNICAMENTE con un array JSON válido con el siguiente formato:
[{"pregunta":"Pregunta aquí","respuesta":"Respuesta detallada aquí","categoria":"Categoría"}]
No incluyas ningún texto adicional, solo el JSON.`
          },
          {
            role: 'user',
            content: `Genera exactamente ${cantidad || 10} FAQs para esta empresa:

${contexto}

Incluye una categoría apropiada para cada FAQ (ej: "General", "Servicios", "Precios", "Soporte", etc.).
Asegúrate de que las preguntas sean las que realmente haría un cliente potencial.`
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    })
    
    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text()
      console.error('OpenAI API Error:', errorData)
      return new Response(
        JSON.stringify({ error: 'Error al generar FAQs con IA', details: errorData }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    const openaiData = await openaiResponse.json()
    const content = openaiData.choices[0].message.content
    
    // Parsear la respuesta JSON
    let faqs
    try {
      // Limpiar el contenido por si tiene markdown o texto adicional
      const jsonMatch = content.match(/\[[\s\S]*\]/)
      const jsonString = jsonMatch ? jsonMatch[0] : content
      faqs = JSON.parse(jsonString)
    } catch (parseError) {
      console.error('Error parsing JSON:', content)
      return new Response(
        JSON.stringify({ 
          error: 'Error al parsear la respuesta de la IA',
          rawContent: content 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    // Preparar FAQs para insertar en la base de datos
    const faqsToInsert = faqs.map((faq: any) => ({
      empresa_id: empresaId,
      pregunta: faq.pregunta,
      respuesta: faq.respuesta,
      categoria: faq.categoria || 'General',
      generado_por_ia: true,
      modelo_ia: 'gpt-4',
      prompt_ia: prompt,
      publicado: false, // Por defecto no publicado, para revisión
      prioridad: 5
    }))
    
    // Insertar FAQs en la base de datos
    const { data: insertedFaqs, error: insertError } = await supabase
      .from('faq')
      .insert(faqsToInsert)
      .select()
    
    if (insertError) {
      console.error('Error inserting FAQs:', insertError)
      return new Response(
        JSON.stringify({ 
          error: 'Error al guardar FAQs en la base de datos',
          details: insertError 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    // Respuesta exitosa
    return new Response(
      JSON.stringify({ 
        success: true,
        faqs: insertedFaqs,
        count: insertedFaqs.length,
        empresa: empresa.nombre
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
    
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Error inesperado',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
