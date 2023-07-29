import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './interceptor/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalInterceptors(new ResponseInterceptor());
  // app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();
