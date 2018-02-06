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

angular.module('shockballGame', ['json-tree', 'luegg.directives', 'angular-svg-round-progressbar', 'rzModule'])
.service('data', DataService)
.component('sim', simComponent)
.component('main', mainComponent)
.component('topHeader', topHeaderComponent)
.component('navigation', navigationComponent)
.directive('backImg', BackgroundImage)