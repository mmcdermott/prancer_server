import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Redirect } from 'react-router';

import {createBrowserHistory} from 'history';
const browserHistory = createBrowserHistory();

import { syncHistoryWithStore } from 'react-router-redux';

import configureStore from './store/configureStore.js';
import routes from './routes.js';
import './style.scss';

// import 'expose?$!expose?jQuery!jquery';

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Redirect from="/" to="main" />
            {routes}
        </Router>
    </Provider>,
    document.getElementById('root')
);
