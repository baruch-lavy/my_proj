import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }
    const userRoles = request.user?.roles || [];
    const hasRole = requiredRoles.some((role) => userRoles.includes(role));
    if (!hasRole) {
      return false;
    }

    return this.validateRequest(request);
  }

  private async validateRequest(request: any): Promise<boolean> {
    // Implement your authentication logic here
    // For example, you can check for a valid JWT token in the request headers
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      return false;
    }
    const token = authHeader.split(' ')[1];
    // Validate the token and return true if valid, false otherwise
    return await this.validateToken(token);
  }

  private async validateToken(token: string): Promise<boolean> {
    // Implement your token validation logic here
    // For example, you can use a JWT library to verify the token
    return true; // Replace with actual validation logic
  }
}
