import angular from 'angular';

const template = `
  <button 
    ng-class="[
        'uk-button uk-button-large',
        {
            easy: 'uk-button-default',
            medium: 'uk-button-primary',
            hard: 'uk-button-danger'
        } [ vm.level ]
    ]" 
    ng-click="vm.onLevelChosen({ level: vm.level })"
    ng-transclude>
        
  </button>`;

const DifficultyButtonModule = angular.module('difficultyButton', [])
    .component('difficultyButton', {
        template,
        bindings: { level: '<', onLevelChosen: '&' },
        controllerAs: 'vm',
        transclude: true
    });

export default DifficultyButtonModule;        