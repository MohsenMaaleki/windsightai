import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, VStack, Heading, Input, Button, useToast, Text } from '@chakra-ui/react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('http://161.35.218.169:5000/api/register', { username, email, password });
      toast({
        title: 'Registration successful',
        description: 'You can now log in with your new account.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      toast({
        title: 'Registration failed',
        description: error.response?.data?.error || 'An unexpected error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10}>
      <Heading mb={5}>Register</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={3}>
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            isRequired
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isRequired
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isRequired
          />
          <Text fontSize="sm" color="gray.600">
            Password must contain at least one letter, one number, one special character (@$!%*#?&), and be at least 8 characters long.
          </Text>
          <Button 
            type="submit" 
            colorScheme="blue" 
            width="full"
            isLoading={isLoading}
            loadingText="Registering"
          >
            Register
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default Register;
