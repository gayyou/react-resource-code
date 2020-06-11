import React from '../../react/packages/react/index'
import {Router, HashRouter, Route, Switch} from "react-router-dom";
import CommentApp from "../comment/CommentApp";
import "antd/dist/antd.less"

export default function ReactRouter(props) {
  console.log(props);
  return (
    <HashRouter>
      <Switch>
        <Route path='/' component={CommentApp}/>
      </Switch>
    </HashRouter>
  );
}
