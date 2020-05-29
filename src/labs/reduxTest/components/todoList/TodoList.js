import {getTodoListByFilter} from "../../redux/selectors";
import {connect} from "react-redux";
import {RESOLVE} from "../../redux/TODO_TYPE";
import React from "../../../../react/packages/react/src/React";
import {triggerTodo} from "../../redux/actions";

function TodoList(props) {
  let {todoList, triggerTodo} = props;
  return (<div className="todo-list-container">
    {todoList && todoList.length && todoList.map(item => (
      <div className="todo-item"
        onClick={() => triggerTodo(item.id)}
      >
        状态：{item.status === RESOLVE ? '完成' : '未完成'}
        内容：{item.content}
      </div>
    ))}
  </div>);
}

function mapTodoToProp(state) {
  const todoList = getTodoListByFilter(state);
  console.log(todoList);

  return {
    todoList
  }
}

export default connect(mapTodoToProp, {triggerTodo})(TodoList);