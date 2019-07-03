import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import {
  IsString,
  IsNumber,
  IsDate,
  IsOptional,
  IsEnum,
  IsPositive,
} from 'class-validator';
import { LineWinner } from './models/line-winner.enum';
import { OverunderWinner } from './models/overunder-winner.enum';

@Entity('game')
export class Game {
  @PrimaryGeneratedColumn()
  id?: number;

  @IsString()
  @Column()
  home: string;

  @IsString()
  @Column()
  away: string;

  @IsNumber()
  @Column()
  line: string;

  @IsOptional()
  @IsEnum(LineWinner)
  @Column({ nullable: true })
  lineWinner: LineWinner;

  @IsPositive()
  @Column({ default: 0 })
  overunder: number;

  @IsOptional()
  @IsEnum(OverunderWinner)
  @Column({ nullable: true })
  overunderWinner: OverunderWinner;

  @IsOptional()
  @IsPositive()
  @Column({ nullable: true })
  week: number;

  @IsOptional()
  @IsPositive()
  @Column({ nullable: true })
  year: number;

  @IsOptional()
  @IsDate()
  @Column({ nullable: true })
  date: Date;
}
