import { format } from 'date-fns';

export enum LoggerLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
}

export class Logger {
  constructor(private env?: { LOG?: LoggerLevel }) {}

  get level() {
    return this.env?.LOG ?? '';
  }

  debug(message: string, data?: any) {
    if (LoggerLevel.DEBUG === this.level) {
      this.log(message, data);
    }
  }

  info(message: string, data?: any) {
    if (
      [LoggerLevel.DEBUG, LoggerLevel.INFO].some(level => level === this.level)
    ) {
      this.log(message, data);
    }
  }

  private log(message: string, data?: any) {
    const now = format(new Date(), 'dd.MM HH:mm');

    if (data) {
      message = `${message}${data ? ` with\n${JSON.stringify(data)}` : ''}`;
    }

    console.log(`${now}: ${message}`);
  }
}
