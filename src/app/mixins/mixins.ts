export class Object {
  constructor(..._args: any[]) {}
}
export type Constructor<T = Object> = new(...args: any[]) => T;
