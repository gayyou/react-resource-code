import React from 'react';
import {ThemeContext} from './theme';

export default class Button extends React.Component {
  static contextType = ThemeContext;

  render() {
    return (<div>{this.context.theme}
      <button onClick={this.context.triggerTheme}>切换</button>
    </div>)
  }
}
