import angular from 'angular'
import angularSpinner from 'angular-svg-round-progressbar'
import uirouter from '@uirouter/angularjs'
import angularJson from 'json-tree2'
import scrollGlue from 'angularjs-scroll-glue'
import angularSlider from 'angularjs-slider'

//import less
import css from './app.less'

//import angular app
import { mainComponent } from './components/main/main.component'
import { simComponent } from './components/sim/sim.component'
import { topHeaderComponent } from './components/topHeader/topHeader.component'
import { playerComponent } from './components/player/player.component'
import { squadComponent } from './components/squad/squad.component'
import { navigationComponent } from './components/navigation/navigation.component'
import DataService from './services/data'
import BackgroundImage from './directives/backgroundImage'
import AuthService from './services/auth'


angular.module('shockballGame', ['json-tree', 'luegg.directives', 'angular-svg-round-progressbar', 'rzModule', 'ui.router'])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('main', {
      url: '/',
      views: {
        '': {
          component: 'main'
        },
        'topNav@main': {
          component: 'topHeader'
        },
        'navigation@main': {
          component: 'navigation'
        },
        'container@main': {
          component: 'player'
        }
      }
    })
    .state('squad', {
      url: '/squad',
      views: {
        '': {
          component: 'main'
        },
        'topNav@squad': {
          component: 'topHeader'
        },
        'navigation@squad': {
          component: 'navigation'
        },
        'container@squad': {
          component: 'squad'
        }
      }
    })

    $urlRouterProvider.otherwise('/');
  }])
  .run(['auth', function(auth) {
    const hasAccessToken = auth.hasToken()
    const hasAuthCode = auth.hasAuthCode()
    if (hasAccessToken) {
      //all done logging in
      auth.getUserInfo().then(function(results) {
      })
    } else if (!hasAccessToken && hasAccessToken) {
      //has auth code but needs access token
    } else if (!hasAccessToken && !hasAuthCode) {
      //needs to login for first time
      auth.sendToLogin();
    }
  }])
  .service('auth', AuthService)
  .service('data', DataService)
  .component('sim', simComponent)
  .component('main', mainComponent)
  .component('topHeader', topHeaderComponent)
  .component('navigation', navigationComponent)
  .component('player', playerComponent)
  .component('squad', squadComponent)
  .directive('backImg', BackgroundImage)
  .constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated'
  })