import { useState } from "react";

export const ChatRoom = ({ messageHistory, handleMessageSubmit }) => {
  const [message, setMessage] = useState("");

  return (
    <>
      <ul>
        {messageHistory.map((message) => (
          <li>{message}</li>
        ))}
      </ul>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleMessageSubmit(message);
        }}
      >
        <input
          type="text"
          name="message"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" value="Send" />
      </form>
    </>
  );
};

export default ChatRoom;
