import { IncomingHttpHeaders } from 'http';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../../config/auth.js';
import {
  AppError,
  BadRequestError,
  ConflictError,
  UnauthorizedError,
} from '../../utils/errors.js';

export class AuthService {
  private throwForStatus(status: number, message: string): never {
    switch (status) {
      case 400:
        throw new BadRequestError(message);
      case 401:
        throw new UnauthorizedError(message);
      case 409:
        throw new ConflictError(message);
      default:
        throw new AppError(message, status);
    }
  }

  async register(name: string, email: string, password: string) {
    const response = await auth.api.signUpEmail({
      body: { name, email, password },
      asResponse: true,
    });

    const data = (await response.json()) as Record<string, unknown>;
    const cookie = response.headers.get('set-cookie');

    if (!response.ok) {
      this.throwForStatus(
        response.status,
        (data.message as string) ?? 'Registration failed.',
      );
    }

    return { user: data.user, cookie };
  }

  async login(email: string, password: string) {
    const response = await auth.api.signInEmail({
      body: { email, password },
      asResponse: true,
    });

    const data = (await response.json()) as Record<string, unknown>;
    const cookie = response.headers.get('set-cookie');

    if (!response.ok) {
      this.throwForStatus(
        response.status,
        (data.message as string) ?? 'Invalid email or password.',
      );
    }

    return { user: data.user, session: data.session, cookie };
  }

  async logout(headers: IncomingHttpHeaders) {
    const response = await auth.api.signOut({
      headers: fromNodeHeaders(headers),
      asResponse: true,
    });

    const cookie = response.headers.get('set-cookie');
    return { cookie };
  }
}

export const authService = new AuthService();
