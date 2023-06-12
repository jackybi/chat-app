import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  VStack,
  HStack,
  Spinner,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useUserStore } from './store/user';

const Auth = () => {
  const { login, register } = useUserStore((state) => ({
    login: state.login,
    register: state.register,
  }));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [processing, setProcessing] = useState(false);

  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async () => {
    setProcessing(true);
    setError(null);
    try {
      await register(username, password);
      setProcessing(false);
      setRegistered(true);
    } catch (error: any) {
      setError(error.message);
      setProcessing(false);
    }
  };

  const handleLogin = async () => {
    setError(null);
    try {
      setProcessing(true);
      await login(username, password);
      setProcessing(false);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <Box
      w={['100%', '400px', '400px']}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p="6"
      m="auto"
    >
      <Stack spacing="2">
        <FormLabel>Username</FormLabel>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <FormLabel>Password</FormLabel>
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle mr={2}>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <HStack spacing="2">
          {processing ? (
            <Spinner size="sm" />
          ) : (
            <>
              {!registered && (
                <Button
                  colorScheme="green"
                  width="50%"
                  isDisabled={!username || !password}
                  onClick={() => {
                    handleRegister();
                  }}
                >
                  Register
                </Button>
              )}

              <Button
                colorScheme="blue"
                width="50%"
                isDisabled={!username || !password}
                onClick={() => {
                  handleLogin();
                }}
              >
                Login
              </Button>
            </>
          )}
        </HStack>
      </Stack>
    </Box>
  );
};

export default Auth;
