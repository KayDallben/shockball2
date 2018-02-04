const player = require('./player');

test('should be defined', () => {
  expect(player).toBeDefined();
});

// it('first param should take only Number', function () {
//   var expectedError = new Error('Cannot create Player: incorrect param data types')

//   var newPlayer = function () {
//     new Player('wrongType', 'NA', 'NA')
//   }
//   expect(newPlayer).toThrow(expectedError);
//   var newPlayer = function () {
//     new Player({}, 'NA', 'NA')
//   }
//   expect(newPlayer).toThrow(expectedError);
//   var newPlayer = function () {
//     new Player(undefined, 'NA', 'NA')
//   }
//   expect(newPlayer).toThrow(expectedError);
//   var newPlayer = function () {
//     new Player(null, 'NA', 'NA')
//   }
//   expect(newPlayer).toThrow(expectedError);
//   var newPlayer = function () {
//     new Player([], 'NA', 'NA')
//   }
//   expect(newPlayer).toThrow(expectedError);
//   var newPlayer = function () {
//     new Player(true, 'NA', 'NA')
//   }
//   expect(newPlayer).toThrow(expectedError);
//   var newPlayer = function () {
//     new Player(5, 'NA', 'NA')
//   }
//   expect(newPlayer).not.toThrow(expectedError);
// });

// it('second param should take only String', function () {
//   var expectedError = new Error('Cannot create Player: incorrect param data types')

//   var newPlayer = function () {
//     new Player(3, 3, 'NA')
//   }
//   expect(newPlayer).toThrow(expectedError);
//   var newPlayer = function () {
//     new Player(3, {}, 'NA')
//   }
//   expect(newPlayer).toThrow(expectedError);
//   var newPlayer = function () {
//     new Player(3, [], 'NA')
//   }
//   expect(newPlayer).toThrow(expectedError);
//   var newPlayer = function () {
//     new Player(3, undefined, 'NA')
//   }
//   expect(newPlayer).toThrow(expectedError);
//   var newPlayer = function () {
//     new Player(3, null, 'NA')
//   }
//   expect(newPlayer).toThrow(expectedError);
//   var newPlayer = function () {
//     new Player(3, true, 'NA')
//   }
//   expect(newPlayer).toThrow(expectedError);
//   var newPlayer = function () {
//     new Player(3, 'bob', 'NA')
//   }
//   expect(newPlayer).not.toThrow(expectedError);
// });

// it('third param should take only String', function () {
//   var expectedError = new Error('Cannot create Player: incorrect param data types')

//   var newPlayer = function () {
//     new Player(3, 'NA', 3)
//   }
//   expect(newPlayer).toThrow(expectedError);
//   var newPlayer = function () {
//     new Player(3, 'NA', {})
//   }
//   expect(newPlayer).toThrow(expectedError);
//   var newPlayer = function () {
//     new Player(3, 'NA', [])
//   }
//   expect(newPlayer).toThrow(expectedError);
//   var newPlayer = function () {
//     new Player(3, 'NA', undefined)
//   }
//   expect(newPlayer).toThrow(expectedError);
//   var newPlayer = function () {
//     new Player(3, 'NA', null)
//   }
//   expect(newPlayer).toThrow(expectedError);
//   var newPlayer = function () {
//     new Player(3, 'NA', true)
//   }
//   expect(newPlayer).toThrow(expectedError);
//   var newPlayer = function () {
//     new Player(3, 'NA', 'smith')
//   }
//   expect(newPlayer).not.toThrow(expectedError);
// });

// it('should have an x and y coordinate', function () {
//   var newPlayer = new Player(4, 'bob', 'smith');
//   expect(newPlayer.x).toBeDefined();
//   expect(newPlayer.y).toBeDefined();
// });

// it('should default x and y to zero', function () {
//   var newPlayer = new Player(4, 'bob', 'smith');
//   expect(newPlayer.x).toBe(0);
//   expect(newPlayer.y).toBe(0);
// })

// it('should take an id, first name, and last name to create a new Player', function () {
//   var newPlayer = new Player(4, 'Bob', 'Smith');
//   expect(newPlayer.uid).toBe(4);
//   expect(newPlayer.firstName).toBe('Bob');
//   expect(newPlayer.lastName).toBe('Smith');
// });

// it('should have a moveUp function', function () {
//   var newPlayer = new Player(4, 'Bob', 'Smith');
//   expect(newPlayer.moveUp).toBeDefined();
// });

// it('should only take integers as param', function () {
//   var expectedError = new Error('Cannot move Player: incorrect param data type')
//   var newPlayer = new Player(4, 'Bob', 'Smith');

