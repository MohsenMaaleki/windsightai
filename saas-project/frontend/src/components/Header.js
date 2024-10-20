import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Flex, Heading, Button } from '@chakra-ui/react';

const Header = () => {
  return (
    <Box bg="blue.500" px={4} py={2}>
      <Flex justify="space-between" align="center">
        <Heading as={RouterLink} to="/" color="white" size="lg">
          YourSaaS
        </Heading>
        <Box>
          <Button as={RouterLink} to="/login" variant="ghost" color="white" mr={2}>
            Login
          </Button>
          <Button as={RouterLink} to="/register" variant="ghost" color="white">
            Register
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default Header;