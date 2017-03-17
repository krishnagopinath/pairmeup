export default class {
    constructor($http) {
        'ngInject';

        this.$http = $http;
    }

    getThemes = () => this.$http.get('/api/themes');
    getShuffledThemeItems = (theme, levelSeed) => this.$http.get(`/api/themes/${theme}/${levelSeed}`);
}