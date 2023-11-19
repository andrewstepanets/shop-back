import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class BasicAuthGuard extends AuthGuard('basic') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    request.user = { id: 'c350d83e-1436-4499-9f3e-3f79c575a654' };
    return true;
  }
}
