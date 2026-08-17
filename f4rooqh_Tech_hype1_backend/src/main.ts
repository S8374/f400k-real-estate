import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ContextService } from './common/context/context.service';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import express from 'express';

// test commit
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  // New
  app.enableCors({
    origin: [
      'http://localhost:3004',
      'http://localhost:3003',
      'http://localhost:3002',
      'http://localhost:3001',
      'http://localhost:3000',
      'https://real-estate-investor-eight.vercel.app',
      'https://realestate-investor-murex.vercel.app',
      "https://realestate-investor-pearl.vercel.app",
      "https://sakruya.com",
      "https://www.sakruya.com",
      "https://admin.sakruya.com"
    ],
    credentials: true
  });

  const httpAdapterHost = app.get(HttpAdapterHost);
  const contextService = app.get(ContextService);

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost, contextService));

  // ✅ cookieParser MUST come before passport
  app.use(cookieParser());
  app.use(passport.initialize());

  app.setGlobalPrefix('api/v1');
  app.enableVersioning({ type: VersioningType.URI });

  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();