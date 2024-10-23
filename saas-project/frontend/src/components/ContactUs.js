import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Input,
  Textarea,
  Button,
  useToast,
  Container,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import axios from 'axios';

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Replace with your actual API endpoint
      await axios.post('https://161.35.218.169:5000/api/contact', { name, email, message });
      
      toast({
        title: 'Message sent!',
        description: "We've received your message and will get back to you soon.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Clear form
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      toast({
        title: 'An error occurred.',
        description: 'Unable to send your message. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="xl" mb={2}>Contact Us</Heading>
          <Text>We'd love to hear from you. Please fill out the form below.</Text>
        </Box>

        <Box as="form" onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Message</FormLabel>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your Message"
                rows={6}
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isSubmitting}
              loadingText="Submitting"
              width="full"
            >
              Send Message
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default ContactUs;