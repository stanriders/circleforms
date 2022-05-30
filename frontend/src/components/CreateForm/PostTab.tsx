import React, { useState } from "react";

import { useFormData } from "../FormContext";
import Wysiwyg from "../Wysiwyg";

const PostTab = () => {
  const [text, setText] = useState("");
  const { setValues } = useFormData();

  return (
    <Wysiwyg
      placeholder="Write post description here"
      value={text}
      onTextAreaChange={setText}
      onBlur={() => setValues({ description: text })}
      name={"postDescription"}
    />
  );
};

export default PostTab;
