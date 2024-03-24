import { memo } from "react";

const ButtonHolder = ({ children, className = "", ...props }) => (
  <div className={`button-holder ${className}`} {...props}>
    {children}
  </div>
);

export default memo(ButtonHolder);
