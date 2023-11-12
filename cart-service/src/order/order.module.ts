import { Module } from '@nestjs/common';
import { OrderService } from './services';

@Module({
  imports: [OrderService],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
