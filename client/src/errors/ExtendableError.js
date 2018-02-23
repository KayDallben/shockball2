import PropTypes from 'prop-types'
//This could potentially be its own seperate package? For use in other future projects
class ExtendableError extends Error {
    constructor(message = "Error", err) {
        super(message, err);
        this.name = this.constructor.name;
        
        if (err instanceof Error) {
            this.message = `${this.name} | ${err.message} | ${message}`
            this.stack = err.stack
        } else if (err && !(err instanceof Error)) {
            throw new Error(`${this.name} class expected type 'Error' as the 2nd argument but received '${typeof err}'`)
        } else {
            this.message = `${this.name} | ${message}`
        }
        
        // This is to remove references to ExtendableError and the name of any Error that extends it... this is not needed but I will keep it here so people can look at the difference before go live
        // if (typeof Error.captureStackTrace === 'function') {
        //     Error.captureStackTrace(this, this.constructor);
        // } else {
        //     this.stack = (new Error(message)).stack;
        // }
    }
}

ExtendableError.propTypes = {
    'message': PropTypes.string,
    'properties': PropTypes.arrayOf(PropTypes.object).isRequired
  }

export default ExtendableError