import {useContext} from "../../react/packages/react/src/ReactHooks";
import {ThemeContext} from "./theme";
import React from "../../react/packages/react/src/React";

export default function UseContext(props) {
  let theme = useContext(ThemeContext);

  return (<div>{theme.theme}</div>);
}