import './App.css';
import 'antd/dist/antd.css';

import { Button } from 'antd';
import React, { useEffect, useState } from 'react';

import AppState, { AppStateContext } from './app/AppState';
import Main from './app/Main';

function App(props: unknown) {
    // Create the count state.
    const [count, setCount] = useState(0);
    // Create the counter (+1 every second).
    useEffect(() => {
        const timer = setTimeout(() => setCount(count + 1), 1000);
        return () => clearTimeout(timer);
    }, [count, setCount]);
    // Return the App component.
    return (
        <AppStateContext.Provider value={AppState}>
            <div className="App">
                <Main />
                <Button type={'primary'}>Button</Button>
            </div>
        </AppStateContext.Provider>
    );
}

export default App;
