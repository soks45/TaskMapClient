import { Target } from '@angular/compiler';
import { multicast, Observable, refCount, Subject, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

export function Cached(): MethodDecorator {
  return function (target: Target, propertyKey: PropertyKey, descriptor: PropertyDescriptor) {
    const originalMethod: () => Observable<any> = descriptor.value;
    descriptor.value = function (...args: any) {
      let cacheKey = propertyKey.toString();
      if (args) {
        cacheKey += JSON.stringify(args);
      }
      if (memoryStorage.getItem(cacheKey) === undefined) {
        const subject = new Subject();
        memoryStorage.setItem(
          cacheKey,
          originalMethod.apply(this, args)
            .pipe(
              multicast(subject),
              refCount(),
              catchError((err) => {
                subject.complete();
                memoryStorage.removeItem(cacheKey);
                return throwError(err);
              }),
              finalize(() => memoryStorage.removeItem(cacheKey))
            ));
      }
      return memoryStorage.getItem(cacheKey);
    }
    return descriptor;
  }
}

class MemoryStorage {
  private _cache = new Map<string, Observable<any>>();
  get length(): number {
    return this._cache.size;
  }
  clear(): void {
    this._cache.clear();
  }
  getItem<T>(key: string): Observable<T> | undefined {
    return this._cache.get(key);
  }
  removeItem(key: string): void {
    this._cache.delete(key);
  }
  setItem(key: string, value: Observable<any>): void {
    this._cache.set(key, value);
  }
}

const memoryStorage = new MemoryStorage();
