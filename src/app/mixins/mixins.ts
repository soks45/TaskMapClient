export class BaseObject {
    // tslint:disable-next-line no-empty
    constructor(..._args: any[]) {}
}
export type Constructor<T = BaseObject> = new (...args: any[]) => T;
