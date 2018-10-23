export declare type QueueConstructorLike = new <T>(executor: (resolve: (value?: T | IQueueLike<T>) => void, reject: (reason?: any) => void) => void) => IQueueLike<T>;
export interface IQueueLike<T> extends PromiseLike<T> {
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    push<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | IQueueLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | IQueueLike<TResult2>) | undefined | null): IQueueLike<TResult1 | TResult2>;
}
export interface IQueue<T> extends Promise<T> {
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    push<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | IQueueLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | IQueueLike<TResult2>) | undefined | null): IQueue<TResult1 | TResult2>;
}
export declare type Queue = <T>() => IQueue<T>;
export declare const getQueue: <T>() => IQueue<T>;
export declare const promiseToQueue: <T>(promise: Promise<T>) => IQueue<T>;
