export interface IQueue {
    push: (onFullfilled?: Function, onRejected?: Function) => IQueue;
}
export declare type Queue = () => IQueue;
