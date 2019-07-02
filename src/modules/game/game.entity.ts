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
  line: number;

  @IsOptional()
  @IsEnum(LineWinner)
  @Column({ nullable: true })
  lineWinner: LineWinner;

  @IsPositive()
  @Column()
  overunder: number;

  @IsOptional()
  @IsEnum(OverunderWinner)
  @Column({ nullable: true })
  overunderWinner: OverunderWinner;

  @IsPositive()
  @Column()
  week: number;

  @IsPositive()
  @Column()
  year: number;

  @IsOptional()
  @IsDate()
  @Column({ nullable: true })
  date: Date;
}