//   var moveCommand = function () {
//     newPlayer.moveUp('3')
//   }
//   expect(moveCommand).toThrow(expectedError);
//   var moveCommand = function () {
//     newPlayer.moveUp({
//       three: '3'
//     })
//   }
//   expect(moveCommand).toThrow(expectedError);
//   var moveCommand = function () {
//     newPlayer.moveUp([3])
//   }
//   expect(moveCommand).toThrow(expectedError);
//   var moveCommand = function () {
//     newPlayer.moveUp(undefined)
//   }
//   expect(moveCommand).toThrow(expectedError);
//   var moveCommand = function () {
//     newPlayer.moveUp(true)
//   }
//   expect(moveCommand).toThrow(expectedError);
//   var moveCommand = function () {
//     newPlayer.moveUp(null)
//   }
//   expect(moveCommand).toThrow(expectedError);
//   var moveCommand = function () {
//     newPlayer.moveUp(null)
//   }
//   expect(moveCommand).toThrow(expectedError);
//   var moveCommand = function () {
//     newPlayer.moveUp(4)
//   }
//   expect(moveCommand).not.toThrow(expectedError);
// });

// it('should increment y coordinate by param amount', function () {
//   var newPlayer = new Player(4, 'Bob', 'Smith');
//   newPlayer.moveUp(3);
//   expect(newPlayer.y).toBe(3);
//   newPlayer.moveUp(2);
//   expect(newPlayer.y).toBe(5);
// });

// it('should have a moveDown function', function () {
//   var newPlayer = new Player(4, 'Bob', 'Smith');
//   expect(newPlayer.moveDown).toBeDefined();
// });

// it('should only take integers as param', function () {
//   var expectedError = new Error('Cannot move Player: incorrect param data type')
//   var newPlayer = new Player(4, 'Bob', 'Smith');

//   var moveCommand = function () {
//     newPlayer.moveDown('3')
//   }
//   expect(moveCommand).toThrow(expectedError);
//   var moveCommand = function () {
//     newPlayer.moveDown({
//       three: '3'
//     })
//   }
//   expect(moveCommand).toThrow(expectedError);
//   var moveCommand = function () {
//     newPlayer.moveDown([3])
//   }
//   expect(moveCommand).toThrow(expectedError);
//   var moveCommand = function () {
//     newPlayer.moveDown(undefined)
//   }
//   expect(moveCommand).toThrow(expectedError);
//   var moveCommand = function () {
//     newPlayer.moveDown(true)
//   }
//   expect(moveCommand).toThrow(expectedError);
//   var moveCommand = function () {
//     newPlayer.moveDown(null)
//   }
//   expect(moveCommand).toThrow(expectedError);
//   var moveCommand = function () {
//     newPlayer.moveDown(null)
//   }
//   expect(moveCommand).toThrow(expectedError);
//   var moveCommand = function () {
//     newPlayer.moveDown(4)
//   }
//   expect(moveCommand).not.toThrow(expectedError);
// });

// it('should decrement y coordinate by param amount', function () {
//   var newPlayer = new Player(4, 'Bob', 'Smith');
//   newPlayer.moveDown(3);
//   expect(newPlayer.y).toBe(-3);
//   newPlayer.moveDown(2);
//   expect(newPlayer.y).toBe(-5);
// });

// it('should have a moveLeft function', function () {
//   var newPlayer = new Player(4, 'Bob', 'Smith');
//   expect(newPlayer.moveLeft).toBeDefined();
// });

// it('should only take integers as param', function () {
//   var expectedError = new Error('Cannot move Player: incorrect param data type')
//   var newPlayer = new Player(4, 'Bob', 'Smith');

//   var moveCommand = function () {
//     newPlayer.moveLeft('3')
//   }
//   expect(moveCommand).toThrow(expectedError);
//   var moveCommand = function () {
//     newPlayer.moveLeft({
//       three: '3'
//     })
//   }
//   expect(moveCommand).toThrow(expectedError);
//   var moveCommand = function () {
//     newPlayer.moveLeft([3])
//   }
//   expect(moveCommand).toThrow(expectedError);
//   var moveCommand = function () {
//     newPlayer.moveLeft(undefined)
//   }
//   expect(moveCommand).toThrow(expectedError);
//   var moveCommand = function () {
//     newPlayer.moveLeft(true)
//   }
//   expect(moveCommand).toThrow(expectedError);
//   var moveCommand = function () {
//     newPlayer.moveLeft(null)
//   }
//   expect(moveCommand).toThrow(expectedError);
//   var moveCommand = function () {
//     newPlayer.moveLeft(null)
//   }
//   expect(moveCommand).toThrow(expectedError);
//   var moveCommand = function () {
//     newPlayer.moveLeft(4)
//   }
//   expect(moveCommand).not.toThrow(expectedError);
// });

