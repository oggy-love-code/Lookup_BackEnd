/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server } from 'socket.io';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(session({
    secret: 'jfaejlfhsdhafddksf',
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000,
    }
  }));
  app.use(bodyParser.json({ limit: '20mb' }));
  app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
  app.use(cookieParser())
  app.use(passport.initialize());
  app.use(passport.session());
  app.useWebSocketAdapter(new IoAdapter(app));
  await app.listen(8000);
}
bootstrap();
