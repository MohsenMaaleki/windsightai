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
  Select,
} from '@chakra-ui/react';
import axios from 'axios';

const RequestDemo = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [message, setMessage] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Replace with your actual API endpoint
      await axios.post('https://windsightai.com:5000/api/request-demo', { 
        name, 
        email, 
        company, 
        jobTitle, 
        companySize, 
        message 
      });
      
      toast({
        title: 'Demo request sent!',
        description: "We've received your request and will contact you soon to schedule a demo.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Clear form
      setName('');
      setEmail('');
      setCompany('');
      setJobTitle('');
      setCompanySize('');
      setMessage('');
    } catch (error) {
      toast({
        title: 'An error occurred.',
        description: 'Unable to send your demo request. Please try again later.',
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
          <Heading as="h1" size="xl" mb={2}>Request a Demo</Heading>
          <Text>Interested in seeing WindSightAI in action? Fill out the form below to request a demo.</Text>
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
              <FormLabel>Company</FormLabel>
              <Input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Your Company"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Job Title</FormLabel>
              <Input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Your Job Title"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Company Size</FormLabel>
              <Select
                placeholder="Select company size"
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
              >
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501+">501+ employees</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Message (Optional)</FormLabel>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Any specific areas you'd like the demo to cover?"
                rows={4}
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isSubmitting}
              loadingText="Submitting"
              width="full"
            >
              Request Demo
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default RequestDemo;