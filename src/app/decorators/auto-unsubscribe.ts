export function UnsubscribeAllOnDestroy(): Function {
  return function(constructor: Function): void {
    const orig = constructor.prototype.ngOnDestroy;
    constructor.prototype.ngOnDestroy = function(): void {
      for (const prop in this) {
        const property = this[prop];
        if (typeof property.subscribe === "function") {
          property.unsubscribe();
        };
      };
      orig.apply();
    }
  }
}
