// @flow
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from '../reducers';
import mySaga from '../sagas';

const history = createBrowserHistory();

const configureStore = (initialState: Object = {}) => {
  const middleware = [];
  const enhancers = [];

  //Router Middleware
  const router = routerMiddleware(history);
  middleware.push(router);

  //Saga Middleware
  const sagaMiddleware = createSagaMiddleware();
  middleware.push(sagaMiddleware);

  enhancers.push(applyMiddleware(...middleware));
  const enhancer = compose(...enhancers);

  const store = createStore(rootReducer, initialState, enhancer);
  sagaMiddleware.run(mySaga);

  return store;
};

export default { configureStore, history };
