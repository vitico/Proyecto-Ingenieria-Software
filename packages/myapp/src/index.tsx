import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { loadApiData } from './app/utils/constants';

const render = (Component: any) => {
    ReactDOM.render(
        <React.StrictMode>
            <Component />
        </React.StrictMode>,
        document.getElementById('root')
    );
};

loadApiData().then(() => {
    render(App);
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
// @ts-ignore
if (module.hot) {
    // @ts-ignore
    module.hot.accept('./App', () => {
        const NextApp = require('./App').default;
        render(NextApp);
    });
}
