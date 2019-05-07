import React from 'react';
import ReactDOM from 'react-dom';
import { BreakpointProvider } from 'react-socks';

// Redux
// import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
// import thunk from 'redux-thunk';
import './index.css';
import App from './App';
import './semantic/dist/semantic.min.css'
import registerServiceWorker from './registerServiceWorker';
import store from './vastuscomponents/redux/store';
import AWSConfig from "./AppConfig";
import {ifCallLambdaAtStart} from "./Constants";
import Lambda from "./vastuscomponents/api/Lambda";
import SplashScreen from "./authscreens/SplashScreen";

// AWSConfig();
// window.LOG_LEVEL='DEBUG';

require('./vastuscomponents/api/Ably');

// ReactDOM.render(<App />, document.getElementById('root'));
AWSConfig();
if (ifCallLambdaAtStart) { Lambda.ping(); }
ReactDOM.render(
    <BreakpointProvider>
        <Provider store={store}>
            <SplashScreen>
                <App />
            </SplashScreen>
        </Provider>
    </BreakpointProvider>,
    document.getElementById('root')
);
registerServiceWorker();
