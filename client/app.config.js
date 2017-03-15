const config = (($urlRouterProvider, $stateProvider) => {
    'ngInject';

    $urlRouterProvider.otherwise('/app');

    // app's page state
    $stateProvider.state({
        name: 'app',
        url: '/app',
        redirectTo: 'home',
        component: 'app'
    });

    // app.home state
    $stateProvider.state({
        name: 'home',
        parent: 'app',
        url: '/home',
        component: 'home'
    });

    // app.options state
    $stateProvider.state({
        name: 'options',
        parent: 'app',
        url: '/options',
        component: 'options'
    });

    // app.game state
    $stateProvider.state({
        name: 'game',
        parent: 'app',
        url: '/game/?difficulty',
        component: 'game'
    });


});

export default config;