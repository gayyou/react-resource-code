import {ADD_ACTION, TRIGGER_ACTION} from "../ACTION_TYPE";
import {RESOLVE, UN_RESOlVLE} from "../TODO_TYPE";

const initTodoList = {
  allId: [],
  itemMapById: {}
};

/**
 * @desc trigger todoList state
 * @param state
 * @param action
 * @return {{allId: [[], *], itemMapById: {}}|{allId: [], itemMapById: {}}}
 */
export default function (state = initTodoList, action) {
  console.log('todos');

  switch (action.type) {
    case ADD_ACTION: {
      let {id, content, status} = action.payload;
      return {
        allId: [...state.allId, id],
        itemMapById: {
          ...state.itemMapById,
          [id]: {
            content,
            status
          }
        }
      };
    }

    case TRIGGER_ACTION: {
      let {id} = action.payload;
      return {
        allId: state.allId,
        itemMapById: {
          ...state.itemMapById,
          [id]: {
            content: state.itemMapById[id].content,
            status: state.itemMapById[id].status === RESOLVE ? UN_RESOlVLE : RESOLVE,
          }
        }
      }
    }

    default: return state;
  }
}