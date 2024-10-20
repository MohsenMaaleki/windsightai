import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, VStack, Heading, Input, Button, Image, Text } from '@chakra-ui/react';

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploads, setUploads] = useState([]);

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

  return (
    <Box maxW="4xl" mx="auto" mt={10}>
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
          <Text key={index}>{upload.filename}</Text>
        ))}
      </VStack>
    </Box>
  );
};

export default Dashboard;