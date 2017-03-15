import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import 'uikit/dist/css/uikit.min.css';

import angular from 'angular';
import uiRouter from 'angular-ui-router';

import template from './app.tmpl.html';
import './app.css';

import config from './app.config.js';

// import the Component tree
import ComponentsModule from './components/components.js';

// import Shared modules
import CommonModule from './common/common.js';

UIkit.use(Icons);   

angular
    .module('app', [
        uiRouter, 
        ComponentsModule.name,
        CommonModule.name
    ])
    .component('app', {
	    template
	})
    .config(config);
