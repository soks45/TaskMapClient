import { Observable } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';

export namespace Cached {
  export function CachedIn(cache: string): MethodDecorator {
    return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value;
      descriptor.value = function (...args: any[]): Observable<any> {
        // @ts-ignore
        if (this[cache]) {
          // @ts-ignore
          return this[cache].pipe(tap(() => {}));
        }
        // @ts-ignore
        this[cache] = originalMethod.apply(this, [args])
          .pipe(// @ts-ignore
            finalize(() => this[cache] = undefined));
        // @ts-ignore
        return this[cache];
      };
      return descriptor;
    };
  };

  export function ClearCache(cache: string): MethodDecorator {
    return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
      const originalMethod: Function = descriptor.value;
      descriptor.value = function (...args: any[]): Observable<any> {
        return originalMethod.apply(this, args).pipe(finalize(() => {
          // @ts-ignore
          this[cache] = undefined;
        }));
      }
      return descriptor;
    }
  }
}

export function LoadData(loader?: string): MethodDecorator {
  return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod: Function = descriptor.value;
    descriptor.value = function (...args: any[]): Observable<any> {
      // @ts-ignore
      if (!loader || loader.length === 0 || !this[loader]) {
        return originalMethod.apply(this, args);
      }
      // @ts-ignore
      return originalMethod.apply(this, args).pipe(tap(item => this[loader].apply(this, [item])));
    }
    return descriptor;
  }
}

export function ConvertData(converter?: string): MethodDecorator {
  return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod: Function = descriptor.value;
    descriptor.value = function (...args: any[]): Observable<any> {
      // @ts-ignore
      if (!converter || converter.length === 0 || !this[converter]) {
        return originalMethod.apply(this, args);
      }
      // @ts-ignore
      return originalMethod.apply(this, args).pipe(map(item => this[converter].apply(this, [item])));
    }
    return descriptor;
  }
}

