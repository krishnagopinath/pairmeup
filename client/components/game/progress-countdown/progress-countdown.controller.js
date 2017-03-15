const min = 0;
const intervalDuration = 1000;

export default class {
    constructor($interval) {
        "ngInject";

        this.$interval = $interval;
        this.startTimer = this.startTimer.bind(this);
    }

    startTimer() {
        if (this.currentValue && this.timer) {
            this.currentValue -= 1;
            if (min >= this.currentValue) {
                this.$interval.cancel(this.timer);
                // tell the parent that you're done - not very reuseable, but works for now.
                this.onTimerEnd();
            }
        }
    }

    $onInit() {
        const { max, startTimer, $interval } = this;

        this.currentValue = max;
        this.timer = $interval(startTimer, intervalDuration);
    }

    $onDestroy() {
        this.$interval.cancel(this.timer);
    }
}