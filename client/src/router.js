import { createHistory } from 'history'
import { Router } from 'director/build/director'
import { autorun } from 'mobx'

export function startRouter(store) {
    // update state on url change
    const router = new Router({
        "/fixture/:fixtureId": (id) => store.showFixturePage(id),
        "/league/": () => store.showLeaguePage(),
        "/": () => store.showHomePage()
    }).configure({
        notfound: () => store.showHomePage(),
        html5history: true
    }).init()

    // update url on state changes
    autorun(() => {
        const path = store.currentPath
        if (path !== window.location.pathname)
                window.history.pushState(null, null, path)
    })
}