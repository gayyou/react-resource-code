import {createStore, applyMiddleware} from "redux";
import reducer from './reducers';
import {logger} from "./middleware/logger";
import thunkMiddleware from 'redux-thunk'
import {fetchData} from "./actions";

const store = createStore(reducer, applyMiddleware(
  logger,
  thunkMiddleware
));

export default store;

store.dispatch(fetchData());