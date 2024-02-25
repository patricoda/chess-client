import { memo } from "react";
import { Dialog } from "./dialog";

const NewUserDialog = ({ isVisible, handleSubmit }) => (
  <Dialog isVisible={isVisible}>
    <form onSubmit={handleSubmit}>
      <input
        id="name"
        type="text"
        placeholder="Please enter your name"
        name="name"
      />
      <button>submit</button>
    </form>
  </Dialog>
);

export default memo(NewUserDialog);
