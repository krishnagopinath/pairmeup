import angular from 'angular';

import HomeModule from './home/home.js';
import OptionsModule from './options/options.js';
import GameModule from './game/game.js'

const ComponentsModule = angular.module('components', [HomeModule.name, OptionsModule.name, GameModule.name]);

export default ComponentsModule;