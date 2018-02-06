export const topHeaderComponent = {
  template: `
    <div class="header-wrapper">
      <div class="team-info">
        <div class="team-logo" back-opacity="1" back-img="{{topHeaderCtrl.team.teamLogo}}"></div>
        <div class="team-longname">
          <div class="team-locale">{{::topHeaderCtrl.team.teamLocale}}</div>
          <div class="team-name">{{::topHeaderCtrl.team.teamName}}</div>
        </div>
        <div class="team-edit" ng-if="topHeaderCtrl.isManager">Edit</div>
      </div>
      <div class="shockball-logo-holder">
        <div class="shockball-logo" back-opacity="1" back-img="{{topHeaderCtrl.shockballLogo}}"></div>
        <div class="shockball-title">Shockball</div>
      </div>
      <div class="upcoming-match-holder">
        <div class="header">
          <div>Upcoming Match</div>
        </div>
        <div class="upcoming-content">
          <div class="upcoming-team">
            <div class="upcoming-team-logo" back-opacity="1" back-img="{{topHeaderCtrl.teamName}}"></div>
            <div class="upcoming-team-name">{{::topHeaderCtrl.teamLocale}} {{::topHeaderCtrl.teamName}}</div>
          </div>
          <div class="countdown">{{::topHeaderCtrl.countdown}}</div>
        </div>
      </div>
    </div>
  `,
  bindings: {
  },
  controllerAs: 'topHeaderCtrl',
  controller: class TopHeaderController {
    constructor(data) {
      this.data = data;
      this.team = {
        teamLogo: 'http://www.brandcrowd.com/gallery/brands/thumbs/thumb14751184306802.jpg',
        teamLocale: 'Abregado',
        teamName: 'Gentlemen'
      }
      this.upcomingMatch = {
        teamLogo: 'https://vignette1.wikia.nocookie.net/limmierpg/images/4/42/Rangers.jpg/revision/latest?cb=20140503184850',
        teamLocale: 'Kashyyyk',
        teamName: 'Rangers'
      }
      this.countdown = new Date().toString()
      this.shockballLogo = './img/shockballLogo.png'
      this.isManager = true
    }

    init() {
    }

    // injection here
    static get $inject() {
      return [
        'data'
      ];
    }
  }
}