// it('should decrement x coordinate by param amount', function () {
//   var newPlayer = new Player(4, 'Bob', 'Smith');
//   newPlayer.moveLeft(3);
//   expect(newPlayer.x).toBe(-3);
//   newPlayer.moveLeft(2);
//   expect(newPlayer.x).toBe(-5);
// });



// it('should have a moveRight function', function () {
//   var newPlayer = new Player(4, 'Bob', 'Smith');
//   expect(newPlayer.moveRight).toBeDefined();
// });

// it('should only take integers as param', function () {
//   var expectedError = new Error('Cannot move Player: incorrect param data type')
//   var newPlayer = new Player(4, 'Bob', 'Smith');

//   var moveCommand = function () {
//     newPlayer.moveRight('3')
//   }
//   expect(moveCommand).toThrow(expectedError);
//   var moveCommand = function () {
//     newPlayer.moveRight({
//       three: '3'
//     })
//   }
//   expect(moveCommand).toThrow(expectedError);
//   var moveCommand = function () {
//     newPlayer.moveRight([3])
//   }
//   expect(moveCommand).toThrow(expectedError);
//   var moveCommand = function () {
//     newPlayer.moveRight(undefined)
//   }
//   expect(moveCommand).toThrow(expectedError);
//   var moveCommand = function () {
//     newPlayer.moveRight(true)
//   }
//   expect(moveCommand).toThrow(expectedError);
//   var moveCommand = function () {
//     newPlayer.moveRight(null)
//   }
//   expect(moveCommand).toThrow(expectedError);
//   var moveCommand = function () {
//     newPlayer.moveRight(4)
//   }
//   expect(moveCommand).not.toThrow(expectedError);
// });

// it('should increment x coordinate by param amount', function () {
//   var newPlayer = new Player(4, 'Bob', 'Smith');
//   newPlayer.moveRight(3);
//   expect(newPlayer.x).toBe(3);
//   newPlayer.moveRight(2);
//   expect(newPlayer.x).toBe(5);
// });



// it('should be defined', function () {
//   var newPlayer = new Player(4, 'Bob', 'Smith');
//   expect(newPlayer.setPosition).toBeDefined();
// });

// it('first param should only take integers', function () {
//   var expectedError = new Error('Cannot set Player: incorrect param data types')
//   var newPlayer = new Player(4, 'Bob', 'Smith');

//   var command = function () {
//     newPlayer.setPosition('3', 4)
//   }
//   expect(command).toThrow(expectedError);
//   var command = function () {
//     newPlayer.setPosition({
//       three: '3'
//     }, 4)
//   }
//   expect(command).toThrow(expectedError);
//   var command = function () {
//     newPlayer.setPosition([3], 4)
//   }
//   expect(command).toThrow(expectedError);
//   var command = function () {
//     newPlayer.setPosition(undefined, 4)
//   }
//   expect(command).toThrow(expectedError);
//   var command = function () {
//     newPlayer.setPosition(true, 4)
//   }
//   expect(command).toThrow(expectedError);
//   var command = function () {
//     newPlayer.setPosition(null, 4)
//   }
//   expect(command).toThrow(expectedError);
//   var command = function () {
//     newPlayer.setPosition(3, 4)
//   }
//   expect(command).not.toThrow(expectedError);
// });

// it('second param should only take integers', function () {
//   var expectedError = new Error('Cannot set Player: incorrect param data types')
//   var newPlayer = new Player(4, 'Bob', 'Smith');

//   var command = function () {
//     newPlayer.setPosition(3, '4')
//   }
//   expect(command).toThrow(expectedError);
//   var command = function () {
//     newPlayer.setPosition(3, {
//       three: 3
//     })
//   }
//   expect(command).toThrow(expectedError);
//   var command = function () {
//     newPlayer.setPosition(3, [4])
//   }
//   expect(command).toThrow(expectedError);
//   var command = function () {
//     newPlayer.setPosition(3, undefined)
//   }
//   expect(command).toThrow(expectedError);
//   var command = function () {
//     newPlayer.setPosition(3, true)
//   }
//   expect(command).toThrow(expectedError);
//   var command = function () {
//     newPlayer.setPosition(3, null)
//   }
//   expect(command).toThrow(expectedError);
//   var command = function () {
//     newPlayer.setPosition(3, 4)
//   }
//   expect(command).not.toThrow(expectedError);
// });

// it('should update Player x and y', function () {
//   var newPlayer = new Player(4, 'Bob', 'Smith');
//   newPlayer.setPosition(3, 4);
//   expect(newPlayer.x).toBe(3);
//   expect(newPlayer.y).toBe(4);
// });