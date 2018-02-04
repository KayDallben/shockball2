import Main from './main'
import Util from './util'
import World from './world'
import Player from './player'
let main = new Main(new Util(), World, Player)

test('placeholder', () => {
  expect(main).toBeDefined()
});

// test('should define some global variables', () => {
//   expect(main.stopSim).toBeDefined();
//   expect(main.now).toBeDefined();
//   expect(main.then).toBeDefined();
//   expect(main.elapsed).toBeNull();
//   expect(main.fps).toBe(1000);
// });

// test('should exist', function () {
//   expect(main.beginGame).toBeDefined();
// });

// test('should take a framePerSecond parameter that is Number', function () {
//   var expectedError = new Error('Cannot start game: incorrect param data types');

//   var newGame = function () {
//     main.beginGame('200')
//   }
//   expect(newGame).toThrow(expectedError);

// });

// test('should exist', function () {
//   expect(main.mainLoop).toBeDefined();
// });

// test('should not call update, render, or requestAnimationFrame if stopSim is true', function () {
//   const updateSpy = jest.spyOn(main, 'update');
//   const renderSpy = jest.spyOn(main, 'render');
//   const rAFSpy = jest.spyOn(window, 'requestAnimationFrame');
//   main.stopSim = true;
//   main.mainLoop();
//   expect(updateSpy).not.toHaveBeenCalled();
//   expect(renderSpy).not.toHaveBeenCalled();
//   expect(rAFSpy).not.toHaveBeenCalled();
// });

// test('should order function calls by: update > render', function () {
//   const updateSpy = jest.spyOn(main, 'update');
//   const renderSpy = jest.spyOn(main, 'render');
//   main.mainLoop();
//   //ensure elapsed is greater than our 1 second fps
//   setTimeout(function () {
//     expect(updateSpy).toHaveBeenCalled();
//   }, 1050);
// });

// test('update function should exist', function () {
//   expect(main.update).toBeDefined();
// });