import angular from 'angular';

// import child modules
import EntryFormModule from './entryform/entryform.js'

const template = `
	<entryform></entryform>
`;

const HomeModule = angular.module('home', [
								EntryFormModule.name
							]).component('home', { template });
                
export default HomeModule;            