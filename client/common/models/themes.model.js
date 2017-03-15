export default class {
    constructor($http) {
        'ngInject';
                
        this.$http = $http;
    }

    getThemes() {
        return this.$http.get('/api/themes');
    }
}