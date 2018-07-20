import { createStore, applyMiddleware, compose } from 'redux';
// import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducer';
import mySaga from '../sagas';
import type { StoreType } from '../types';

const history = createHashHistory();

const configureStore = (initialState: Object = {}): StoreType => {
  // Redux Configuration
  const middleware = [];
  const enhancers = [];

  // Thunk Middleware
  // middleware.push(thunk);

  const sagaMiddleware = createSagaMiddleware();
  middleware.push(sagaMiddleware);

  // Logging Middleware
  const logger = createLogger({
    level: 'info',
    collapsed: true
  });

  // Skip redux logs in console during the tests
  if (process.env.NODE_ENV !== 'test') {
    middleware.push(logger);
  }

  // Router Middleware
  const router = routerMiddleware(history);
  middleware.push(router);

  // Redux DevTools Configuration
  const actionCreators = {};
  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(actionCreators)
    : compose;
  /* eslint-enable no-underscore-dangle */

  // Apply Middleware & Compose Enhancers
  enhancers.push(applyMiddleware(...middleware));
  const enhancer = composeEnhancers(...enhancers);

  // Create Store
  const store = createStore(rootReducer, initialState, enhancer);
  sagaMiddleware.run(mySaga);

  if (module.hot) {
    module.hot.accept(
      '../reducer',
      () => store.replaceReducer(require('../reducer')) // eslint-disable-line global-require
    ); // eslint-disable-line global-require
  }

  return store;
};

export default { configureStore, history };
