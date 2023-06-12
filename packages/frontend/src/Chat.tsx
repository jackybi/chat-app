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

function Chat() {
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
  const [messages, setMessages] = useState<
    { userId: string; content: string }[]
  >([]);

  useEffect(() => {
    if (socket) {
      socket.connect();
    }
    return () => {
      if (socket) socket.disconnect();
    };
  }, [socket]);

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
    socket.on('groupAllMessage', (data: any) => {
      console.log(data);
      setMessages((messages) => [...messages, data.data]);
    });

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('groupAllMessage');
    };
  }, []);

  const handleSendMessage = (event: any) => {
    event.preventDefault();
    if (!socket) {
      return;
    }
    // Send message to the server
    socket.emit('groupAllMessage', {
      _id: 1,
      userId: username,
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
        <VStack align="flex-start" spacing={2}>
          {messages.map((msg, index) => (
            <Box key={index} borderWidth="1px" p="1rem">
              <strong>{msg.userId}:</strong> {msg.content}
            </Box>
          ))}
        </VStack>
      </Stack>
    </Box>
  );
}

export default Chat;
