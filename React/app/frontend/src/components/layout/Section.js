import React from 'react';
import { Box } from '@chakra-ui/react';

export const Section = ({ children, ...props }) => (
  <Box
    as="section"
    py={{ base: 8, md: 12, lg: 16 }}
    {...props}
  >
    {children}
  </Box>
); 