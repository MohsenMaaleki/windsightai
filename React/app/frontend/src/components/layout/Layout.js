// src/components/layout/Layout.js
import React from 'react';
import { Box, Container } from '@chakra-ui/react';
import { colors } from '../../theme/foundations/colors';
import Header from './Header';

export const Layout = ({ children }) => {
  return (
    <Box 
      minH="100vh" 
      bgGradient={colors.gradients.background}
      color="white"
    >
      <Header />
      <Container
        maxW="container.xl"
      >
        {children}
      </Container>
    </Box>
  );
};