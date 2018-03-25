import ReactGA from 'react-ga'

let isInitialized = false;

function init(userId) {
    if (!isInitialized) {
        window.onerror = (error, url, line) => {
            const message = `ERR: ${error} ; URL: ${url} ; LINE: ${line}`
            gaException(message)
        }

        ReactGA.initialize('UA-116283317-1', {
            ...userId && { gaOptions: { userId: userId }}
        })

        isInitialized = true;
    }
}

function pageview(path) {
    if (isInitialized) {
        const sanitizedPath = path ? path : window.location.pathname
        ReactGA.pageview(sanitizedPath)
    }
}

function event(category, action, value, label, nonInteraction) {
    const sanitizedObject = {
        ...category && { category: category },
        ...action && { action: action },
        ...value && { value: value },
        ...label && { label: label },
        ...nonInteraction && { nonInteraction: nonInteraction }
    }
    ReactGA.event(sanitizedObject)
}

function gaException(message, isFatal) {
    const sanitizedObject = {
        ...message && { description: message },
        ...isFatal && { fatal: isFatal }
    }
    ReactGA.exception(sanitizedObject)
}

export {
    init,
    pageview,
    event,
    gaException
}