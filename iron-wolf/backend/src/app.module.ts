// iron-wolf/backend/src/app.module.ts

import { Module } from '@nestjs/common';
import { IntegrationsController } from './controllers/integrations.controller';

@Module({
  imports: [],
  controllers: [IntegrationsController], // <-- Añade el controlador aquí
  providers: [],
})
export class AppModule {}