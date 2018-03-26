import ReactGA from 'react-ga'

import * as utils from '../utils/utils'

let isInitialized = false;

function setupConsoleLogging() {
    window.onerror = (error, url, line) => {
        const shockballErrorText = JSON.stringify({
            error: error,
            url: url,
            line: line,
            shockballErrorId: utils.uuidv4()
        })
        gaException(shockballErrorText)
    }

    ['warn','debug','error'].forEach(function (verb) {
        console[verb] = (function (method, verb) {
            return function (text) {
                method(text);
                const shockballErrorText = JSON.stringify({
                    error: text,
                    shockballErrorId: utils.uuidv4()
                })
                gaException(shockballErrorText)
            };
        })(console[verb].bind(console), verb);
    });
}

function init(userId) {
    if (!isInitialized) {
        
        setupConsoleLogging()

        ReactGA.initialize('UA-116283317-1', {
            ...userId && { gaOptions: { userId: userId }}
        })

        window.Raven.setUserContext({
            id: userId ? userId : 'notCaptured'
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