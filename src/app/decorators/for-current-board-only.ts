import { HasBoard } from 'src/app/services/task-service';
import { TaskB } from '../../models/task-b';

export function ForCurrentBoardOnly(necessarily: boolean = true): MethodDecorator {
  return function (target: HasBoard, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (task: TaskB) {
      // @ts-ignore
      if (!(!!this.currentBoard && task.boardId === this.currentBoard.boardId) && necessarily) {
        return;
      }
      return originalMethod.apply(this, [task]);
    };
    return descriptor;
  };
};
