import { IsString } from 'class-validator';

export class UserToAuthenticate {
  @IsString() email: string;
  @IsString() password: string;
}
