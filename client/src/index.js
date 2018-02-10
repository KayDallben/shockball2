import angular from 'angular'
import angularSpinner from 'angular-svg-round-progressbar'
import angularJson from 'json-tree2'
import scrollGlue from 'angularjs-scroll-glue'
import angularSlider from 'angularjs-slider'

//import less
import css from './app.less'

//import angular app
import { mainComponent } from './components/main/main.component'
import { simComponent } from './components/sim/sim.component'
import { topHeaderComponent } from './components/topHeader/topHeader.component'
import { navigationComponent } from './components/navigation/navigation.component'
import DataService from './services/data'
import BackgroundImage from './directives/backgroundImage'
import AuthService from './services/auth'


angular.module('shockballGame', ['json-tree', 'luegg.directives', 'angular-svg-round-progressbar', 'rzModule'])
  .service('auth', AuthService)
  .run(['auth', function(auth) {
    const hasAccessToken = auth.hasToken()
    const hasAuthCode = auth.hasAuthCode()
    if (hasAccessToken) {
      //all done logging in
      auth.getUserInfo().then(function(results) {
        console.log('player logged in is: ')
        console.log(results)
      })
    } else if (!hasAccessToken && hasAccessToken) {
      //has auth code but needs access token
    } else if (!hasAccessToken && !hasAuthCode) {
      //needs to login for first time
      auth.sendToLogin();
    }
  }])
  .service('data', DataService)
  .component('sim', simComponent)
  .component('main', mainComponent)
  .component('topHeader', topHeaderComponent)
  .component('navigation', navigationComponent)
  .directive('backImg', BackgroundImage)