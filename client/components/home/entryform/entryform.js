import angular from 'angular';

import template from './entryform.tmpl.html';

class EntryFormController {
	constructor($window, $state) {
		'ngInject';
		this.name = "";
		this.$window = $window;
		this.$state = $state;
	}

	formSubmit() {

		const {name, $window, $state} = this;

		if(name) {
			$window.localStorage.setItem('name', name);
			$state.go('options');
		}
	}
}

const EntryFormModule = angular.module('entryform', [])
								.component('entryform', {
									template,
									controller: EntryFormController,
									controllerAs: 'vm'
								});

export default EntryFormModule;								