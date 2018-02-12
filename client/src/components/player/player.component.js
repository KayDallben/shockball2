export const playerComponent = {
  template: `
    <div class="player-wrapper">
      <div class="sidebar">
        <div class="player-photo">
          <img ng-src="{{playerCtrl.player.image}}">
        </div>
        <div class="player-name">{{playerCtrl.player.name}}</div>
      </div>
      <div class="player-body">placeholder</div>
    </div>
  `,
  bindings: {
  },
  controllerAs: 'playerCtrl',
  controller: class PlayerController {
    constructor(data, auth) {
      this.data = data
      this.auth = auth
      this.player = {
        image: '',
        name: ''
      }
    }

    getPlayerData() {
      this.auth.getUserInfo().then((response) => {
        this.player = response.data
      })
    }

    $onInit() {
      this.getPlayerData()
    }

    // injection here
    static get $inject() {
      return [
        'data',
        'auth'
      ];
    }
  }
}