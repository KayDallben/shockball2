import React from 'react';
import ReactDOM from 'react-dom';
import 'font-awesome/css/font-awesome.min.css';
import './index.scss';
import App from './App';
import Store from './store/store'
const store = new Store()
// import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App store={store} />, document.getElementById('root'));
// registerServiceWorker();