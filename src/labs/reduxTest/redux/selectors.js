import {ALL} from "./TODO_TYPE";

export const getTodoListByFilter = (state) => {
  let {itemMapById, allId} = state.todoList;
  let {filter} = state;
  let list = [];

  for (let id of allId) {
    let item = itemMapById[id];
    console.log(item.status, filter);

    if (item.status === filter || filter === ALL) {
      list.push({
        id,
        ...item
      });
    }
  }

  return list;
}