export const navigationComponent = {
  template: `
    <div class="nav-wrapper">
      <div ui-sref="me">
        <div class="title-icon fa fa-user"></div>
        <div class="title">Me</div>
      </div>
      <div ui-sref="squad">
        <div class="title-icon fa fa-users"></div>
        <div class="title">Squad</div>
      </div>
      <div>
        <div class="title-icon fa fa-briefcase"></div>
        <div class="title">Office</div>
      </div>
      <div>
        <div class="title-icon fa fa-flag"></div>
        <div class="title">League</div>
      </div>
      <div>
        <div class="title-icon fa fa-building"></div>
        <div class="title">Transfers</div>
      </div>
    </div>
  `,
  bindings: {
  },
  controllerAs: 'navigationCtrl',
  controller: class NavigationController {
    constructor(data) {
      this.data = data;
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
