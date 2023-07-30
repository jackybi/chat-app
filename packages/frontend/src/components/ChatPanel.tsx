import { Box, Text, Flex } from '@chakra-ui/react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { useUserStore } from '../store/user';
import React, { useCallback, useEffect, useRef, useState } from 'react';

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
    <Flex flexDir="column">
      {!isSelf && (
        <Text fontSize="14px" color={'black'}>
          {username}
        </Text>
      )}
      <Box
        borderRadius="0 12px 12px 12px"
        marginTop={'8px'}
        padding={isSelf ? '12px 12px 12px 14px' : '12px 14px 12px'}
        backgroundColor={isSelf ? '#20A090' : '#F2F7FB'}
      >
        <Text
          fontSize="16px"
          fontWeight="500"
          color={isSelf ? 'white' : 'black'}
          mb={1}
        >
          {message.content}
        </Text>
        {message.tContent && (
          <>
            <Box
              padding={2}
              borderTop={`1px solid ${isSelf ? 'white' : 'black'}`}
            >
              <Text
                fontSize="14px"
                letterSpacing={'0.12px'}
                color={isSelf ? 'white' : 'black'}
                style={{ fontStyle: 'italic' }}
              >
                {message.tContent}
              </Text>
            </Box>
          </>
        )}
      </Box>
      <Text
        fontSize="10px"
        fontWeight="medium"
        color="gray.500"
        marginTop={'4px'}
        marginBottom={'30px'}
        placeSelf={'flex-end'}
      >
        {format(date, 'MMM dd, yyyy hh:mm a')}
      </Text>
    </Flex>
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
  }, [messages]);

  const scrollHandler = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return;
    setIsAtBottom(
      panel.scrollHeight - panel.clientHeight <= panel.scrollTop + 1
    );
  }, [panelRef.current]);

  return (
    <Flex
      ref={panelRef}
      width="100%"
      overflowY="auto"
      overflowX="hidden"
      flex="1 1"
      flexDir="column"
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
            <Flex
              alignItems="flex-end"
              justifyContent={align}
              alignSelf={align}
              paddingX={4}
              paddingBottom={3}
            >
              <Message
                username={message.username}
                isSelf={isCurrentUser}
                date={date}
                message={message}
              />
            </Flex>
          </motion.div>
        );
      })}
    </Flex>
  );
}
