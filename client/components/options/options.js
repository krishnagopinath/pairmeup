import angular from 'angular';

import DifficultyButtonModule from './difficulty-button/difficulty-button.js';

import template from './options.tmpl.html';

class OptionsController {
    constructor($window, $state, ThemesModel) {
        'ngInject';

        this.ThemesModel = ThemesModel;
        this.$window = $window;
        this.$state = $state;
    }

    $onInit() {
        // get available themes
        this.ThemesModel.getThemes().then(response => console.log(response));
    }

    chooseDifficulty(level) {
        this.$state.go('game', { difficulty: level });
    }
}

const OptionsModule = angular.module('options', [DifficultyButtonModule.name])
    .component('options', {
        template,
        controller: OptionsController,
        controllerAs: 'vm'
    })

export default OptionsModule;                          