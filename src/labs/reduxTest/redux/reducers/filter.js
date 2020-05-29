import {ALL} from "../TODO_TYPE";
import {SET_FILTER} from "../ACTION_TYPE";

const initState = ALL;

export default function (state = initState, action) {
  console.log('filter')
  switch (action.type) {
    case SET_FILTER: {
      return action.payload.status
    }
  }
  return state
}