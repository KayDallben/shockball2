export const mainComponent = {
  template: `
		<sim></sim>
	`,
  bindings: {
    demoAttr1: '=',
    demoAttr2: '='
  },
  controllerAs: 'mainCtrl',
  controller: class MainController {
    constructor(data) {
      this.data = data;
      this.title = 'test title'
    }

    init() {
      this.title = this.data.login();
    }

    // injection here
    static get $inject() {
      return [
        'data'
      ];
    }
  }
}
