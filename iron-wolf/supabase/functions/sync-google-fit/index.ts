// supabase/functions/sync-google-fit/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import axios from 'https://esm.sh/axios@1.6.8';

const GOOGLE_FIT_API_URL = 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

Deno.serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 1. Obtener todas las integraciones de Google Fit activas
    const { data: integrations, error: integrationsError } = await supabaseClient
      .from('member_integrations')
      .select('member_id, access_token, refresh_token, expires_at')
      .eq('provider', 'google_fit');

    if (integrationsError) throw integrationsError;

    for (const integration of integrations) {
      let accessToken = integration.access_token;

      // 2. Si el token expiró, usar el refresh_token para obtener uno nuevo
      if (new Date(integration.expires_at) < new Date()) {
        console.log(`Token expirado para ${integration.member_id}, refrescando...`);
        const tokenResponse = await axios.post(GOOGLE_TOKEN_URL, null, {
          params: {
            client_id: Deno.env.get('GOOGLE_CLIENT_ID'),
            client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET'),
            refresh_token: integration.refresh_token,
            grant_type: 'refresh_token',
          },
        });
        
        accessToken = tokenResponse.data.access_token;
        const newExpiresAt = new Date(Date.now() + tokenResponse.data.expires_in * 1000);

        // Actualizar el token en la base de datos
        await supabaseClient
          .from('member_integrations')
          .update({ access_token: accessToken, expires_at: newExpiresAt.toISOString() })
          .eq('member_id', integration.member_id);
      }
      
      // 3. Obtener datos de actividad de las últimas 24 horas
      const startTimeMillis = Date.now() - 24 * 60 * 60 * 1000;
      const endTimeMillis = Date.now();

      const aggregateRequest = {
        aggregateBy: [{ dataTypeName: "com.google.step_count.delta" }],
        bucketByTime: { durationMillis: 86400000 }, // Agrupar por día
        startTimeMillis,
        endTimeMillis,
      };

      const apiResponse = await axios.post(GOOGLE_FIT_API_URL, aggregateRequest, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });

      const steps = apiResponse.data.bucket[0]?.dataset[0]?.point[0]?.value[0]?.intVal || 0;
      
      // 4. Guardar los datos en nuestra tabla 'member_activity'
      if (steps > 0) {
        const date = new Date().toISOString().split('T')[0];
        await supabaseClient
          .from('member_activity')
          .upsert({
            member_id: integration.member_id,
            provider: 'google_fit',
            date: date,
            steps: steps,
          }, { onConflict: 'member_id,provider,date' });
      }
    }

    return new Response(JSON.stringify({ message: 'Sincronización completada.' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});