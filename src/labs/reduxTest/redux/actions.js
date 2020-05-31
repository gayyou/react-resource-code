import {ADD_ACTION, SET_FILTER, TRIGGER_ACTION} from "./ACTION_TYPE";
import {ALL, RESOLVE, UN_RESOlVLE} from "./TODO_TYPE";

let uid = 1;

export const addTodo = (content) => ({
  type: ADD_ACTION,
  payload: {
    id: uid++,
    content,
    status: UN_RESOlVLE
  }
});

export const triggerTodo = (id) => ({
  type: TRIGGER_ACTION,
  payload: {
    id
  }
})

export const showAllTodo = () => ({
  type: SET_FILTER,
  payload: {
    status: ALL
  }
});

export const showUnResolveTodo = () => ({
  type: SET_FILTER,
  payload: {
    status: UN_RESOlVLE
  }
});

export const showResolvedTodo = () => ({
  type: SET_FILTER,
  payload: {
    status: RESOLVE
  }
});