import { memo } from "react";

const WidgetContainer = ({ children, className = "", ...props }) => (
  <div className={`widget-container ${className}`} {...props}>
    {children}
  </div>
);

export default memo(WidgetContainer);
