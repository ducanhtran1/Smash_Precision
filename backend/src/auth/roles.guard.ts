import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true; // No roles required, access granted
    }

    const { user } = context.switchToHttp().getRequest();

    // If using JWT, the auth service mapping places user data in req.user
    if (!user || (!user.role && !user.user?.role)) {
      return false; // Unauthorized format
    }

    const userRole = user.role || user.user?.role;
    return requiredRoles.includes(userRole);
  }
}
