import "./CommentApp.scss"
import React from "../../react/packages/react/src/React";
import CommentList from "./commentList/CommentList";
import CommentInput from "./commentInput/CommentInput";

export default function CommentApp(props) {
  return (
    <div className="input-container">
      <CommentInput/>
      <CommentList/>
    </div>
  );
}
