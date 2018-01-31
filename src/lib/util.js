// lib folder is for code files where there aren't much (or any) dependencies and can be imported on a file by file basis
//es6+ javascript selected! Can delete this comment
function reverseString(stringValue) {
  let reversedString = ''
  for (let character of stringValue) {
    reversedString = character + reversedString
  }
  return reversedString
}

function testPromise() {
  const promise = new Promise((resolve, reject) => {
    const data = { data: 'somestuff' }
    try {
      resolve(data)
    } catch(error) {
      reject(error)
    }
  })
  return promise
}

export {
  reverseString,
  testPromise
}
