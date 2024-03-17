import { memo } from "react";

const Button = ({ type = "button", children, ...props }) => (
  <button className="button" type={type} {...props}>
    {children}
  </button>
);

export default memo(Button);
