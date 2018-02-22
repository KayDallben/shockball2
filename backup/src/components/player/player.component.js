export const playerComponent = {
  template: `
    <div class="player-wrapper">
      <div class="sidebar">
        <div class="player-photo">
          <img ng-src="{{playerCtrl.player.image}}">
        </div>
        <div class="player-name">{{playerCtrl.player.name}}</div>
      </div>
      <div class="player-body">
        <div class="stats">
          <h2>Skills</h2>
          <div class="skill">Passing: {{playerCtrl.player.passing}}</div>
          <div class="skill">Throwing: {{playerCtrl.player.throwing}}</div>
          <div class="skill">Blocking: {{playerCtrl.player.blocking}}</div>
          <div class="skill">Vision: {{playerCtrl.player.vision}}</div>
          <div class="skill">Toughness: {{playerCtrl.player.toughness}}</div>
          <div class="skill">Endurance: {{playerCtrl.player.endurance}}</div>
          <h2>Modifiers</h2>
          <div class="modifier">Leadership: {{playerCtrl.player.leadership}}</div>
          <div class="modifier">Morale: {{playerCtrl.player.morale}}</div>
          <div class="modifier">Fatigue: {{playerCtrl.player.fatigue}}</div>
          <div class="modifier">Aggression: {{playerCtrl.player.aggression}}</div>
            
        </div>
      </div>
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