import React from 'react';
import { ChakraProvider, Flex } from '@chakra-ui/react';
import { useUserStore } from './store/user';
import Auth from './Auth';
import Chat from './Chat';
import theme from './theme';

function App() {
  const username = useUserStore((state) => state.username);
  return (
    <ChakraProvider theme={theme}>
      <Flex w="100%" h="100vh">
        {!username && <Auth />}
        {username && <Chat />}
      </Flex>
    </ChakraProvider>
  );
}

export default App;
