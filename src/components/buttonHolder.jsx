import classNames from "classnames";
import { memo } from "react";

const ButtonHolder = ({ children, className, ...props }) => (
  <div className={classNames("button-holder", className)} {...props}>
    {children}
  </div>
);

export default memo(ButtonHolder);
