// src/pages/RequestDemo.js
import React, { useState } from 'react';
import {
  Container,
  VStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  useColorModeValue,
  SimpleGrid,
  FormErrorMessage,
  useToast,
} from '@chakra-ui/react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Textarea } from '../components/common/Textarea';
import axios from 'axios';

const RequestDemo = () => {
  const initialFormState = {
    name: '',
    email: '',
    company: '',
    jobTitle: '',
    companySize: '',
    message: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const textColor = useColorModeValue('gray.700', 'gray.200');
  const subtitleColor = useColorModeValue('gray.600', 'gray.400');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.company) newErrors.company = 'Company name is required';
    if (!formData.jobTitle) newErrors.jobTitle = 'Job title is required';
    if (!formData.companySize) newErrors.companySize = 'Company size is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await axios.post('/api/request-demo', formData);
      
      toast({
        title: 'Demo request sent!',
        description: "We've received your request and will contact you soon to schedule a demo.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      setFormData(initialFormState);
    } catch (error) {
      toast({
        title: 'Request failed',
        description: error.response?.data?.error || 'Unable to send your demo request. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const companySizes = [
    { value: '1-10', label: '1-10 employees' },
    { value: '11-50', label: '11-50 employees' },
    { value: '51-200', label: '51-200 employees' },
    { value: '201-500', label: '201-500 employees' },
    { value: '501+', label: '501+ employees' },
  ];

  return (
    <Container maxW="container.md" py={{ base: 8, md: 16 }}>
      <Card p={8}>
        <VStack spacing={8} align="stretch">
          <VStack spacing={4} textAlign="center">
            <Heading as="h1" size="xl" color={textColor}>
              Request a Demo
            </Heading>
            <Text fontSize="lg" color={subtitleColor}>
              Interested in seeing WindSightAI in action? Fill out the form below to request a demo.
            </Text>
          </VStack>

          <form onSubmit={handleSubmit}>
            <VStack spacing={6}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} width="100%">
                <FormControl isRequired isInvalid={errors.name}>
                  <FormLabel color={textColor}>Name</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                  />
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={errors.email}>
                  <FormLabel color={textColor}>Email</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email"
                  />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={errors.company}>
                  <FormLabel color={textColor}>Company</FormLabel>
                  <Input
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Your company"
                  />
                  <FormErrorMessage>{errors.company}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={errors.jobTitle}>
                  <FormLabel color={textColor}>Job Title</FormLabel>
                  <Input
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    placeholder="Your job title"
                  />
                  <FormErrorMessage>{errors.jobTitle}</FormErrorMessage>
                </FormControl>
              </SimpleGrid>

              <FormControl isRequired isInvalid={errors.companySize}>
                <FormLabel color={textColor}>Company Size</FormLabel>
                <Select
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                  placeholder="Select company size"
                >
                  {companySizes.map(size => (
                    <option key={size.value} value={size.value}>
                      {size.label}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.companySize}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel color={textColor}>Message (Optional)</FormLabel>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Any specific areas you'd like the demo to cover?"
                  rows={4}
                />
              </FormControl>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                width="full"
                isLoading={isSubmitting}
                loadingText="Submitting"
              >
                Request Demo
              </Button>
            </VStack>
          </form>
        </VStack>
      </Card>
    </Container>
  );
};

export default RequestDemo;