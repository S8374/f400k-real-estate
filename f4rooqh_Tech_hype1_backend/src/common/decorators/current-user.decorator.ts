import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log('CurrentUser decorator - request.user:', request.user);
    
    if (!request.user) {
      console.log('CurrentUser decorator - user is undefined');
      return null;
    }
    
    return request.user;
  },
);