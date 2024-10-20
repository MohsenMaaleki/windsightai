import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Container,
  Image,
  Icon,
  Flex,
  SimpleGrid,
  useColorModeValue,
  Highlight,
  Divider,
  Avatar,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { FaRocket, FaChartLine, FaLock, FaCheck } from 'react-icons/fa';

const Feature = ({ icon, title, description }) => (
  <VStack
    bg={useColorModeValue('white', 'gray.800')}
    p={6}
    rounded="xl"
    shadow="xl"
    borderWidth="1px"
    borderColor={useColorModeValue('gray.200', 'gray.700')}
    align="start"
    spacing={4}
    height="full"
    transition="all 0.3s"
    _hover={{ transform: 'translateY(-5px)', shadow: '2xl' }}
  >
    <Flex
      alignItems="center"
      justifyContent="center"
      w={16}
      h={16}
      rounded="full"
      bg={useColorModeValue('blue.100', 'blue.900')}
    >
      <Icon as={icon} w={8} h={8} color={useColorModeValue('blue.500', 'blue.200')} />
    </Flex>
    <Heading as="h3" size="md">
      {title}
    </Heading>
    <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.300')}>
      {description}
    </Text>
  </VStack>
);

const Testimonial = ({ name, role, content, avatar }) => (
  <VStack
    spacing={4}
    p={6}
    bg={useColorModeValue('white', 'gray.800')}
    rounded="xl"
    shadow="md"
    borderWidth="1px"
    borderColor={useColorModeValue('gray.200', 'gray.700')}
  >
    <Text fontSize="md" fontStyle="italic">
      "{content}"
    </Text>
    <HStack spacing={4}>
      <Avatar size="md" name={name} src={avatar} />
      <Box textAlign="left">
        <Text fontWeight="bold">{name}</Text>
        <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
          {role}
        </Text>
      </Box>
    </HStack>
  </VStack>
);

const LandingPage = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const highlightColor = useColorModeValue('blue.500', 'blue.300');

  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW="container.xl" py={20}>
        <Flex direction={{ base: 'column', lg: 'row' }} alignItems="center" mb={20}>
          <VStack spacing={8} alignItems={{ base: 'center', lg: 'flex-start' }} textAlign={{ base: 'center', lg: 'left' }} flex={1}>
            <Heading as="h1" size="3xl" lineHeight="shorter">
              <Highlight query="Transform" styles={{ px: '2', py: '1', rounded: 'full', bg: 'blue.100', color: 'blue.700' }}>
                Transform Your Business
              </Highlight>{' '}
              with YourSaaS
            </Heading>
            <Text fontSize="xl" maxW="2xl" color={textColor}>
              Empower your team, streamline workflows, and skyrocket productivity with our cutting-edge SaaS solution. Experience the future of business operations today.
            </Text>
            <HStack spacing={4}>
              <Button as={RouterLink} to="/register" colorScheme="blue" size="lg" px={8} fontWeight="bold">
                Start Free Trial
              </Button>
              <Button as={RouterLink} to="/demo" colorScheme="blue" variant="outline" size="lg" fontWeight="bold">
                Watch Demo
              </Button>
            </HStack>
          </VStack>
          <Box flex={1} ml={{ base: 0, lg: 12 }} mt={{ base: 12, lg: 0 }}>
            <Image src="/path/to/hero-image.png" alt="YourSaaS Dashboard" rounded="lg" shadow="2xl" />
          </Box>
        </Flex>

        <VStack spacing={16}>
          <Heading as="h2" size="xl" textAlign="center">
            Why Choose{' '}
            <Text as="span" color={highlightColor}>
              YourSaaS
            </Text>
            ?
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} w="full">
            <Feature
              icon={FaRocket}
              title="Boost Productivity"
              description="Automate repetitive tasks and focus on what matters most to your business. Increase efficiency across your entire organization."
            />
            <Feature
              icon={FaChartLine}
              title="Data-Driven Insights"
              description="Make informed decisions with powerful analytics and customizable dashboards. Turn your data into actionable strategies."
            />
            <Feature
              icon={FaLock}
              title="Enterprise-Grade Security"
              description="Rest easy knowing your data is protected by state-of-the-art security measures. We prioritize your privacy and data integrity."
            />
          </SimpleGrid>
        </VStack>

        <Box my={20}>
          <Heading as="h2" size="xl" textAlign="center" mb={10}>
            Trusted by Industry Leaders
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            <Testimonial
              name="Sarah Johnson"
              role="CEO, TechInnovate"
              content="YourSaaS has revolutionized how we manage our projects. The productivity boost is remarkable!"
              avatar="/path/to/avatar1.jpg"
            />
            <Testimonial
              name="Michael Chen"
              role="CTO, DataDriven Co."
              content="The insights we've gained through YourSaaS analytics have been game-changing for our decision-making process."
              avatar="/path/to/avatar2.jpg"
            />
            <Testimonial
              name="Emily Rodriguez"
              role="Operations Manager, GlobalTech"
              content="The level of security and ease of use that YourSaaS provides gives us peace of mind and helps us focus on growth."
              avatar="/path/to/avatar3.jpg"
            />
          </SimpleGrid>
        </Box>

        <Divider my={20} />

        <Box textAlign="center">
          <Heading as="h2" size="xl" mb={4}>
            Ready to{' '}
            <Text as="span" color={highlightColor}>
              Transform
            </Text>{' '}
            Your Business?
          </Heading>
          <Text fontSize="lg" mb={8} maxW="2xl" mx="auto">
            Join thousands of satisfied customers and take your business to the next level. Start your journey to unprecedented growth and efficiency today.
          </Text>
          <VStack spacing={4}>
            <Button as={RouterLink} to="/register" colorScheme="blue" size="lg" px={12} fontWeight="bold">
              Start Your Free Trial
            </Button>
            <Text fontSize="sm" color={textColor}>
              No credit card required. 14-day free trial.
            </Text>
          </VStack>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} mt={20}>
          <Box>
            <Heading as="h3" size="lg" mb={4}>
              Key Features
            </Heading>
            <VStack align="start" spacing={3}>
              {['Advanced Analytics', 'Team Collaboration', 'Custom Workflows', 'Integration Ecosystem', 'Mobile Access'].map((feature) => (
                <HStack key={feature}>
                  <Icon as={FaCheck} color={highlightColor} />
                  <Text>{feature}</Text>
                </HStack>
              ))}
            </VStack>
          </Box>
          <Box>
            <Heading as="h3" size="lg" mb={4}>
              Get Started in Minutes
            </Heading>
            <VStack align="start" spacing={3}>
              <Text>1. Sign up for your free trial</Text>
              <Text>2. Set up your account and team</Text>
              <Text>3. Import your data or start fresh</Text>
              <Text>4. Customize your workflows</Text>
              <Text>5. Watch your productivity soar!</Text>
            </VStack>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default LandingPage;