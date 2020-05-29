import {Provider} from "react-redux";
import TodoList from "./components/todoList/TodoList";
import AddTodo from "./components/addTodo/AddTodo";
import React from "../../react/packages/react/src/React";
import TriggerStatus from "./components/triggerStatus/TriggerStatus";
import store from "./redux/store";

export default function ReduxView() {
  return (
    <div>
      <Provider store={store}>
        <TodoList/>
        <AddTodo/>
        <TriggerStatus/>
      </Provider>
    </div>
  );
}