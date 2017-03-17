import angular from 'angular';

import ThemesModel from './models/themes/themes.model';

const CommonModule = angular.module('common', [])
    .service('ThemesModel', ThemesModel);

export default CommonModule;