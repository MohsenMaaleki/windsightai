import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Box, VStack, Heading, Input, Button, useToast, Text } from '@chakra-ui/react';
import { useUser } from '../UserContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { login } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      var hashedPassword = await bcrypt.hash(password, 10);
      const response = await axios.post('http://161.35.218.169:5000/api/login', 
        { username, hashedPassword },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      const userData = { username, id: response.data.user_id };
      login(userData);
      localStorage.setItem('userId', response.data.user_id);
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/dashboard');
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: 'Login failed',
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
      <Heading mb={5}>Login</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            isRequired
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isRequired
          />
          <Button 
            type="submit" 
            colorScheme="blue" 
            width="full"
            isLoading={isLoading}
            loadingText="Logging in"
          >
            Login
          </Button>
        </VStack>
      </form>
      <Text mt={4} textAlign="center">
        Don't have an account? <Link to="/register" style={{ color: 'blue' }}>Register here</Link>
      </Text>
    </Box>
  );
};

export default Login;