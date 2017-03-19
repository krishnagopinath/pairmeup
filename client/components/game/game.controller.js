import { difficultyMap } from './game.constants.js';



export default class GameController {

    constructor($stateParams, $timeout, ThemesModel) {
        'ngInject';

        const { difficulty, theme } = $stateParams;

        // all the inbuilt DI stuff
        this.$stateParams = $stateParams;
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
        const { difficultyMap: { difficulty, uniquePairs, timerMaxValue }, theme } = this;
        const { getThemeItems, computeThemeCells, bindToView, showAndHideGrid, showProgressBar } = this;

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
