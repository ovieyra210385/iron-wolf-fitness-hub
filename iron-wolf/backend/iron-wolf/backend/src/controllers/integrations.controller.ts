// iron-wolf/backend/src/controllers/integrations.controller.ts

import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import axios from 'axios';
import { supabase } from '../lib/supabaseClient'; // Asumiendo que tienes un cliente supabase aquí

@Controller('integrations')
export class IntegrationsController {

  @Post('google/connect')
  async connectGoogleFit(@Body() body: { code: string; memberId: string }, @Res() res: Response) {
    const { code, memberId } = body;

    if (!code || !memberId) {
      return res.status(400).json({ message: 'El código de autorización y el ID del socio son requeridos.' });
    }

    try {
      // 1. Intercambiamos el código por tokens con Google
      const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', null, {
        params: {
          code: code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: process.env.GOOGLE_REDIRECT_URI,
          grant_type: 'authorization_code',
        },
      });

      const { access_token, refresh_token, expires_in, scope } = tokenResponse.data;
      const expiresAt = new Date(Date.now() + expires_in * 1000);

      // 2. Guardamos los tokens de forma segura en nuestra base de datos
      const { error } = await supabase.from('member_integrations').upsert({
        member_id: memberId,
        provider: 'google_fit',
        access_token: access_token,
        refresh_token: refresh_token,
        scopes: scope.split(' '),
        expires_at: expiresAt.toISOString(),
      }, { onConflict: 'member_id,provider' });

      if (error) {
        throw new Error(error.message);
      }
      
      return res.status(200).json({ message: 'Conexión con Google Fit exitosa.' });

    } catch (error) {
      console.error("Error al conectar con Google Fit:", error.response?.data || error.message);
      return res.status(500).json({ message: 'Error en el servidor al intentar conectar con Google.' });
    }
  }
}