import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Image,
  Flex,
  useToast,
  Alert,
  AlertIcon,
  Grid,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { FileInput } from '../components/common/FileInput';
import { Spinner } from '../components/common/Spinner';

// ImageWithFallback Component
const ImageWithFallback = ({ src, alt, onClick, ...props }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.100');

  const handleLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleError = () => {
    setIsLoading(false);
    setError('Failed to load image');
  };

  return (
    <Box 
      position="relative" 
      width="100%" 
      height="300px" 
      bg={bgColor} 
      borderRadius="lg"
      cursor="pointer"
      onClick={onClick}
    >
      {isLoading && (
        <Flex 
          position="absolute" 
          top="0"
          left="0"
          right="0"
          bottom="0"
          align="center"
          justify="center"
        >
          <Spinner size="xl" color="brand.500" />
        </Flex>
      )}
      
      {error ? (
        <Alert status="error" borderRadius="lg">
          <AlertIcon />
          <Text color={textColor}>{error}</Text>
        </Alert>
      ) : (
        <Image
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          maxH="300px"
          width="100%"
          objectFit="contain"
          display={isLoading ? 'none' : 'block'}
          borderRadius="lg"
          {...props}
        />
      )}
    </Box>
  );
};

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState({});
  const toast = useToast();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'gray.100');

  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUploads = useCallback(async (id) => {
    try {
      const response = await axios.get(`/api/uploads?user_id=${id}`);
      setUploads(response.data);
    } catch (error) {
      toast({
        title: 'Error fetching uploads',
        description: error.response?.data?.error || 'An unexpected error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast]);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      fetchUploads(storedUserId);
    } else {
      window.location.href = '/login';
    }
  }, [fetchUploads]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile && selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpload = async () => {
    if (!file || !userId) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', userId);

    setIsUploading(true);
    try {
      await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setFile(null);
      setPreview(null);
      fetchUploads(userId);
      toast({
        title: 'Success',
        description: 'File uploaded successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error.response?.data?.error || 'An unexpected error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnalyze = async (uploadId) => {
    setIsAnalyzing(prev => ({ ...prev, [uploadId]: true }));
    try {
      await axios.post(`/api/analyze/${uploadId}`);
      fetchUploads(userId);
      toast({
        title: 'Success',
        description: 'Analysis completed',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Analysis failed',
        description: error.response?.data?.error || 'An unexpected error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsAnalyzing(prev => ({ ...prev, [uploadId]: false }));
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="xl" className="gradient-text">Dashboard</Heading>
        
        <Card p={6} className="card-glass">
          <VStack spacing={4} align="stretch">
            <Text className="section-title">Upload New Image</Text>
            <FileInput
              accept="image/*"
              onChange={handleFileChange}
              placeholder="Choose an image to upload"
            />
            
            {preview && (
              <ImageWithFallback 
                src={preview} 
                alt="Preview" 
                maxH="200px" 
                objectFit="contain" 
              />
            )}
            
            <Button
              onClick={handleUpload}
              isLoading={isUploading}
              loadingText="Uploading"
              isDisabled={!file}
              variant="primary"
              size="lg"
              width="full"
            >
              Upload
            </Button>
          </VStack>
        </Card>

        <Box>
          <Heading size="lg" mb={6} className="section-title">Your Uploads</Heading>
          
          {uploads.length === 0 ? (
            <Card p={6} className="card-glass">
              <Text className="feature-description">
                No uploads yet. Upload a file to get started!
              </Text>
            </Card>
          ) : (
            <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
              {uploads.map((upload) => (
                <Card key={upload.id} p={6}>
                  <VStack spacing={4} align="stretch">
                    <Flex justify="space-between" align="center">
                      <Text fontWeight="bold" color={textColor}>{upload.filename}</Text>
                      <Button
                        onClick={() => handleAnalyze(upload.id)}
                        isLoading={isAnalyzing[upload.id]}
                        loadingText="Analyzing"
                        isDisabled={upload.analyses && upload.analyses.length > 0}
                        colorScheme={upload.analyses?.length > 0 ? 'gray' : 'green'}
                        variant={upload.analyses?.length > 0 ? 'outline' : 'solid'}
                        size="sm"
                      >
                        {upload.analyses && upload.analyses.length > 0 ? 'Analyzed' : 'Analyze'}
                      </Button>
                    </Flex>

                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                      <Box>
                        <Text fontSize="sm" fontWeight="medium" mb={2} color={textColor}>Original Image</Text>
                        <ImageWithFallback
                          src={`/api/image/upload/${upload.filename}`}
                          alt={upload.filename}
                          onClick={() => {
                            setSelectedImage(`/api/image/upload/${upload.filename}`);
                            setIsModalOpen(true);
                          }}
                        />
                      </Box>

                      {upload.analyses && upload.analyses.length > 0 && (
                        <Box>
                          <Text fontSize="sm" fontWeight="medium" mb={2} color={textColor}>Analyzed Image</Text>
                          <ImageWithFallback
                            src={`/api/image/output/${upload.analyses[0].result_path}`}
                            alt="Analyzed Image"
                            onClick={() => {
                              setSelectedImage(`/api/image/output/${upload.analyses[0].result_path}`);
                              setIsModalOpen(true);
                            }}
                          />
                        </Box>
                      )}
                    </Grid>

                    <Text fontSize="sm" color="gray.500">
                      Uploaded on: {new Date(upload.upload_date).toLocaleString()}
                    </Text>
                  </VStack>
                </Card>
              ))}
            </Grid>
          )}
        </Box>
      </VStack>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        size="6xl"
      >
        <ModalOverlay />
        <ModalContent bg="transparent" boxShadow="none">
          <ModalCloseButton color="white" />
          <ModalBody p={0}>
            <Image
              src={selectedImage}
              alt="Enlarged view"
              w="100%"
              h="auto"
              maxH="90vh"
              objectFit="contain"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Dashboard;