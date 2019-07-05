import { Injectable } from '@nestjs/common';

import * as $ from 'cheerio';
import { launch, Browser, Page } from 'puppeteer';
import { Game } from './game.entity';
import { ScrapeOptions } from './models/scrape-options.model';
import { ScrapeType } from './models/scrape-type.enum';

@Injectable()
export class ScraperService {
  async scrape(scrapeOptions: ScrapeOptions): Promise<Game[]> {
    const { maxDate, minDate, scrapeTypes, week, season } = scrapeOptions;
    const browser: Browser = await launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const scrapeType = scrapeTypes[0];
    // actually change to loop

    const page: Page = await browser.newPage();
    await page.goto(
      `https://www.sportsbetting.ag/sportsbook/football/${
        scrapeType === ScrapeType.College ? 'ncaa' : 'nfl'
      }`,
    );
    const html: string = await page.content();

    const games: Game[] = [];
    let date: Date;
    $(html)
      .find('table.league tbody')
      .each((tableIndex, table) => {
        const tableClass: string = $(table).attr('class');
        if (tableClass.includes('date')) {
          const text = $(table)
            .find('td')
            .text()
            .trim();
          date = new Date(text.split(' -')[0]);
        }

        if (
          tableClass.includes('event') &&
          this.dateBetweenMaxAndMinDates(maxDate, minDate, date)
        ) {
          let home: string;
          let away: string;
          let line: number;
          let overunder: number;
          let gameDate = new Date(date);

          $(table)
            .find('tr')
            .each((rowIndex, row) => {
              const rowClass = $(row).attr('class');
              if (rowClass.includes('firstline')) {
                $(row)
                  .find('td')
                  .each((columnIndex, column) => {
                    const columnClass: string = $(column).attr('class');
                    const columnText: string = $(column)
                      .text()
                      .trim();
                    if (columnClass.includes('col_time')) {
                      gameDate = this.getDate(gameDate, columnText);
                    }

                    if (columnClass.includes('col_teamname')) {
                      away = columnText;
                    }

                    if (
                      columnClass.includes('bdevtt') &&
                      columnIndex === 13 &&
                      !overunder
                    ) {
                      overunder = this.getNumber(columnText);
                    }
                  });
              }

              if (rowClass.includes('otherline')) {
                $(row)
                  .find('td')
                  .each((columnIndex, column) => {
                    const columnClass: string = $(column).attr('class');
                    const columnText: string = $(column)
                      .text()
                      .trim();
                    if (columnClass.includes('col_teamname')) {
                      home = columnText;
                    }
                    if (
                      columnClass.includes('hdcp') &&
                      columnIndex === 4 &&
                      !line
                    ) {
                      line = this.getNumber(columnText);
                    }
                  });
              }
            });
          if (home && away) {
            const game: Game = {
              home,
              away,
              line,
              date: gameDate,
              overunder,
              week,
              season,
            };
            games.push(game);
          }
        }
      });

    browser.close();

    return games;
  }

  private getNumber(text: string): number {
    const half: boolean =
      text[text.length - 1] && text.charCodeAt(text.length - 1) === 189;
    const digit: string = parseFloat(text).toString();
    return parseFloat(`${digit}${half ? '.5' : ''}`);
  }

  private getDate(currentDate: Date, text: string): Date {
    const hours: number = parseInt(text.split(':')[0].trim(), 10);
    const minutes: number = parseInt(
      text
        .split(' ')[0]
        .split(':')[1]
        .trim(),
      10,
    );
    const pm: boolean = text.split(' ')[1].trim() === 'PM';

    const d = new Date(currentDate);
    d.setHours(pm ? hours + 12 : hours);
    d.setMinutes(minutes);
    return d;
  }

  private dateBetweenMaxAndMinDates(
    maxDate: string,
    minDate: string,
    currentDate: Date,
  ): boolean {
    return currentDate >= new Date(minDate) && currentDate <= new Date(maxDate);
  }
}
