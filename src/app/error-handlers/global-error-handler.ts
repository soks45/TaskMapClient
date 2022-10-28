import { ErrorHandler, Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private logger: NGXLogger) {}

    handleError(error: any) {
        this.logger.error(error);
    }
}
