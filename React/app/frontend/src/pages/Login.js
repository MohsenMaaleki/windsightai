// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  VStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Link,
  useColorModeValue,
  useColorMode,
  FormErrorMessage,
  useToast,
  Input as ChakraInput,
} from '@chakra-ui/react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import SHA256 from 'crypto-js/sha256';
import { useUser } from '../context/UserContext';
import { forwardRef } from 'react';

export const Input = forwardRef((props, ref) => {
  const { colorMode } = useColorMode();
  const placeholderColor = useColorModeValue('gray.400', 'gray.500');
  const bgColor = colorMode === 'light' ? 'white' : 'gray.700';
  const textColor = colorMode === 'light' ? 'gray.800' : 'white';

  return (
    <ChakraInput
      ref={ref}
      bg={bgColor}
      color={textColor}
      _placeholder={{ color: placeholderColor }}
      borderColor="brand.200"
      _hover={{ borderColor: 'brand.300' }}
      _focus={{ borderColor: 'brand.500', boxShadow: 'none' }}
      {...props}
    />
  );
});

Input.displayName = 'Input';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const toast = useToast();
  const { login } = useUser();
  
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const subtitleColor = useColorModeValue('gray.600', 'gray.400');
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  const validateForm = () => {
    const newErrors = {};
    if (!username) newErrors.username = 'Username is required';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const hashedPassword = SHA256(password).toString();
      const response = await axios.post('/api/login', 
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
      
      toast({
        title: 'Welcome back!',
        description: 'Login successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'An unexpected error occurred';
      toast({
        title: 'Login failed',
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
    <Container 
      maxW="md" 
      py={{ base: 8, md: 16 }}
      px={{ base: 4, md: 0 }}
      minH="calc(100vh - 64px)"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <Card p={8} className="card-glass">
        <VStack spacing={6} align="stretch">
          <VStack spacing={2} align="center">
            <Heading size="xl" className="gradient-text">Welcome Back</Heading>
            <Text className="feature-description">
              Sign in to access your WindSightAI dashboard
            </Text>
          </VStack>
          
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isInvalid={errors.username}>
                <FormLabel color={textColor}>Username</FormLabel>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                />
                <FormErrorMessage>{errors.username}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.password}>
                <FormLabel color={textColor}>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                variant="primary"
                width="full"
                size="lg"
                isLoading={isLoading}
                loadingText="Signing in"
              >
                Sign In
              </Button>
            </VStack>
          </form>

          <Text textAlign="center" className="feature-description">
            Don't have an account?{' '}
            <Link
              as={RouterLink}
              to="/register"
              color="green.400"
              fontWeight="medium"
              _hover={{ 
                color: 'green.500',
                textDecoration: 'underline'
              }}
            >
              Register here
            </Link>
          </Text>
        </VStack>
      </Card>
    </Container>
  );
};

export default Login;