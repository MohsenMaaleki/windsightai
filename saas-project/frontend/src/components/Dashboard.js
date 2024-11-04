import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  VStack, 
  Heading, 
  Input, 
  Button, 
  Image, 
  Text, 
  useToast, 
  Flex,
  Spinner,
  Alert,
  AlertIcon
} from '@chakra-ui/react';

// ImageWithFallback Component
const ImageWithFallback = ({ src, alt, ...props }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleError = () => {
    setIsLoading(false);
    setError('Failed to load image');
  };

  return (
    <Box position="relative" width="100%" height="300px">
      {isLoading && (
        <Box 
          position="absolute" 
          top="50%" 
          left="50%" 
          transform="translate(-50%, -50%)"
        >
          <Spinner size="xl" color="blue.500" />
        </Box>
      )}
      
      {error ? (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {error}
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

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      fetchUploads(storedUserId);
    } else {
      window.location.href = '/login';
    }
  }, []);

  const fetchUploads = async (id) => {
    try {
      const response = await axios.get(`/api/uploads?user_id=${id}`);
      setUploads(response.data);
    } catch (error) {
      console.error('Error fetching uploads:', error);
      toast({
        title: 'Error fetching uploads',
        description: error.response?.data?.error || 'An unexpected error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

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
        title: 'File uploaded successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Upload failed:', error);
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
        title: 'Analysis completed',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Analysis failed:', error);
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
    <Box maxW="6xl" mx="auto" mt={10} px={4}>
      <Heading mb={5}>Dashboard</Heading>
      <VStack spacing={4} align="stretch">
        <Input 
          type="file" 
          onChange={handleFileChange} 
          accept="image/*"
          p={1}
          border="1px dashed"
          borderColor="gray.300"
          borderRadius="md"
        />
        {preview && (
          <ImageWithFallback src={preview} alt="Preview" maxH="200px" objectFit="contain" />
        )}
        <Button 
          onClick={handleUpload} 
          colorScheme="blue" 
          isDisabled={!file || isUploading}
          isLoading={isUploading}
          loadingText="Uploading"
        >
          Upload
        </Button>
        
        <Heading size="md" mt={8}>Your Uploads</Heading>
        {uploads.length === 0 ? (
          <Text>No uploads yet. Upload a file to get started!</Text>
        ) : (
          uploads.map((upload) => (
            <Box key={upload.id} borderWidth="1px" borderRadius="lg" p={4} mt={4}>
              <Flex justifyContent="space-between" alignItems="center" mb={4}>
                <Text fontWeight="bold">{upload.filename}</Text>
                <Button 
                  onClick={() => handleAnalyze(upload.id)} 
                  colorScheme="green"
                  isLoading={isAnalyzing[upload.id]}
                  loadingText="Analyzing"
                  isDisabled={upload.analyses && upload.analyses.length > 0}
                >
                  {upload.analyses && upload.analyses.length > 0 ? 'Analyzed' : 'Analyze'}
                </Button>
              </Flex>
              
              <Flex direction={["column", "row"]} justify="space-between">
                <Box flex="1">
                  <Heading size="sm" mb={2}>Original Image</Heading>
                  <ImageWithFallback 
                    src={`/api/image/upload/${upload.filename}`}
                    alt={upload.filename}
                  />
                </Box>
                
                {upload.analyses && upload.analyses.length > 0 && (
                  <Box flex="1" ml={[0, 4]} mt={[4, 0]}>
                    <Heading size="sm" mb={2}>Analyzed Image</Heading>
                    <ImageWithFallback 
                      src={`/api/image/output/${upload.analyses[0].result_path}`}
                      alt="Analyzed Image"
                    />
                  </Box>
                )}
              </Flex>
              
              <Text fontSize="sm" mt={2}>
                Uploaded on: {new Date(upload.upload_date).toLocaleString()}
              </Text>
            </Box>
          ))
        )}
      </VStack>
    </Box>
  );
};

export default Dashboard;