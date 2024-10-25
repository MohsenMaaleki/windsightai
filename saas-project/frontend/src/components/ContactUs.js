import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Container,
  Link,
  Button,
  useClipboard,
  useToast,
  Icon,
} from '@chakra-ui/react';
import { FiMail, FiCopy } from 'react-icons/fi';

const ContactUs = () => {
  const email = "windsightai@gmail.com";
  const { hasCopied, onCopy } = useClipboard(email);
  const toast = useToast();

  const handleCopy = () => {
    onCopy();
    toast({
      title: "Email copied!",
      description: "Email address has been copied to clipboard",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="xl" mb={4}>Contact Us</Heading>
          <Text fontSize="lg" color="gray.600" mb={6}>
            Have questions about WindSightAI? We're here to help!
          </Text>
          <Text fontSize="md" color="gray.600" mb={8}>
            For inquiries about our AI-powered wind turbine inspection system, 
            partnership opportunities, or any other questions, please reach out to us at:
          </Text>
        </Box>

        <Box 
          p={8} 
          bg="blue.50" 
          borderRadius="lg" 
          boxShadow="sm"
          textAlign="center"
        >
          <Icon as={FiMail} w={8} h={8} color="blue.500" mb={4} />
          <Link
            href={`mailto:${email}`}
            fontSize="xl"
            fontWeight="medium"
            color="blue.600"
            display="block"
            mb={4}
            _hover={{ color: "blue.700" }}
          >
            {email}
          </Link>
          <Button
            leftIcon={<FiCopy />}
            onClick={handleCopy}
            size="sm"
            colorScheme="blue"
            variant="outline"
          >
            {hasCopied ? "Copied!" : "Copy Email"}
          </Button>
        </Box>

        <Box textAlign="center" mt={6}>
          <Text color="gray.600">
            Our team typically responds within 24-48 business hours. We look forward to hearing from you!
          </Text>
        </Box>

        <Box 
          p={6} 
          bg="gray.50" 
          borderRadius="md"
          mt={8}
        >
          <Text fontWeight="medium" mb={3}>What you can contact us about:</Text>
          <VStack align="start" spacing={2} color="gray.600">
            <Text>• Request a demo of our AI inspection system</Text>
            <Text>• Learn more about our technology and capabilities</Text>
            <Text>• Discuss partnership opportunities</Text>
            <Text>• Get support for existing installations</Text>
            <Text>• Schedule a consultation with our experts</Text>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default ContactUs;