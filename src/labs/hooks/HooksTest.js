import React from "react";
import {useEffect} from "../../react/packages/react/src/ReactHooks";

export function UseEffect(props) {
  useEffect(() => {
    console.log(props.msg);
    return () => {
      console.log('我是release')
    }
  }, [props.msg]);

  return (<div>
    {props.msg}
  </div>);
}