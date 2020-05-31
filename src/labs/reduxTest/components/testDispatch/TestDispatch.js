import {connect} from "react-redux";
import React from "../../../../react/packages/react/src/React";
import {ReactReduxContext} from "react-redux";
import {useState} from "../../../../react/packages/react/src/ReactHooks";

function TestDispatch(props) {
  console.log('testDispatch')

  return (<div>
    TestDispatch
    <ReactReduxContext.Consumer>
      {(...args) => {
        console.log(args);
      }}
    </ReactReduxContext.Consumer>
    <div>{props.data.msg}</div>
  </div>);
}

export default connect(() => (state, ownerProps) => {
  return {
    msg: state.filter + ownerProps.data.msg
  };
}, null, null, {
  // pure代表着是一个纯组件，所以在内部进行修改数据渲染的时候不会再次渲染?
  // pure: true,
  // areStatesEqual: () => true,
  // areOwnPropsEqual: () => true,
  // areStatePropsEqual: () => true,
  // areMergedPropsEqual: () => true,
})(TestDispatch);

