import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsString } from 'class-validator';

export type Role = 'user' | 'admin';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn() id: number;

  @IsString() @Column() email: string;
  @IsString() @Column() password: string;
  @IsString() @Column() firstName: string;
  @IsString() @Column() lastName: string;
  @IsString() @Column() role: Role;
}
