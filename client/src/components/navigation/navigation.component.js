export const navigationComponent = {
  template: `
    <div class="nav-wrapper">
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
