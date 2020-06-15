import "./CommentInput.scss"
import React from "../../../react/packages/react/src/React";
import {Card, Input, Button} from "antd";
import {useState} from "../../../react/packages/react/src/ReactHooks";

const {Textarea} = Input;

export default function CommentInput(props) {
  let [writeUserName, setWriteUserName] = useState('');
  let [comment, setComment] = useState('');

  return (
    <div className="comment-input-container">
      <Card>
        <Input value={writeUserName} onChange={(e) => {
          console.log(e);
          setWriteUserName()
        }}/>
        {/*<Textarea value={comment} onChange={(e) => {*/}
        {/*  setComment(e);*/}
        {/*}}/>*/}
        <Button onClick={() => {alert('我点击了')}}/>
      </Card>
    </div>
  );
}
