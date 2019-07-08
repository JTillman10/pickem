import { User } from '../../user/user.entity';

export class JwtResponse {
  expiresIn: number;
  accessToken: string;
  user: User;
}
