import React from 'react';
import logo from './logo.svg';
import './App.css';
import invariant from "./react/packages/shared/invariant";

function App() {
  return (
    <div>
      <div>我是父亲容器</div>
      <Sub/>
      <Sub2/>
    </div>

    // <div className="App">

      // {/*<header className="App-header">*/}
      // {/*  <img src={logo} className="App-logo" alt="logo" />*/}
      // {/*  <p>*/}
      // {/*    Edit <code>src/App.js</code> and save to reload.*/}
      // {/*  </p>*/}
      // {/*  <a*/}
      // {/*    className="App-link"*/}
      // {/*    href="https://reactjs.org"*/}
      // {/*    target="_blank"*/}
      // {/*    rel="noopener noreferrer"*/}
      // {/*  >*/}
      // {/*    Learn React*/}
      // {/*  </a>*/}
      // {/*</header>*/}
    // </div>
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
