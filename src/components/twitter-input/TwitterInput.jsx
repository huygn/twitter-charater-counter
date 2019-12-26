import React from "react";
import { Editor, EditorState, CompositeDecorator } from "draft-js";
import Counter from "./components/counter";
import Button from "../../ui/button";

import "draft-js/dist/Draft.css";
import styles from "./TwitterInput.module.scss";

const MAX_COUNT = 50;

function overTypedStrategy(contentBlock, callback, contentState) {
  const contentLength = contentState.getPlainText().length;
  if (contentLength <= MAX_COUNT) return;

  const blockLength = contentBlock.getText().length;
  const diff = contentLength - blockLength;

  if (diff === -1) {
    callback(MAX_COUNT, blockLength);
  } else {
    callback(0, blockLength);
  }
}

function OverTypedSpan(props) {
  return (
    <span className={styles.overTyped} data-offset-key={props.offsetKey}>
      {props.children}
    </span>
  );
}

const compositeDecorator = new CompositeDecorator([
  {
    strategy: overTypedStrategy,
    component: OverTypedSpan
  }
]);

function TwitterInput() {
  const editorRef = React.useRef(null);

  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty(compositeDecorator)
  );
  const [state, setState] = React.useState({ count: 0, value: "" });

  const onEditorChangeHandler = React.useCallback(currentEditorState => {
    setEditorState(currentEditorState);
  }, []);
  
  React.useEffect(() => {
    const rawValue = editorState.getCurrentContent().getPlainText();
    setState({ count: rawValue.length, value: rawValue });
  }, [editorState])

  const tweetBtnClickHandler = React.useCallback(() => alert(state.value), [
    state.value
  ]);

  React.useEffect(() => editorRef.current.focus(), []);

  return (
    <div className={styles.root}>
      <Editor
        ref={editorRef}
        editorState={editorState}
        onChange={onEditorChangeHandler}
        placeholder="What's happening?"
      />

      <div className={styles.handler}>
        <Counter maxCount={MAX_COUNT} count={state.count} />
        <Button
          className={styles.button}
          onClick={tweetBtnClickHandler}
          name="Tweet"
        />
      </div>
    </div>
  );
}

export default TwitterInput;
