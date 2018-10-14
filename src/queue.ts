export interface IQueue {
  push: (onFullfilled?: Function, onRejected?: Function) => IQueue;
}

export type Queue = () => IQueue;
