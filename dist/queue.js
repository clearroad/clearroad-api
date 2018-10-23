import RSVP from 'rsvp';
export const getQueue = () => new RSVP.Queue();
export const promiseToQueue = (promise) => promise;
//# sourceMappingURL=queue.js.map