import { AppStateClass } from '../src/app/AppState';

declare global {
    interface Window {
        AppState: AppStateClass;
    }
}
