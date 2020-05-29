import {connect} from "react-redux";
import {showAllTodo, showResolvedTodo, showUnResolveTodo} from "../../redux/actions";
import React from "../../../../react/packages/react/src/React";

function TriggerStatus({showAllTodo, showUnResolveTodo, showResolvedTodo}) {
  return (
    <div>
      <button onClick={showAllTodo}>all</button>
      <button onClick={showUnResolveTodo}>unResolved</button>
      <button onClick={showResolvedTodo}>resolved</button>
    </div>
  );
}

function mapStateFilterToProps(state) {
  return {status: state.filter}
}

export default connect(mapStateFilterToProps, {showAllTodo, showUnResolveTodo, showResolvedTodo})(TriggerStatus);