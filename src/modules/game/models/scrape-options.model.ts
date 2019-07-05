import { IsEnum, IsDateString, IsNumber, IsArray } from 'class-validator';
import { ScrapeType } from './scrape-type.enum';

export class ScrapeOptions {
  @IsDateString()
  minDate: string;

  @IsDateString()
  maxDate: string;

  @IsEnum(ScrapeType, { each: true })
  scrapeTypes: ScrapeType[];

  @IsNumber()
  week: number;

  @IsNumber()
  season: number;
}
