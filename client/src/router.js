import { createHistory } from 'history'
import { Router } from 'director/build/director'
import { autorun } from 'mobx'

export function startRouter(store) {
    // update state on url change
    const router = new Router({
        "/player/:playerId": (id) => store.showPlayerPage(id),
        "/squad/:squadId": (id) => store.showSquadPage(id),
        "/fixture/:fixtureId": (id) => store.showFixturePage(id),
        "/league": () => store.showLeaguePage(),
        "/transfers": () => store.showTransfersPage(),
        "/office": () => store.showOfficePage(),
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