import { log } from "console-log-colors";

export class logger {
  static info(message: string) {
    log.blue(message);
  }

  static error(message: string) {
    log.red(message);
  }

  static success(message: string) {
    log.green(message);
  }

  static warning(message: string) {
    log.yellow(message);
  }

  static debug(message: string) {
    log.cyan(message);
  }
}
