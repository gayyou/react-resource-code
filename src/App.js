import React from 'react';
import './App.css';
import {ThemeContext} from "./labs/context/theme";
import Button from "./labs/context/Button";

function App() {
  return (
    <div>
      <ThemeContext.Provider value={{theme: '#red', triggerTheme: () => {console.log('我是切换主题的函数')}}}>
        <Button/>
      </ThemeContext.Provider>
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
