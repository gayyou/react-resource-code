import {combineReducers} from 'redux'
import todoList from './todos';
import filter from './filter'

export default combineReducers({todoList, filter});