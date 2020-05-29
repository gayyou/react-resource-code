import {connect} from "react-redux";
import {useState} from "../../../../react/packages/react/src/ReactHooks";
import {addTodo} from "../../redux/actions";
import React from "../../../../react/packages/react/src/React";

function AddTodo({addTodo}) {
  let [value, setValue] = useState('')

  return (
    <div>
      <input value={value} onChange={(event) => setValue(event.target.value)}/>
      <button onClick={() => addTodo(value)}>add todo</button>
    </div>
  );
}

export default connect(null, {addTodo})(AddTodo);