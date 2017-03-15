// TODO Write tests for this component alone
// TODO break this into smaller components
import angular from 'angular';

import ProgressCountdownModule from './progress-countdown/progress-countdown';
import CoverModule from './cover/cover';

import template from './game.tmpl.html';
import './game.css';

import GameController from './game.controller.js';

const GameModule = angular.module('game', [ProgressCountdownModule.name, CoverModule.name])
    .component('game', {
        template,
        controller: GameController,
        controllerAs: 'vm'
    });

export default GameModule;