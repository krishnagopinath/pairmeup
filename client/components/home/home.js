import angular from 'angular';

import template from './home.tmpl.html'

const HomeModule = angular.module('home', []).component('home', { template });
                
export default HomeModule;            