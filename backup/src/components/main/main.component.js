export const mainComponent = {
  template: `
    <div class="main-wrapper" back-radius="0" back-opacity="1" back-img="{{mainCtrl.background}}">
      <div class="content-wrapper">
        <div class="overlay"></div>
        <ui-view name="topNav"></ui-view>
        <ui-view name="navigation"></ui-view>
        <ui-view name="container"></ui-view>
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
