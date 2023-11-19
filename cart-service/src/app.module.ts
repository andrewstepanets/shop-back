import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';

import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { getDatabaseConfig } from './config/postgres.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useFactory: getDatabaseConfig }),
    AuthModule,
    CartModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
