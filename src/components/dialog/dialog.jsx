import { memo } from "react";
import { useEffect, useRef } from "react";

export const Dialog = ({ isVisible, children }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [isVisible]);

  return <dialog ref={dialogRef}>{children}</dialog>;
};

export default memo(Dialog);
