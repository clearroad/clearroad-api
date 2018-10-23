const { Queue } = require('rsvp');
export const getQueue = () => new Queue();
export const promiseToQueue = (promise) => promise;
//# sourceMappingURL=queue.js.map