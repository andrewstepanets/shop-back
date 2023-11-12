import { Module } from '@nestjs/common';

import { UsersService } from './services';

@Module({
  imports: [UsersService],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
