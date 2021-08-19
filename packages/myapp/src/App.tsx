import './App.css';
import 'antd/dist/antd.css';
import React, { useEffect, useState } from 'react';

import AppState, { AppStateContext } from './app/AppState';
import Main from './app/Main';
import { API_URL, loadApiData } from './app/utils/constants';
import {
    colors,
    MuiThemeProvider,
    unstable_createMuiStrictModeTheme as createMuiTheme,
} from '@material-ui/core';

const theme = createMuiTheme({
    palette: {
        primary: colors.purple,
        secondary: colors.green,
    },
});

function App(props: unknown) {
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        if (!API_URL) {
            loadApiData().finally(() => {
                console.log('enters 2', API_URL);
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <MuiThemeProvider theme={theme}>
            <AppStateContext.Provider value={AppState}>
                {isLoading ? (
                    <div>loading</div>
                ) : (
                    <div className="App">
                        <Main />
                    </div>
                )}
            </AppStateContext.Provider>
        </MuiThemeProvider>
    );
}

export default App;
