import angular from 'angular';

const template = `     
    <div 
        class="uk-position-cover uk-overlay uk-overlay-default uk-flex uk-flex-center uk-flex-middle cover-stuff" 
        style="z-index: 1000">
        <ng-transclude></ng-transclude>
    </div>`;

export default angular.module('cover', [])
    .component('cover', {
        template,
        transclude: true,
        controllerAs: "vm"
    });

