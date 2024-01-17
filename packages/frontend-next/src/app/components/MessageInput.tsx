import React, { useCallback, useState } from 'react';
import { Socket } from 'socket.io-client';
import Send from '@/icons/send.svg';
import Image from 'next/image';
const MessageInput: React.FC<{ socket: Socket | null }> = ({ socket }) => {
  const [message, setMessage] = useState('');
  const [, setError] = useState<string | null>(null);
  const handleSendMessage = useCallback(
    (message: string) => {
      if (!socket) {
        setError('Cannot connect to the server.');
        return;
      }
      console.log('message:', message);
      if (message.length === 0) return;
      // Send message to the server
      setError(null);
      socket.emit('groupTranslateEnMessage', {
        content: message,
      });

      // Clear the message input field
      setMessage('');
    },
    [socket],
  );

  return (
    <div className="static bottom-0 flex flex-row items-center gap-4 border-t border-solid border-slate-300 p-5">
      <input
        className="h-[46px] rounded-xl"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        placeholder="Write your message"
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            handleSendMessage(message);
          }
        }}
      />
      <button
        className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={() => handleSendMessage(message)}
      >
        <div className="w-[46px]">
          <Image src={Send} alt="send" />
        </div>
      </button>
    </div>
  );
};

export default MessageInput;
