import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Heading, Text, Button, VStack, HStack, Container, Image, Icon, Flex } from '@chakra-ui/react';
import { FaRocket, FaChartLine, FaLock } from 'react-icons/fa';

const Feature = ({ icon, title, description }) => (
  <Box bg="white" p={6} rounded="lg" shadow="md" flex={1} textAlign="center">
    <Icon as={icon} w={10} h={10} color="blue.500" mb={4} />
    <Heading as="h3" size="md" mb={2}>
      {title}
    </Heading>
    <Text fontSize="sm">{description}</Text>
  </Box>
);

const LandingPage = () => {
  return (
    <Box bg="gray.50" minH="100vh">
      <Container maxW="container.xl" py={20}>
        <Flex direction={{ base: 'column', md: 'row' }} alignItems="center" mb={20}>
          <VStack spacing={8} alignItems={{ base: 'center', md: 'flex-start' }} textAlign={{ base: 'center', md: 'left' }} flex={1}>
            <Heading as="h1" size="2xl" bgGradient="linear(to-r, blue.400, teal.400)" bgClip="text">
              Transform Your Business with YourSaaS
            </Heading>
            <Text fontSize="xl" maxW="2xl" color="gray.600">
              Empower your team, streamline workflows, and skyrocket productivity with our cutting-edge SaaS solution.
            </Text>
            <HStack spacing={4}>
              <Button as={RouterLink} to="/register" colorScheme="blue" size="lg" px={8}>
                Start Free Trial
              </Button>
              <Button as={RouterLink} to="/demo" colorScheme="teal" variant="outline" size="lg">
                Watch Demo
              </Button>
            </HStack>
          </VStack>
          <Box flex={1} ml={{ base: 0, md: 12 }} mt={{ base: 12, md: 0 }}>
            <Image src="/path/to/hero-image.png" alt="YourSaaS Dashboard" rounded="lg" shadow="2xl" />
          </Box>
        </Flex>

        <VStack spacing={16}>
          <Heading as="h2" size="xl" textAlign="center">
            Why Choose YourSaaS?
          </Heading>
          <HStack spacing={8} alignItems="stretch" flexDirection={{ base: 'column', md: 'row' }}>
            <Feature
              icon={FaRocket}
              title="Boost Productivity"
              description="Automate repetitive tasks and focus on what matters most to your business."
            />
            <Feature
              icon={FaChartLine}
              title="Data-Driven Insights"
              description="Make informed decisions with powerful analytics and customizable dashboards."
            />
            <Feature
              icon={FaLock}
              title="Enterprise-Grade Security"
              description="Rest easy knowing your data is protected by state-of-the-art security measures."
            />
          </HStack>
        </VStack>

        <Box mt={20} textAlign="center">
          <Heading as="h2" size="xl" mb={4}>
            Ready to Get Started?
          </Heading>
          <Text fontSize="lg" mb={8}>
            Join thousands of satisfied customers and take your business to the next level.
          </Text>
          <Button as={RouterLink} to="/register" colorScheme="blue" size="lg" px={12}>
            Start Your Free Trial
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;
