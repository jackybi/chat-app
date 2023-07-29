import React, { useCallback, useState } from 'react';
import {
  Box,
  BoxProps,
  Button,
  Flex,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  Kbd,
} from '@chakra-ui/react';
import { useUserStore } from '../store/user';
import { Socket } from 'socket.io-client';
import { ReactComponent as Send } from '../icons/send.svg';
const MessageInput: React.FC<{ socket: Socket | null } & BoxProps> = ({
  socket,
  ...boxProps
}) => {
  const authToken = useUserStore((state) => state.authToken);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const handleSendMessage = useCallback((message: string) => {
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
  }, []);
  return (
    <Flex
      flexDir={'row'}
      alignItems={'center'}
      {...boxProps}
      p={'20px'}
      gap="16px"
      borderTop={'1px solid #EEFAF8'}
    >
      <Input
        variant={'filled'}
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        placeholder="Write your message"
        height="46px"
        borderRadius={'12px'}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            handleSendMessage(message);
          }
        }}
      />
      <Button
        minWidth="46px"
        height="46px"
        flex="1 1"
        p="0px"
        backgroundColor="#20A090"
        borderRadius={'24px'}
        colorScheme="blue"
        onClick={() => handleSendMessage(message)}
      >
        <Box width="46px">
          <Send />
        </Box>
      </Button>
    </Flex>
  );
};

export default MessageInput;
