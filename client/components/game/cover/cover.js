import angular from 'angular';

const template = `     
    <div 
        class="uk-position-cover uk-overlay uk-overlay-default uk-flex uk-flex-center uk-flex-middle cover-stuff" 
        style="z-index: 1000">
        <button class="uk-alert-close" type="button" uk-close ng-click="vm.onCloseClick()"></button>
        <ng-transclude></ng-transclude>
    </div>`;

export default angular.module('cover', [])
    .component('cover', {
        bindings: { onCloseClick: '&' },
        template,
        transclude: true,
        controllerAs: "vm"
    });

