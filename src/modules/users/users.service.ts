import { AuthUser } from '../../types/express.js';

export class UsersService {
  getProfile(user: AuthUser) {
    return user;
  }
}

export const usersService = new UsersService();
