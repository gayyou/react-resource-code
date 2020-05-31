import React from 'react';
import './App.css';
import {ThemeContext} from "./labs/context/theme";
import Button from "./labs/context/Button";
import UseContext from "./labs/context/UseContext";
import {UseEffect} from "./labs/hooks/HooksTest";
import {useState} from "./react/packages/react/src/ReactHooks";
import ReduxView from "./labs/reduxTest/ReduxView";

function App() {
  return (
    <div>
      <ReduxView/>
    </div>
  );
}

export function Sub() {
  return (<div>我是子容器</div>)
}

class Sub2 extends React.Component {
  constructor() {
    super();
    this.state = {
      isCount: false
    }
    setTimeout(() => {
      this.setState({
        isCount: true
      });
      this.setState({
        isCount: false
      });
    }, 1000);
  }
  render() {
    return (
      <div>123{this.state.isCount}</div>
    );
  }
}

export default App;
