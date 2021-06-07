import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';

import Main from './Main';

ReactDOM.render(
	<React.StrictMode>
		<Main />
	</React.StrictMode>,
	document.getElementById('root')
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
import.meta.hot?.accept();
