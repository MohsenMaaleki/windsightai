import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Flex, Heading, Button, Container, Text } from '@chakra-ui/react';
import { useUser } from '../../context/UserContext';

const Header = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box bg="brand.600" boxShadow="lg">
      <Container maxW="container.xl">
        <Flex py={4} justify="space-between" align="center">
          <Heading
            as={RouterLink}
            to="/"
            size="lg"
            fontWeight="extrabold"
            letterSpacing="wider"
            display="flex"
            _hover={{ 
              transform: 'scale(1.05)',
              transition: 'transform 0.2s ease-in-out'
            }}
          >
            <Text color="#7FFFD4">Wind</Text>
            <Text color="#87CEEB">Sight</Text>
            <Text color="#FFFFFF">AI</Text>
          </Heading>
          <Flex align="center" gap={4}>
            <Button
              as={RouterLink}
              to="/contact"
              variant="ghost"
              color="white"
              bg="brand.500"
              _hover={{ bg: 'brand.400' }}
            >
              Contact Us
            </Button>
            {user ? (
              <>
                <Button
                  as={RouterLink}
                  to="/dashboard"
                  variant="solid"
                  bg="white"
                  color="brand.600"
                  _hover={{ bg: 'gray.100' }}
                >
                  Dashboard
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  color="white"
                  borderColor="white"
                  _hover={{ bg: 'brand.500' }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  as={RouterLink}
                  to="/login"
                  variant="ghost"
                  bg="brand.500"
                  color="white"
                  _hover={{ bg: 'brand.400' }}
                >
                  Login
                </Button>
                <Button
                  as={RouterLink}
                  to="/register"
                  variant="solid"
                  bg="white"
                  color="brand.600"
                  _hover={{ bg: 'gray.100' }}
                >
                  Register
                </Button>
              </>
            )}
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default Header;