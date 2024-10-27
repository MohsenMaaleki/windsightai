import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, VStack, Heading, Input, Button, Image, Text, HStack, useToast, Flex } from '@chakra-ui/react';

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
      const response = await axios.get(`http://161.35.218.169:5000/api/uploads?user_id=${id}`);
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
    }
  };

  const handleUpload = async () => {
    if (!file || !userId) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', userId);

    setIsUploading(true);
    try {
      await axios.post('http://161.35.218.169:5000/api/upload', formData, {
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
      await axios.post(`http://161.35.218.169:5000/api/analyze/${uploadId}`);
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
        <Input type="file" onChange={handleFileChange} accept="image/*,video/*" />
        {preview && (
          <Image src={preview} alt="Preview" maxH="200px" objectFit="contain" />
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
                  <Image 
                    src={`http://161.35.218.169:5000/uploads/${upload.filename}`} 
                    alt={upload.filename}
                    maxH="300px"
                    objectFit="contain"
                  />
                </Box>
                
                {upload.analyses && upload.analyses.length > 0 && (
                  <Box flex="1" ml={[0, 4]} mt={[4, 0]}>
                    <Heading size="sm" mb={2}>Analyzed Image</Heading>
                    <Image 
                      src={`http://161.35.218.169:5000/output/${upload.analyses[0].result_path}`}
                      alt="Analyzed Image"
                      maxH="300px"
                      objectFit="contain"
                    />
                  </Box>
                )}
              </Flex>
              
              <Text fontSize="sm" mt={2}>Uploaded on: {new Date(upload.upload_date).toLocaleString()}</Text>
            </Box>
          ))
        )}
      </VStack>
    </Box>
  );
};

export default Dashboard;