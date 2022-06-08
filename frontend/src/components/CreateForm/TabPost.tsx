import React, { useState } from "react";

import { useFormData } from "../FormContext";
import Wysiwyg from "../Wysiwyg";

const TabPost = ({ defaultDescription = "" }) => {
  const [text, setText] = useState(defaultDescription);
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

export default TabPost;
