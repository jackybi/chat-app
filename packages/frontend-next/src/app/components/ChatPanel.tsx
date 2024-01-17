import { useUserStore } from '@/store/user';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import cx from 'classNames';

export type Message = {
  id: string;
  userId: string;
  username: string;
  content: string;
  tContent?: string;
  createTime: number;
};

const Message: React.FC<{
  isSelf: boolean;
  message: { content: string; tContent?: string };
  date: Date;
  username?: string;
}> = ({ message, date, isSelf, username }) => {
  return (
    <div className="flex flex-col">
      {!isSelf && (
        <p className="text-3xl font-semibold text-black">{username}</p>
      )}
      <div
        className={cx('mt-8 rounded-s-xl rounded-tr-xl p-12', {
          'bg-green-600 ps-14': isSelf,
          'bg-zinc-300 pe-14': !isSelf,
        })}
      >
        <p
          className={cx('mb-1 text-base font-medium', {
            'text-white': isSelf,
            'text-black': !isSelf,
          })}
        >
          {message.content}
        </p>
        {message.tContent && (
          <>
            <div
              className={cx('border border-solid border-black p-2', {
                'boder-white': isSelf,
              })}
            >
              <p
                className={cx('font-italic text-sm text-black', {
                  'text-white': isSelf,
                })}
              >
                {message.tContent}
              </p>
            </div>
          </>
        )}
      </div>
      <p className="mb-7 mt-1 place-self-end text-xs font-medium text-slate-500 ">
        {format(date, 'MMM dd, yyyy hh:mm a')}
      </p>
    </div>
  );
};

export default function ChatPanel({ messages }: { messages: Message[] }) {
  const currentUser = useUserStore((state) => state.username);
  const panelRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState<boolean>(true);
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    // If it is, scroll to the bottom
    if (isAtBottom) {
      panel.scrollTop = panel.scrollHeight - panel.clientHeight;
    }
  }, [isAtBottom, messages]);

  const scrollHandler = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return;
    setIsAtBottom(
      panel.scrollHeight - panel.clientHeight <= panel.scrollTop + 1,
    );
  }, []);

  return (
    <div
      className="w-full shrink grow overflow-y-auto overflow-x-hidden"
      ref={panelRef}
      onScroll={scrollHandler}
    >
      {messages.map((message) => {
        const isCurrentUser = message.username === currentUser;
        const align = isCurrentUser ? 'flex-end' : 'flex-start';
        const date = new Date(message.createTime);

        const variants = {
          visible: { opacity: 1, x: 0 },
          hidden: { opacity: 0, x: isCurrentUser ? '100%' : '-100%' },
        };

        return (
          <motion.div
            key={message.id}
            variants={variants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.3 }}
            style={{ width: '100%' }}
          >
            <div
              className={cx('flex w-full flex-row items-center px-4 pb-3', {
                'justify-end self-end': isCurrentUser,
                'justify-start self-start': !isCurrentUser,
              })}
            >
              <Message
                username={message.username}
                isSelf={isCurrentUser}
                date={date}
                message={message}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
