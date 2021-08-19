import { makeAutoObservable } from 'mobx';
import { createContext } from 'react';

export class AppStateClass {
    sideBarCollapsed = false;

    constructor() {
        makeAutoObservable(this);
    }

    toggleDrawer(open = !this.sideBarCollapsed) {
        this.sideBarCollapsed = open;
    }
}

const AppState = new AppStateClass();
window.AppState = AppState;
export const AppStateContext = createContext(AppState);
export default AppState;
