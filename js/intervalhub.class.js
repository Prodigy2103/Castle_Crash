export class IntervalHub {
    static allIntervals = [];
    static isPaused = false;

    static startInterval(func, timer) {
        const newInterval = setInterval(() => {
            if (!IntervalHub.isPaused) {
                func();
            }
        }, timer);
        IntervalHub.allIntervals.push(newInterval);
        return newInterval;
    }

    static stopInterval(intervalId) {
        clearInterval(intervalId);
        IntervalHub.allIntervals = IntervalHub.allIntervals.filter(id => id !== intervalId);
    }

    static stopAllIntervals() {
        IntervalHub.allIntervals.forEach(clearInterval);
        IntervalHub.allIntervals = [];
    }
}