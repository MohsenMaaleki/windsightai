import React from 'react';
import { Box } from '@chakra-ui/react';

export const Card = ({ children, ...props }) => {
  return (
    <Box
      p={6}
      borderRadius="xl"
      borderWidth="1px"
      borderColor="whiteAlpha.200"
      backgroundColor="rgba(255, 255, 255, 0.1)"
      backdropFilter="blur(10px)"
      boxShadow="xl"
      transition="all 0.2s"
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: '2xl',
      }}
      {...props}
    >
      {children}
    </Box>
  );
};