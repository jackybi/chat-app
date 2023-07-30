import React, { useMemo } from 'react';
import { useState, useEffect } from 'react';
import { Flex } from '@chakra-ui/react';
import io from 'socket.io-client';
import { useUserStore } from './store/user';
import userAxios from './axios/user';
import { keyBy } from 'lodash-es';
import ChatPanel, { Message } from './components/ChatPanel';
import MessageInput from './components/MessageInput';

function Chat() {
  const [, setIsConnected] = useState(false);
  const authToken = useUserStore((state) => state.authToken);
  const socket = useMemo(() => {
    if (authToken) {
      return io('http://localhost:3000', {
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
            }))
          );
          setMessageDicts(keyBy(res.data.data, 'id'));
        }
      })
      .catch((e) => console.log(e));
  }, []);

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
  }, []);

  return (
    <Flex w="100%" h="100vh" flexDir="column">
      <ChatPanel messages={messages} />
      <MessageInput socket={socket} position={'static'} bottom={'0px'} />
    </Flex>
  );
}

export default Chat;
