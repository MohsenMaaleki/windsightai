// src/pages/ContactUs.js
import React from 'react';
import {
  Container,
  VStack,
  Text,
  useToast,
  useClipboard,
  useColorModeValue,
  Icon,
  Flex,
  Heading,
  SimpleGrid,
} from '@chakra-ui/react';
import { FiMail, FiCopy } from 'react-icons/fi';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

const ContactUs = () => {
  const email = "windsightai@gmail.com";
  const { hasCopied, onCopy } = useClipboard(email);
  const toast = useToast();

  const textColor = useColorModeValue('white', 'white');
  const iconColor = useColorModeValue('white', 'white');
  const cardBgColor = useColorModeValue('whiteAlpha.200', 'whiteAlpha.200');
  const emailColor = useColorModeValue('blue.300', 'blue.200');
  const emailHoverColor = useColorModeValue('blue.400', 'blue.300');

  const handleCopy = () => {
    onCopy();
    toast({
      title: 'Email copied!',
      description: 'Email address has been copied to clipboard',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const contactReasons = [
    'Request a demo of our AI inspection system',
    'Learn more about our technology and capabilities',
    'Discuss partnership opportunities',
    'Get support for existing installations',
    'Schedule a consultation with our experts',
  ];

  return (
    <Container maxW="container.md" py={{ base: 8, md: 16 }}>
      <VStack spacing={8} align="stretch">
        <VStack spacing={4} textAlign="center">
          <Heading 
            as="h1" 
            size="xl" 
            color="white" 
            textShadow="2px 2px 4px rgba(0,0,0,0.3)"
          >
            Contact Us
          </Heading>
          <Text 
            fontSize="lg" 
            color="white" 
            textShadow="1px 1px 2px rgba(0,0,0,0.2)"
          >
            Have questions about WindSightAI? We're here to help!
          </Text>
        </VStack>

        <Card p={8} bg={cardBgColor} textAlign="center" border="none">
          <VStack spacing={6}>
            <Icon as={FiMail} w={10} h={10} color={iconColor} />
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color="black"
              transition="all 0.2s"
              _hover={{ 
                color: 'blue.500',
                transform: 'scale(1.05)'
              }}
              cursor="pointer"
              onClick={handleCopy}
            >
              {email}
            </Text>
            <Button
              leftIcon={<FiCopy />}
              onClick={handleCopy}
              variant="outline"
              size="sm"
              colorScheme="green"
              _hover={{
                bg: 'green.500',
                color: 'white'
              }}
            >
              {hasCopied ? "Copied!" : "Copy Email"}
            </Button>
          </VStack>
        </Card>

        <Card p={8}>
          <VStack spacing={6} align="stretch">
            <Text 
              fontSize="xl" 
              fontWeight="bold" 
              className="highlight-text"
              textAlign="center"
              mb={4}
            >
              Our team typically responds within 24-48 business hours. We look forward to hearing from you!
            </Text>

            <VStack align="stretch" spacing={6}>
              <Text 
                fontWeight="bold" 
                fontSize="2xl" 
                color="white" 
                textShadow="1px 1px 2px rgba(0,0,0,0.2)"
                borderBottom="2px solid"
                borderColor="whiteAlpha.300"
                pb={2}
                textAlign="center"
              >
                What you can contact us about:
              </Text>
              <SimpleGrid 
                columns={{ base: 1, md: 2 }} 
                spacing={4}
                justifyContent="center"
                width="100%"
                textAlign="center"
              >
                {contactReasons.map((reason, index) => (
                  <Flex
                    key={index}
                    align="center"
                    justify="center"
                    p={6}
                    borderRadius="lg"
                    bg="whiteAlpha.200"
                    backdropFilter="blur(8px)"
                    border="1px solid"
                    borderColor="whiteAlpha.300"
                    _hover={{
                      bg: "whiteAlpha.300",
                      transform: "translateY(-2px)",
                      boxShadow: "lg"
                    }}
                  >
                    <Text color="white" textAlign="center">{reason}</Text>
                  </Flex>
                ))}
              </SimpleGrid>
            </VStack>
          </VStack>
        </Card>
      </VStack>
    </Container>
  );
};

export default ContactUs;