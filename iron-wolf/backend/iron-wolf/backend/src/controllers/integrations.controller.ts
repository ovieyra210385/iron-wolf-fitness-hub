// iron-wolf/backend/src/controllers/integrations.controller.ts

import { Controller, Post, Body, Res, Headers, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import axios from 'axios';
import { supabase } from '../lib/supabaseClient';
import { createClient } from '@supabase/supabase-js';

@Controller('integrations')
export class IntegrationsController {
  private serviceClient;

  constructor() {
    // Use service role key for backend operations
    this.serviceClient = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  @Post('google/connect')
  async connectGoogleFit(
    @Body() body: { code: string; memberId: string }, 
    @Headers('authorization') authHeader: string,
    @Res() res: Response
  ) {
    const { code, memberId } = body;

    // Verify authentication
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token de autenticación requerido');
    }

    const token = authHeader.split(' ')[1];
    const { data: user, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user.user) {
      throw new UnauthorizedException('Token de autenticación inválido');
    }

    // Verify user can only connect their own account
    if (user.user.id !== memberId) {
      throw new UnauthorizedException('No autorizado para conectar esta cuenta');
    }

    if (!code || !memberId) {
      return res.status(400).json({ message: 'El código de autorización y el ID del socio son requeridos.' });
    }

    try {
      // 1. Get secrets from environment variables (more secure)
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        throw new Error('Google credentials not configured in environment variables');
      }

      // 2. Exchange code for tokens with Google
      const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', null, {
        params: {
          code: code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: process.env.GOOGLE_REDIRECT_URI,
          grant_type: 'authorization_code',
        },
      });

      const { access_token, refresh_token, expires_in, scope } = tokenResponse.data;
      const expiresAt = new Date(Date.now() + expires_in * 1000);

      // 3. Encrypt tokens before storing
      const encryptedAccessToken = await this.encryptToken(access_token);
      const encryptedRefreshToken = await this.encryptToken(refresh_token);

      // 4. Store encrypted tokens securely using service client
      const { error } = await this.serviceClient.from('member_integrations').upsert({
        member_id: memberId,
        provider: 'google_fit',
        access_token: encryptedAccessToken,
        refresh_token: encryptedRefreshToken,
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

  private async encryptToken(token: string): Promise<string> {
    const crypto = require('crypto');
    const algorithm = 'aes-256-gcm';
    
    // Use proper 32-byte key from environment
    const encryptionKey = process.env.ENCRYPTION_KEY;
    if (!encryptionKey || encryptionKey.length !== 64) {
      throw new Error('ENCRYPTION_KEY must be a 64-character hex string (32 bytes)');
    }
    
    const key = Buffer.from(encryptionKey, 'hex');
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipherGCM(algorithm, key, iv);
    let encrypted = cipher.update(token, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  private async decryptToken(encryptedToken: string): Promise<string> {
    const crypto = require('crypto');
    const algorithm = 'aes-256-gcm';
    
    const encryptionKey = process.env.ENCRYPTION_KEY;
    if (!encryptionKey || encryptionKey.length !== 64) {
      throw new Error('ENCRYPTION_KEY must be a 64-character hex string (32 bytes)');
    }
    
    const key = Buffer.from(encryptionKey, 'hex');
    const [ivHex, authTagHex, encrypted] = encryptedToken.split(':');
    
    if (!ivHex || !authTagHex || !encrypted) {
      throw new Error('Invalid encrypted token format');
    }
    
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    const decipher = crypto.createDecipherGCM(algorithm, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}