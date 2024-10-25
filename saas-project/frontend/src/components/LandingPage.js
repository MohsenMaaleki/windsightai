import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
 Box,
 Heading,
 Text,
 Button,
 VStack,
 Container,
 Grid,
 Image,
 AspectRatio,
 Flex,
 Icon,
 Link,
} from '@chakra-ui/react';
import { FaWind, FaPlane, FaChartLine, FaShieldAlt, FaPiggyBank, FaLeaf } from 'react-icons/fa';
import WindImage from './Wind.jpg';

const FeatureCard = ({ icon, title, description }) => (
 <VStack
   align="start"
   p={5}
   bg="rgba(255, 255, 255, 0.1)"
   backdropFilter="blur(10px)"
   rounded="lg"
   shadow="md"
   height="100%"
   color="white"
 >
   <Icon as={icon} w={10} h={10} color="teal.200" />
   <Heading size="md">{title}</Heading>
   <Text>{description}</Text>
 </VStack>
);

const LandingPage = () => {
 return (
   <Box
     bgGradient="linear(to-br, teal.400, blue.500, purple.600)"
     minH="100vh"
     color="white"
     display="flex"
     flexDirection="column"
   >
     <Container maxW="container.xl" py={20} flex="1">
       <VStack spacing={16} alignItems="stretch">
         {/* Hero Section */}
         <Flex direction={{ base: 'column', md: 'row' }} align="center" justify="space-between">
           <Box flex={1} pr={{ base: 0, md: 8 }}>
             <Heading as="h1" size="3xl" lineHeight="shorter" mb={6}>
               <Text
                 as="span"
                 color="blue.900"
                 fontWeight="extrabold"
                 textShadow="2px 2px 4px rgba(255,255,255,0.4)"
               >
                 WindSightAI
               </Text>
               : Revolutionizing Wind Turbine Maintenance
             </Heading>
             <Text fontSize="xl" mb={8}>
               Welcome to WindSightAI, the cutting-edge solution for wind turbine blade inspection. Our advanced AI-powered system transforms the way we detect and analyze defects, ensuring optimal performance and longevity of wind energy infrastructure.
             </Text>
             <Button 
               as={RouterLink} 
               to="/login" 
               colorScheme="blue" 
               bg="blue.900" 
               color="white" 
               size="lg" 
               fontWeight="bold" 
               _hover={{ bg: "blue.800" }}
             >
               Get Started
             </Button>
           </Box>
           <Box flex={1} mt={{ base: 8, md: 0 }}>
             <Image 
               src={WindImage} 
               alt="Wind Turbine" 
               rounded="lg" 
               shadow="2xl" 
               objectFit="cover"
               w="100%"
               h={{ base: "300px", md: "400px" }}
             />
           </Box>
         </Flex>

         {/* Media Section */}
         <Box>
           <Heading as="h2" size="xl" mb={8} textAlign="center" color="white">
             See WindSightAI in Action
           </Heading>
           <Flex justify="center">
             <Box width={{ base: "100%", md: "75%", lg: "60%" }}>
               <AspectRatio ratio={16 / 9}>
                 <video
                   controls
                   src="/videos/demo_2.mp4"
                   style={{
                     borderRadius: '8px',
                     boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                   }}
                 >
                   Your browser does not support the video tag.
                 </video>
               </AspectRatio>
             </Box>
           </Flex>
         </Box>

         {/* Features Section */}
         <Box>
           <Heading as="h2" size="xl" mb={8} textAlign="center" color="white">
             Key Features
           </Heading>
           <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={8}>
             <FeatureCard
               icon={FaWind}
               title="AI-Driven Precision"
               description="Harness the power of state-of-the-art YOLO-based deep learning models for accurate defect detection."
             />
             <FeatureCard
               icon={FaPlane}
               title="Drone Integration"
               description="Seamlessly analyze high-resolution images captured by drones, enabling comprehensive inspections without turbine downtime."
             />
             <FeatureCard
               icon={FaChartLine}
               title="Real-Time Insights"
               description="Get instant results and visualizations, allowing for quick decision-making and maintenance prioritization."
             />
             <FeatureCard
               icon={FaShieldAlt}
               title="Enhanced Safety"
               description="Reduce the need for dangerous manual inspections by leveraging our automated analysis tools."
             />
             <FeatureCard
               icon={FaPiggyBank}
               title="Cost-Effective"
               description="Minimize maintenance costs and maximize energy production through early defect detection and targeted repairs."
             />
             <FeatureCard
               icon={FaLeaf}
               title="Environmental Impact"
               description="Optimize wind turbine efficiency, reducing carbon footprint and contributing to a greener, more sustainable energy future."
             />
           </Grid>
         </Box>

         {/* Pricing Section */}
         <Box>
           <Heading as="h2" size="xl" mb={8} textAlign="center" color="white">
             Pricing
           </Heading>
           <Box
             borderWidth="1px"
             borderRadius="lg"
             p={8}
             textAlign="center"
             bg="rgba(255, 255, 255, 0.1)"
             backdropFilter="blur(10px)"
             shadow="xl"
             maxW="md"
             mx="auto"
             color="white"
           >
             <Heading as="h3" size="lg" mb={4}>
               Coming Soon
             </Heading>
             <Text fontSize="lg">We're working on exciting pricing options for WindSightAI.</Text>
             <Text mt={2} fontSize="lg">Stay tuned for more information!</Text>
             <Button as={RouterLink} to="/contact" colorScheme="teal" size="lg" mt={8}>
               Contact Us for Details
             </Button>
           </Box>
         </Box>
       </VStack>
     </Container>

     {/* Footer with Dataset Reference */}
     <Box bg="rgba(0, 0, 0, 0.2)" py={4}>
       <Container maxW="container.xl">
         <Text fontSize="sm" textAlign="center">
           Model trained on dataset: SHIHAVUDDIN, ASM; Chen, Xiao (2018), "DTU - Drone inspection images of wind turbine", Mendeley Data, V2, doi: 
           <Link 
             href="https://doi.org/10.17632/hd96prn3nc.2" 
             isExternal 
             color="teal.200"
             ml={1}
           >
             10.17632/hd96prn3nc.2
           </Link>
         </Text>
       </Container>
     </Box>
   </Box>
 );
};

export default LandingPage;