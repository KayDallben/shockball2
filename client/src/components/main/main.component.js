export const mainComponent = {
  // template: `
	// 	<sim></sim>
  // `,
  template: `
    <div class="main-wrapper" back-radius="0" back-opacity="1" back-img="{{mainCtrl.background}}">
      <div class="content-wrapper">
        <div class="overlay"></div>
        <div ui-view="topNav"></div>
        <div ui-view="navigation"></div>
        <div ui-view="container"></div>
      </div>
    </div>
  `,
  bindings: {
  },
  controllerAs: 'mainCtrl',
  controller: class MainController {
    constructor(data) {
      this.data = data;
      this.background = './img/shockballProto.jpg'
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
