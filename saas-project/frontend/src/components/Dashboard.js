import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, VStack, Heading, Input, Button, Image, Text, HStack, Spinner, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Flex } from '@chakra-ui/react';

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [analyzing, setAnalyzing] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchUploads();
  }, []);

  const fetchUploads = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/uploads');
      setUploads(response.data);
    } catch (error) {
      console.error('Error fetching uploads:', error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
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
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setFile(null);
      setPreview(null);
      fetchUploads();
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleAnalyze = async (filename) => {
    setAnalyzing(prev => ({ ...prev, [filename]: true }));
    try {
      const response = await axios.post(`http://localhost:5000/api/analyze/${filename}`);
      fetchUploads();
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setAnalyzing(prev => ({ ...prev, [filename]: false }));
    }
  };

  const handleViewResult = (filename) => {
    setSelectedImage(`http://localhost:5000/output/${filename}`);
  };

  return (
    <Box maxW="6xl" mx="auto" mt={10}>
      <Heading mb={5}>Dashboard</Heading>
      <VStack spacing={4} align="stretch">
        <Input type="file" onChange={handleFileChange} accept="image/*,video/*" />
        {preview && (
          <Box mt={4}>
            {file.type.startsWith('image/') ? (
              <Image src={preview} alt="Preview" maxH="200px" />
            ) : (
              <video src={preview} controls maxHeight="200px" />
            )}
          </Box>
        )}
        <Button onClick={handleUpload} colorScheme="blue" isDisabled={!file}>
          Upload
        </Button>
        <Heading size="md" mt={8}>Your Uploads</Heading>
        {uploads.map((upload, index) => (
          <Box key={index} borderWidth="1px" borderRadius="lg" p={4} mb={4}>
            <Flex justifyContent="space-between" alignItems="center" mb={4}>
              <Text>{upload.filename}</Text>
              <Button 
                onClick={() => handleAnalyze(upload.filename)} 
                colorScheme="green" 
                isDisabled={upload.analyzed || analyzing[upload.filename]}
              >
                {analyzing[upload.filename] ? (
                  <Spinner size="sm" mr={2} />
                ) : null}
                {upload.analyzed ? 'Re-Analyze' : (analyzing[upload.filename] ? 'Analyzing...' : 'Analyze')}
              </Button>
            </Flex>
            {upload.analyzed && (
              <Flex justifyContent="space-between" alignItems="center">
                <Image 
                  src={`http://localhost:5000/output/${upload.prediction}`} 
                  alt="Analysis Result" 
                  maxH="150px"
                  cursor="pointer"
                  onClick={() => handleViewResult(upload.prediction)}
                />
                <Button onClick={() => handleViewResult(upload.prediction)} colorScheme="blue">
                  View Larger
                </Button>
              </Flex>
            )}
          </Box>
        ))}
      </VStack>

      <Modal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Analysis Result</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image src={selectedImage} alt="Analysis Result" maxW="100%" />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Dashboard;