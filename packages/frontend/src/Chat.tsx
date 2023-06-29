import React, { useMemo } from 'react';
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import io from 'socket.io-client';
import { useUserStore } from './store/user';
import userAxios from './axios/user';
import { keyBy } from 'lodash-es';
import ChatPanel, { Message } from './components/ChatPanel';

function Chat() {
  console.log('render Chat');
  const [isConnected, setIsConnected] = useState(false);
  const username = useUserStore((state) => state.username);
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
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageDicts, setMessageDicts] = useState<{
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
        setMessages((messages) => [messageData, ...messages]);
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

  const handleSendMessage = (event: any) => {
    event.preventDefault();
    if (!socket) {
      return;
    }
    // Send message to the server
    socket.emit('groupTranslateEnMessage', {
      content: message,
    });

    // Clear the message input field
    setMessage('');
  };

  return (
    <Box w="80%" mx="auto" my="5rem" borderWidth="1px" p="1rem">
      <Stack spacing={3}>
        <FormControl>
          <FormLabel>Message</FormLabel>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            isRequired
          />
        </FormControl>
        <Button type="submit" colorScheme="blue" onClick={handleSendMessage}>
          Send
        </Button>
        <ChatPanel messages={messages} />
      </Stack>
    </Box>
  );
}

export default Chat;
