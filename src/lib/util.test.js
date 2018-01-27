//es6+ javascript selected! Can delete this comment
import { reverseString, testPromise } from './util'

describe('Util.js file', () => {

  test('reverses blam to mlab', () => {
    const originalString = 'blam'
    const reversedString = reverseString(originalString)
    expect(reversedString).toEqual('malb')
  })

  test('ensure promises resolve and whatnot', async () => {
    let result = await testPromise()
    expect(result).toEqual({ data: 'somestuff' })
  })

})
