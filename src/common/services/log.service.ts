import { Injectable, LoggerService } from '@nestjs/common';

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

@Injectable()
export class LogService implements LoggerService {
  private readonly logLevels: Record<LogLevel, number> = {
    [LogLevel.DEBUG]: 0,
    [LogLevel.INFO]: 1,
    [LogLevel.WARN]: 2,
    [LogLevel.ERROR]: 3,
  };

  private currentLogLevel: LogLevel = LogLevel.INFO; // Default log level

  setLogLevel(level: LogLevel): void {
    this.currentLogLevel = level;
  }

  getLogLevel(): LogLevel {
    return this.currentLogLevel;
  }

  private shouldLog(level: LogLevel): boolean {
    return this.logLevels[level] >= this.logLevels[this.currentLogLevel];
  }

  private formatLogMessage(level: LogLevel, message: unknown, context?: string, error?: Error): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}] ` : '';
    const errorStack = error?.stack ? `\n${error.stack}` : '';

    return `${timestamp} ${level} ${contextStr}${message}${errorStack}`;
  }

  debug(message: string, context?: string): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      const formattedMessage = this.formatLogMessage(LogLevel.DEBUG, message, context);
      console.debug(formattedMessage);
    }
  }

  log(message: string, context?: string): void {
    if (this.shouldLog(LogLevel.INFO)) {
      const formattedMessage = this.formatLogMessage(LogLevel.INFO, message, context);
      console.log(formattedMessage);

      //TODO: Implement a more sophisticated logging mechanism if needed (files etc...)
    }
  }

  warn(message: string, context?: string): void {
    if (this.shouldLog(LogLevel.WARN)) {
      const formattedMessage = this.formatLogMessage(LogLevel.WARN, message, context);
      console.warn(formattedMessage);
    }
  }

  error(message: string, trace?: string, context?: string): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const error = trace ? new Error() : undefined;
      if (error) {
        error.stack = trace;
      }
      const formattedMessage = this.formatLogMessage(LogLevel.ERROR, message, context, error);
      console.error(formattedMessage);
    }
  }

  exception(error: Error, context?: string, message?: string): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const errorMessage = message ? `${message}: ${error.message}` : error.message;
      const formattedMessage = this.formatLogMessage(LogLevel.ERROR, errorMessage, context, error);
      console.error(formattedMessage);
    }
  }
}
