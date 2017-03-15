import { icons, difficultyMap } from './game.constants.js';

export default class GameController {
    constructor($timeout, $window, $interval, $stateParams) {
        'ngInject';

        this.$timeout = $timeout;
        this.$window = $window;
        this.$stateParams = $stateParams;
        this.$interval = $interval;

        this.activeIndices = [];
        this.completedIndices = [];

        this.gridCells = [];
        this.verifyingMove = false;
        this.shouldStartTimer = false;
        this.showCover = false;

        this.showCells = this.showCells.bind(this);
        this.resetGame = this.resetGame.bind(this);
        this.startTimer = this.startTimer.bind(this);
        this.verifyMove = this.verifyMove.bind(this);
        this.checkIfGameComplete = this.checkIfGameComplete.bind(this);
    }

    $onInit() {

        // get stuff out of `this` - makes it easier to type ;)
        // functions first
        const { resetGame, computeGridCells, showCells, startTimer } = this;
        // `$` next
        const { $timeout, $stateParams } = this;        

        // from the previous state `options`
        const { uniquePairs, timerMaxValue, gridOpenTime } = difficultyMap[$stateParams.difficulty];

        // generate the cells the comprise the grid shown in the UI
        this.gridCells = computeGridCells(icons, uniquePairs);

        // show the cells for a bit, then start the progress ticker
        showCells(resetGame, gridOpenTime).then(startTimer);

        this.maxValue = timerMaxValue;
    }

    $onDestroy() {
        this.gridCells = [];
    }

    showCells(fn, interval) {
        return this.$timeout(fn, interval);
    }

    startTimer() {
        this.shouldStartTimer = true;
    }

    endTimer() {
        this.shouldStartTimer = false;
        this.showCover = true;
        this.gameWon = false;
    }

    hideCover() {
        this.showCover = false;
    }

    resetGame() {
        this.gridCells.map((cell) => cell.active = false);
    }

    verifyMove() {
        const { activeIndices, completedIndices, gridCells } = this;

        this.verifyingMove = true;

        const [first, last] = activeIndices;

        if (gridCells[first].icon === gridCells[last].icon) {
            // move the activeCells to completedCells    
            completedIndices.push(...this.activeIndices);
        } else {
            activeIndices.map((index) => (gridCells[index].active = false));
        }

        // empty activeCells
        activeIndices.length = 0;

        this.verifyingMove = false;

        console.log('ACTIVE => ', activeIndices, '\nCOMPLETED =>', completedIndices);
    }

    computeGridCells(icons, uniquePairs) {
        const shuffled = icons.sort(() => .5 - Math.random());
        const gridCells = [...shuffled.slice(0, uniquePairs), ...shuffled.slice(0, uniquePairs)];

        return gridCells.sort(() => 0.5 - Math.random()).map(icon => ({ icon, active: true }));
    }

    checkIfGameComplete() {
        if(this.completedIndices.length === this.gridCells.length) {
            this.showCover = true;
            this.gameWon = true;
            this.shouldStartTimer = false;
        }
    }

    makeMove(currentIndex) {

        const { verifyingMove, checkIfGameComplete, activeIndices, completedIndices } = this;

        if (!verifyingMove &&
            !activeIndices.includes(currentIndex) &&
            !completedIndices.includes(currentIndex) &&
            (activeIndices.length < 2)) {

            const { gridCells, verifyMove, $timeout } = this;

            // store active cell and make it active
            activeIndices.push(currentIndex);
            gridCells[currentIndex].active = true;

            // check if two active cells have been chosen
            // if yes, check if they're the same
            if (activeIndices.length === 2) {
                // verify move
                $timeout(verifyMove, 1000).then(checkIfGameComplete);
            }
        }
    }
}