import { multicast, Observable, refCount, Subject, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import * as clone from 'clone';
import { HasBoard } from 'src/app/services/task-service';
import { TaskB } from 'src/models/task-b';

const cacheName = 'cache'

export function Cached(): MethodDecorator {
  return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (args: any[]): Observable<any> {
      const callArgs = clone(args);
      const propertyName = typeof propertyKey === 'symbol' ? propertyKey.toString() : propertyKey;
      const cache = propertyName + cacheName;
      // @ts-ignore
      if (this[cache] && JSON.stringify(this[cache].args) === JSON.stringify(args)) {
        console.log('cached')
        // @ts-ignore
        return this[cache].request;
      }
      console.log('new req', propertyName)
      const subject = new Subject();
      // @ts-ignore
      this[cache] = {
        request: originalMethod.call(this, args)
          .pipe(
            multicast(subject),
            refCount(),
            catchError((err) => {
              subject.complete();
              // @ts-ignore
              this[cache] = undefined;
              return throwError(err);
            }),
            // @ts-ignore
            finalize(() => this[cache] = undefined)),
        args: callArgs
      }
      // @ts-ignore
      return this[cache].request;
    };
    return descriptor;
  };
};

export function ClearCache(cachedMethod: string): MethodDecorator {
  return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor {
    const originalMethod: Function = descriptor.value;

    descriptor.value = function (...args: any): any {
      const cache = cachedMethod + cacheName;
      // @ts-ignore
      this[cache] = undefined;

      return originalMethod.apply(this, args);
    }

    return descriptor;
  }
}

export function ForCurrentBoardOnly(necessarily: boolean = true): MethodDecorator {
  return function (target: HasBoard, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod: Function = descriptor.value;
    descriptor.value = function (task: TaskB) {
      // @ts-ignore
      if (!!this.currentBoard && task.boardId !== this.currentBoard.boardId && necessarily) {
        const errorMethod = function(): Observable<any> { return throwError(() => 'This board does not match the current one!') };
        return errorMethod.apply(this);
      }
      console.log('forcurrentonly')
      const result = originalMethod.bind(this)(task);
      return result;
    };
    return descriptor;
  };
};




