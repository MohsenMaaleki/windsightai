import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, VStack, Heading, Input, Button, useToast } from '@chakra-ui/react';
import SHA256 from 'crypto-js/sha256';

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

    // Ensure password is not empty before hashing
    if (!password) {
      toast({
        title: 'Error',
        description: 'Password is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    try {
      const hashedPassword = SHA256(password).toString();
      const response = await axios.post(
        'https://161.35.218.169:5000/api/register', 
        { 
          username, 
          email, 
          hashedPassword 
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        }
      );

      if (response.data) {
        toast({
          title: 'Registration successful',
          description: 'You can now log in with your new account.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      let errorMessage = 'An unexpected error occurred';

      if (error.response) {
        // Server responded with an error
        errorMessage = error.response.data?.error || 'Registration failed';
      } else if (error.request) {
        // Request was made but no response
        errorMessage = 'Unable to reach the server. Please check your connection and try again.';
      } else {
        // Error in request setup
        errorMessage = 'Error setting up the request. Please try again.';
      }

      toast({
        title: 'Registration failed',
        description: errorMessage,
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
            minLength={3}
            maxLength={50}
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
            minLength={6}
          />
          <Button 
            type="submit" 
            colorScheme="blue" 
            width="full"
            isLoading={isLoading}
            loadingText="Registering"
            disabled={!username || !email || !password}
          >
            Register
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default Register;