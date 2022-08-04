import { multicast, Observable, refCount, Subject, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import * as clone from 'clone';
import equal from 'fast-deep-equal';

const cacheName = 'cache'

export function Cached(): MethodDecorator {
  return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (args: any[]): Observable<any> {
      const callArgs = clone(args);
      const propertyName = typeof propertyKey === 'symbol' ? propertyKey.toString() : propertyKey;
      const cache = propertyName + cacheName;
      // @ts-ignore
      if (this[cache] && equal(this[cache].args, args)) {
        console.log('cached', propertyName)
        // @ts-ignore
        return this[cache].request;
      }
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




