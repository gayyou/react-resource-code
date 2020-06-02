import {Provider} from "react-redux";
import TodoList from "./components/todoList/TodoList";
import AddTodo from "./components/addTodo/AddTodo";
import React from "../../react/packages/react/src/React";
import TriggerStatus from "./components/triggerStatus/TriggerStatus";
import store from "./redux/store";
import TestDispatch from "./components/testDispatch/TestDispatch";
import {useState} from "../../react/packages/react/src/ReactHooks";

let isTimeout = false;

export default function ReduxView() {
  let [name, setName] = useState({
    msg: 'weybn'
  });

  if (!isTimeout) {
    isTimeout = true;
    setTimeout(() => {
      setName('wey2bn');
    }, 5000)
  }

  return (
    <div>
      <Provider store={store}>
        <TodoList name={name}/>
        <AddTodo/>
        <TriggerStatus/>
        <TestDispatch data={name} />
      </Provider>
    </div>
  );
}
