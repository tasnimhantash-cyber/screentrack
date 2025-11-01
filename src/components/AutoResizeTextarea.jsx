import React, { useEffect, useRef } from "react";

function AutoResizeTextarea({ value, onChange, placeholder }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        resize: "none",
        overflow: "hidden",
        width: "100%",
        minHeight: "60px",
        padding: "8px",
        borderRadius: "8px",
        border: "1px solid #ccc",
      }}
    />
  );
}

export default AutoResizeTextarea;

