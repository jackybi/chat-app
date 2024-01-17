'use client';

import useAuth from '@/hooks/useAuth';
import Image from 'next/image';
import ChatPanel, { Message } from './components/ChatPanel';
import MessageInput from './components/MessageInput';
import { useUserStore } from '@/store/user';
import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import userAxios from '@/axios/user';
import { keyBy } from 'lodash-es';

export default function Home() {
  useAuth();

  const [, setIsConnected] = useState(false);
  const authToken = useUserStore((state) => state.authToken);
  const socket = useMemo(() => {
    if (authToken) {
      return io(process.env.NEXT_PUBLIC_BACKEND_URL, {
        autoConnect: false,
        query: {
          token: authToken,
        },
      });
    }
    return null;
  }, [authToken]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [, setMessageDicts] = useState<{
    [key: string]: Message;
  }>({});

  useEffect(() => {
    if (socket) {
      socket.connect();
    }
    return () => {
      if (socket) socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    userAxios
      .get('/translate-message/latest', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((res) => {
        if (res.data.data) {
          setMessages(
            res.data.data.map((message: any) => ({
              id: message.id,
              userId: message.userId,
              username: message.username,
              content: message.content,
              tContent: message.tContent,
              createTime: message.createTime,
            })),
          );
          setMessageDicts(keyBy(res.data.data, 'id'));
        }
      })
      .catch((e) => console.log(e));
  }, [authToken]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('groupTranslateMessage', (data: any) => {
      if (data.data.tContent) {
        setMessageDicts((prev) => {
          if (prev[data.data.id])
            prev[data.data.id].tContent = data.data.tContent;
          return { ...prev };
        });
      }
      if (data.data.content) {
        const messageData = { ...data.data };
        setMessages((messages) => [...messages, messageData]);
        setMessageDicts((prev) => {
          return { ...prev, [data.data.id]: messageData };
        });
      }
    });

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('groupTranslateMessage');
    };
  }, [socket]);

  return (
    <div className="flex h-dvh w-full flex-col">
      <ChatPanel messages={messages} />
      <MessageInput socket={socket} />
    </div>
  );
}
