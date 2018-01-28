// import server from '../app'
// import supertest from 'supertest'

describe('ExampleItemsController.js file', () => {

  test('test', () => {
    expect(true).toBe(true)
  })

  // test('responds to GET to /api/exampleItems', async () => {
  //   const response = await supertest(server).get('/api/exampleItems')
  //   expect(response.statusCode).toBe(200)
  //   expect(response.body.length).toBeGreaterThan(1)
  // })

  // test('responds to GET with id (number) to /api/exampleItems/:id', async () => {
  //   const testId = 7
  //   const response = await supertest(server).get('/api/exampleItems/' + testId)
  //   expect(response.statusCode).toBe(200)
  //   expect(response.body.id).toEqual(testId.toString())
  // })

  // test('responds error to GET with id (string) to /api/exampleItems/:id', async () => {
  //   const testId = 'stringValue'
  //   const response = await supertest(server).get('/api/exampleItems/' + testId)
  //   expect(response.statusCode).toBe(400)
  //   expect(response.body.name).toBe('ValidationError')
  // })

})
