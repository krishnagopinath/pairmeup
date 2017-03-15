import angular from 'angular';

import ProgressCountdownController from './progress-countdown.controller';
import template from './progress-countdown.tmpl.html';
import './progress-countdown.css';

const ProgressCountdownModule = angular.module('progressCountdown', [])
    .component('progressCountdown', {
        template,
        bindings: {
            max: '<',
            onTimerEnd: '&'
        },
        controller: ProgressCountdownController,
        controllerAs: 'vm'
    });

export default ProgressCountdownModule;