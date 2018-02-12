export const squadComponent = {
    template: `
      <div class="squad-wrapper">
      Squad wrapper area
      </div>
    `,
    bindings: {
    },
    controllerAs: 'squadCtrl',
    controller: class SquadController {
      constructor(data) {
        this.data = data
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