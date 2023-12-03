import { memo } from "react";
import { Dialog } from "./dialog";

export const ErrorDialog = ({ isVisible, children }) => (
  <Dialog isVisible={isVisible}>
    <p>An error has occurred:</p>
    {children}
  </Dialog>
);

export default memo(ErrorDialog);
