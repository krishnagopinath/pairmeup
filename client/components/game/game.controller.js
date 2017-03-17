import {
    icons,
    difficultyMap
} from './game.constants.js';

export default class GameController {

    constructor($stateParams, $timeout, ThemesModel) {
        'ngInject';

        const {
            difficulty,
            theme
        } = $stateParams;

        // all the inbuilt DI stuff
        this.$timeout = $timeout;

        // services and the like
        this.ThemesModel = ThemesModel;

        // the general stuff
        this.difficultyMap = {
            ...difficultyMap[difficulty],
            difficulty
        };
        this.theme = theme;
        this.themeItems = [];
        this.flags = {
            countdown: false,
            gameFinished: false,
            verifyingMove: false
        }
        this.indices = {
            active: [],
            complete: []
        }

    }

    getThemeItems = (theme, levelSeed) => {
        return this.ThemesModel.getShuffledThemeItems(theme, levelSeed).then(response => response.data);
    }

    computeThemeCells = (themeItems) => {
        // spread them out.. we need pairs of items
        const shuffledThemeItems = [...themeItems, ...themeItems]
            // shuffle
            .sort(() => 0.5 - Math.random())
            // add an `active` flag, shows out the grid
            .map(icon => Object.assign({}, icon, {
                active: true
            }));

        return shuffledThemeItems;
    }

    bindToView = (shuffledThemeItems) => {
        this.themeItems = shuffledThemeItems;
        return;
    }

    showAndHideGrid = () => {
        const hideAll = () => this.themeItems.map((ti) => ti.active = false);
        return this.$timeout(hideAll, 3000);
    }

    showProgressBar = (timerMaxValue) => {
        return () => {
            this.countdownValue = timerMaxValue;
            this.flags.countdown = true;
        };
    }

    verifyMove = (index1, index2) => {
        return function () {
            // some side effecty stuff :(
            this.flags.verifyingMove = true;
            return this.themeItems[index1].id === this.themeItems[index2].id;
        }
    }

    finishMove = (indices) => {
        return (isSame) => {
            if (isSame) {
                // move active ids to completed
                indices.complete.push(...indices.active);
            } else {
                // set the active themeItems to inactive 
                indices.active.forEach((index) => this.themeItems[index].active = false);
            }
            // make active empty
            indices.active = [];

            this.flags.verifyingMove = false;

            return indices;
        }
    }

    isGameFinished = () => {
        return this.indices.complete.length === this.themeItems.length;
    }

    finishGame = (gameFinished) => {
        if (gameFinished) {
            this.flags.gameFinished = true;
        }
    }

    endTimer() {
        this.flags.countdown = false;
        this.flags.gameFinished = true;
    }


    moveAllowed = (currentIndex) => {
        const { flags: { verifyingMove, countdown }, indices: { active, complete } } = this;

        return !verifyingMove &&
            !active.includes(currentIndex) &&
            !complete.includes(currentIndex) &&
            (active.length < 2) &&
            countdown;
    }

    makeMove = (currentIndex) => {

        if (this.moveAllowed(currentIndex)) {
            const {
                themeItems,
                verifyMove,
                finishMove,
                isGameFinished,
                finishGame,

                $timeout
            } = this;

            // make active
            themeItems[currentIndex].active = true;

            // add to activeIndices
            this.indices.active.push(currentIndex);

            const verifyMoveWithIndices = verifyMove(...this.indices.active).bind(this);
            const finishMoveWithIndices = finishMove(this.indices).bind(this);

            // if this is the second activeIndex and if they are equal
            if (this.indices.active.length === 2) {
                $timeout(verifyMoveWithIndices, 1000)
                    .then(finishMoveWithIndices)
                    .then((indices) => {
                        this.indices = indices;
                    })
                    .then(isGameFinished)
                    .then(finishGame);
            }

            console.log('ACTIVE => ', this.indices.active, '\nCOMPLETED =>', this.indices.complete);
        }
    }



    $onInit() {

        // get them all out!
        const {
            difficultyMap: {
                difficulty,
            uniquePairs,
            timerMaxValue
            },
            theme
        } = this;
        const {
            getThemeItems,
            computeThemeCells,
            bindToView,
            showAndHideGrid,
            showProgressBar
        } = this;

        // 🍛
        const curriedShowProgressBar = showProgressBar(timerMaxValue);

        // get the theme items for the grid based on `theme` and `difficulty` (ie., `uniquePairs`)
        getThemeItems(theme, uniquePairs)
            // build the grid
            .then(computeThemeCells)
            // bind the items to the view
            .then(bindToView)
            // show the grid, hide the grid after 3 secs
            .then(showAndHideGrid)
            // start the timer with the maxValue based on difficulty
            .then(curriedShowProgressBar);
    }
}

/* 

export default class GameController {
    constructor($timeout, $window, $interval, $stateParams, ThemesModel) {
        'ngInject';

        this.$timeout = $timeout;
        this.$window = $window;
        this.$stateParams = $stateParams;
        this.$interval = $interval;

        this.ThemesModel = ThemesModel;

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

        // from $stateParams
        const { difficulty, theme } = $stateParams;

        // from the previous state `options`
        const { uniquePairs, timerMaxValue, gridOpenTime } = difficultyMap[difficulty];

        this.maxValue = timerMaxValue;

        this.ThemesModel.getShuffledThemeItems(theme, uniquePairs)
            // generate the cells the comprise the grid shown in the UI
            .then(({ data }) => {

                this.gridCells = computeGridCells(data);

                console.log(this.gridCells);
                // then start the progress ticker
                showCells(resetGame, gridOpenTime).then(startTimer);
            });


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
        this.gridCells.map((cell) => cell.hidden = true);
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

    computeGridCells(icons) {

        const shuffledThemeItems = [...icons, ...icons]
            .sort(() => 0.5 - Math.random())
            .map(icon => Object.assign({}, icon, { active: false }));

        return shuffledThemeItems;
    }

    checkIfGameComplete() {
        if (this.completedIndices.length === this.gridCells.length) {
            this.showCover = true;
            this.gameWon = true;
            this.shouldStartTimer = false;
        }
    }

    makeMove(currentIndex) {

        const { verifyingMove, checkIfGameComplete, activeIndices, completedIndices } = this;
        // also when the grids are shown the first time
        if (!verifyingMove &&
            !activeIndices.includes(currentIndex) &&
            !completedIndices.includes(currentIndex) &&
            (activeIndices.length < 2)) {

            const { gridCells, verifyMove, $timeout } = this;

            // store active cell and make it active
            activeIndices.push(currentIndex);
            gridCells[currentIndex].hidden = false;

            // check if two active cells have been chosen
            // if yes, check if they're the same
            if (activeIndices.length === 2) {
                // verify move
                $timeout(verifyMove, 1000).then(checkIfGameComplete);
            }
        }
    }
}
*/