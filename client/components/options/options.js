import angular from 'angular';

import DifficultyButtonModule from './difficulty-button/difficulty-button.js';

import template from './options.tmpl.html';

class OptionsController {
    constructor($window, $state, ThemesModel) {
        'ngInject';

        this.ThemesModel = ThemesModel;
        this.$window = $window;
        this.$state = $state;

        this.difficulty = null;
        this.theme = null;

        this.difficultyChosen = false;
    }

    $onInit() {
        // get available themes
        this.ThemesModel.getThemes().then(response => this.themes = response.data);
    }

    moveToGame() {
        const {difficulty, theme, $state} = this;

        if(theme && difficulty) $state.go('game', { difficulty, theme });
    }

    chooseDifficulty(level) {
        this.difficulty = level;
        this.difficultyChosen = true;
        this.moveToGame();
    }

    chooseTheme(theme) {
        this.theme = theme;
        this.moveToGame();
    }

}

const OptionsModule = angular.module('options', [DifficultyButtonModule.name])
    .component('options', {
        template,
        controller: OptionsController,
        controllerAs: 'vm'
    })

export default OptionsModule;                          