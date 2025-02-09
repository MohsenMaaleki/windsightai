import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { colors } from '../theme/foundations/colors';
import {
 Box,
 Heading,
 Text,
 Button,
 VStack,
 Container,
 Grid,
 AspectRatio,
 Flex,
 Icon,
 Stack,
 Image,
 Link,
} from '@chakra-ui/react';
import { FaWind, FaPlane, FaChartLine, FaShieldAlt, FaPiggyBank, FaLeaf } from 'react-icons/fa';
import WindImage from '../assets/images/Wind.jpg';

const FeatureCard = ({ icon, title, description, iconColor }) => {
  return (
    <VStack
      align="start"
      p={5}
      className="card-glass"
      shadow="lg"
      height="100%"
      transition="all 0.2s"
      _hover={{
        transform: 'translateY(-2px)',
        shadow: 'xl',
      }}
    >
      <Icon as={icon} w={10} h={10} color={iconColor} />
      <Heading size="md" className="feature-title">{title}</Heading>
      <Text className="feature-description">{description}</Text>
    </VStack>
  );
};

const LandingPage = () => {
  return (
    <Box
      minH="100vh"
      bgGradient={colors.gradients.background}
      color="white"
    >
      <Container maxW="container.xl" py={20}>
        <Stack
          direction={{ base: 'column', lg: 'row' }}
          spacing={8}
          align="center"
          justify="space-between"
          mb={20}
        >
          <VStack align="start" spacing={6} maxW="600px">
            <Heading
              as="h1"
              size="4xl"
              fontWeight="bold"
              className="gradient-text"
              lineHeight="shorter"
              sx={{
                backgroundSize: '200% auto',
                animation: 'shimmer 3s infinite linear',
                letterSpacing: '-0.02em',
              }}
            >
              WindSightAI:
            </Heading>
            <Heading
              as="h2"
              size="2xl"
              color="white"
              fontWeight="medium"
              textShadow="0 2px 10px rgba(0,0,0,0.2)"
              letterSpacing="tight"
            >
              Revolutionizing Wind Turbine Maintenance
            </Heading>
            <Text
              fontSize="xl"
              color="white"
              textShadow="0 2px 4px rgba(0,0,0,0.1)"
            >
              Welcome to WindSightAI, the cutting-edge solution for wind turbine 
              blade inspection. Our advanced AI-powered system transforms the way 
              we detect and analyze defects, ensuring optimal performance and 
              longevity of wind energy infrastructure.
            </Text>
            <Button
              as={RouterLink}
              to="/register"
              size="lg"
              bg="white"
              color={colors.brand[600]}
              _hover={{
                bg: 'gray.100',
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}
              _active={{
                bg: 'gray.200',
                transform: 'translateY(0)',
              }}
              transition="all 0.2s"
              px={8}
              py={6}
              fontSize="lg"
              fontWeight="bold"
              boxShadow="md"
            >
              Get Started
            </Button>
          </VStack>
          <Box
            boxSize={{ base: "300px", lg: "500px" }}
            position="relative"
          >
            <Image
              src={WindImage}
              alt="Wind Turbine"
              borderRadius="xl"
              boxShadow="2xl"
              objectFit="cover"
            />
          </Box>
        </Stack>

        <VStack spacing={12} my={20}>
          <Heading
            as="h2"
            size="2xl"
            textAlign="center"
            color="white"
            fontWeight="bold"
          >
            See WindSightAI in Action
          </Heading>
          
          <Box
            w="100%"
            maxW="1000px"
            mx="auto"
            borderRadius="xl"
            overflow="hidden"
            boxShadow="2xl"
            backgroundColor="rgba(255, 255, 255, 0.1)"
            backdropFilter="blur(10px)"
            p={4}
          >
            <AspectRatio ratio={16 / 9}>
              <video
                controls
                src="/videos/demo_2.mp4"
                style={{
                  borderRadius: '8px',
                  width: '100%',
                  height: '100%',
                }}
              >
                Your browser does not support the video tag.
              </video>
            </AspectRatio>
          </Box>
        </VStack>

        <VStack spacing={12} mt={20}>
          <Heading
            as="h2"
            size="2xl"
            textAlign="center"
            color="white"
            fontWeight="bold"
          >
            Key Features
          </Heading>
          
          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
            gap={8}
            w="100%"
          >
            <FeatureCard
              icon={FaWind}
              iconColor="#7FFFD4"
              title="AI-Driven Precision"
              description="Harness the power of state-of-the-art YOLO-based deep learning models for accurate defect detection."
            />
            <FeatureCard
              icon={FaPlane}
              iconColor="#87CEEB"
              title="Drone Integration"
              description="Seamlessly analyze high-resolution images captured by drones, enabling comprehensive inspections without turbine downtime."
            />
            <FeatureCard
              icon={FaChartLine}
              iconColor="#98FB98"
              title="Real-Time Insights"
              description="Get instant results and visualizations, allowing for quick decision-making and maintenance prioritization."
            />
            <FeatureCard
              icon={FaShieldAlt}
              iconColor="#FFB6C1"
              title="Enhanced Safety"
              description="Reduce the need for dangerous manual inspections by leveraging our automated analysis tools."
            />
            <FeatureCard
              icon={FaPiggyBank}
              iconColor="#DDA0DD"
              title="Cost-Effective"
              description="Minimize maintenance costs and maximize energy production through early defect detection and targeted repairs."
            />
            <FeatureCard
              icon={FaLeaf}
              iconColor="#98FF98"
              title="Environmental Impact"
              description="Optimize wind turbine efficiency, reducing carbon footprint and contributing to a greener, more sustainable energy future."
            />
          </Grid>
        </VStack>

        <VStack spacing={12} mt={20}>
          <Heading
            as="h2"
            size="2xl"
            textAlign="center"
            color="white"
            fontWeight="bold"
          >
            Pricing
          </Heading>

          <Box
            maxW="container.md"
            w="100%"
            p={8}
            borderRadius="xl"
            className="card-glass"
            textAlign="center"
          >
            <VStack spacing={6}>
              <Heading as="h3" size="xl" color="white">
                Coming Soon
              </Heading>
              <Text fontSize="lg" color="gray.200">
                We're working on exciting pricing options for WindSightAI.
              </Text>
              <Text fontSize="lg" color="gray.200">
                Stay tuned for more information!
              </Text>
              <Button
                as={RouterLink}
                to="/contact"
                size="lg"
                colorScheme="green"
                px={8}
              >
                Contact Us for Details
              </Button>
            </VStack>
          </Box>
        </VStack>

        <Box
          mt={20}
          py={4}
          borderTop="1px solid"
          borderColor="whiteAlpha.200"
          fontSize="sm"
          color="gray.400"
          textAlign="center"
        >
          <Text>
            Model trained on dataset: SHIHAVUDDIN, ASM; Chen, Xiao (2018), "DTU - Drone inspection images of wind turbine", 
            Mendeley Data, V2, doi:{' '}
            <Link
              href="https://doi.org/10.17632/hd96prn3nc.2"
              color="blue.300"
              isExternal
            >
              10.17632/hd96prn3nc.2
            </Link>
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;