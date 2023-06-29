import { VStack, Box, Text, Spacer } from '@chakra-ui/react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { useUserStore } from '../store/user';
import React from 'react';

export type Message = {
  id: string;
  userId: string;
  username: string;
  content: string;
  tContent?: string;
  createTime: number;
};

export default function ChatPanel({ messages }: { messages: Message[] }) {
  const currentUser = useUserStore((state) => state.username);
  console.log(currentUser);
  return (
    <VStack spacing={4} width="100%">
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
            <Box
              display="flex"
              alignItems="flex-end"
              justifyContent={align}
              alignSelf={align}
              paddingX={4}
              paddingBottom={3}
            >
              <Box
                borderRadius="md"
                padding={4}
                backgroundColor={isCurrentUser ? 'green.50' : 'gray.100'}
              >
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  color="gray.500"
                  marginBottom={2}
                >
                  {format(date, 'MMM dd, yyyy hh:mm a')}
                </Text>
                <Text
                  fontSize="md"
                  color={isCurrentUser ? 'green.700' : 'gray.900'}
                >
                  {message.content}
                </Text>
                {message.tContent && (
                  <>
                    <Box
                      borderRadius="md"
                      padding={4}
                      backgroundColor={isCurrentUser ? 'green.50' : 'gray.100'}
                    >
                      <Text
                        fontSize="md"
                        color={isCurrentUser ? 'green.700' : 'gray.900'}
                        style={{ fontStyle: 'italic' }}
                      >
                        {message.tContent}
                      </Text>
                    </Box>
                  </>
                )}
              </Box>
            </Box>
          </motion.div>
        );
      })}
    </VStack>
  );
}
