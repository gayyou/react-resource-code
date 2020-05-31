import {ALL} from "./TODO_TYPE";
import {createSelector} from 'reselect'

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

let state = {
  a: 'weybn',
  b: {
    name: 'weybn-b'
  }
};

const selectA = (state) => state.a;

// 这个东西仅仅是一个shallow strong type check
const selectA1 = createSelector(selectA, (a) => {
  console.log('更新a' + a);
  return a;
})
console.log(1111);
selectA1(state);
state.a = 'weybn2';
setTimeout(() => {
  selectA1({a: 'weybn2132132132'});
}, 100);

