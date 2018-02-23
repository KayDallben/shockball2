import ExtendableError from './ExtendableError'

describe('ExtendableError', () => {
    test('It should be an instance of the \'Error\' class', () => {
        const testError = new ExtendableError();
        expect(testError instanceof Error).toBe(true)
    })

    describe('WITHOUT any params', () => {
        const testError = new ExtendableError()

        test('It should be named ExtendableError', () => {
            expect(testError.name).toBe("ExtendableError")
        })

        test('It should be have a message of \'ExtendableError | Error\'', () => {
            expect(testError.message).toBe("ExtendableError | Error")
        })

        test('It should have a stack trace', () => {
            expect(testError.stack.length).toBeTruthy()
        })
    })

    describe('WITHOUT the optional error param', () => {
        const testError = new ExtendableError("Test Message")

        test('It should be named ExtendableError', () => {
            expect(testError.name).toBe("ExtendableError")
        })

        test('It should be have a message of \'ExtendableError | Test Message\'', () => {
            expect(testError.message).toBe("ExtendableError | Test Message")
        })

        test('It should have a stack trace', () => {
            expect(testError.stack.length).toBeTruthy()
        })
    })

    describe('WITH the optional error param', () => {
        const err = new Error('BaseError')
        const testError = new ExtendableError("ExtendableError With Error", err)

        test('It should be named ExtendableError', () => {
            expect(testError.name).toBe("ExtendableError")
        })

        test('It should be have a message of \'ExtendableError With Error | BaseError\'', () => {
            expect(testError.message).toBe("ExtendableError | BaseError | ExtendableError With Error")
        })

        test('It should have a stack trace', () => {
            expect(testError.stack).toBe(err.stack)
        })
    })

    describe('WITH the optional error param as incorrect type', () => {
        expect(() => {
            const err = {
                message: "Fake Error Object Should Fail"
            }
            const testError = new ExtendableError("ExtendableError With Error", err)
        }).toThrow(/class expected type 'Error' as the 2nd argument but received/)
    })
})

describe('New Error Class extending ExtendableError', () => {
    describe('WITHOUT the optional error param', () => {

        class TestError extends ExtendableError {}

        const testError = new TestError("New Class Extended From ExtendableError")

        test('It should be named ExtendableError', () => {
            expect(testError.name).toBe("TestError")
        })

        test('It should be have a message of \'TestError | New Class Extended From ExtendableError\'', () => {
            expect(testError.message).toBe("TestError | New Class Extended From ExtendableError")
        })

        test('It should have a stack trace', () => {
            expect(testError.stack.length).toBeTruthy()
        })
    })

    describe('WITH the optional error param', () => {

        class TestError extends ExtendableError {}

        const err = new Error('BaseError')
        const testError = new TestError("New Class Extended From ExtendableError", err)

        test('It should be named ExtendableError', () => {
            expect(testError.name).toBe("TestError")
        })

        test('It should be have a message of \'TestError | BaseError | New Class Extended From ExtendableError\'', () => {
            expect(testError.message).toBe("TestError | BaseError | New Class Extended From ExtendableError")
        })

        test('It should have a stack trace', () => {
            expect(testError.stack).toBe(err.stack)
        })
    })
})