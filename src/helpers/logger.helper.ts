import { getError } from '@/utilities';
import dayjs from 'dayjs';

const applicationLogger = console;

export interface ILogger {
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
}

export class Logger implements ILogger {
  private static instance: Logger;

  constructor() {}

  static getInstance(): Logger {
    if (!this.instance) {
      this.instance = new Logger();
    }

    return this.instance;
  }

  getTimestamp() {
    return dayjs().toISOString();
  }

  generateLog(opts: { level: 'INFO' | 'WARN' | 'ERROR'; message: any }) {
    const { level, message } = opts;
    const timestamp = this.getTimestamp();

    switch (typeof message) {
      case 'string': {
        return {
          message: `${timestamp} - [${level}] ${message}`,
          args: [],
        };
      }
      default: {
        return {
          message: `${timestamp} - [${level}]`,
          args: [message],
        };
      }
    }
  }

  info(message: any, ...args: any[]) {
    if (!applicationLogger) {
      throw getError({ message: '[info] Invalid logger instance!' });
    }

    const generated = this.generateLog({ level: 'INFO', message });
    applicationLogger.info(generated.message, ...generated.args, ...args);
  }

  warn(message: any, ...args: any[]) {
    if (!applicationLogger) {
      throw getError({ message: '[error] Invalid logger instance!' });
    }

    const generated = this.generateLog({ level: 'WARN', message });
    applicationLogger.info(generated.message, ...generated.args, ...args);
  }

  error(message: any, ...args: any[]) {
    if (!applicationLogger) {
      throw getError({ message: '[error] Invalid logger instance!' });
    }

    const generated = this.generateLog({ level: 'ERROR', message });
    applicationLogger.info(generated.message, ...generated.args, ...args);
  }
}
