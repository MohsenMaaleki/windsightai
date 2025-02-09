// src/components/common/FileInput.js
import React, { useRef } from 'react';
import {
  Box,
  Input,
  Button,
  FormLabel,
  useColorModeValue,
  Text,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { FiUpload } from 'react-icons/fi';

export const FileInput = ({ 
  accept, 
  onChange, 
  placeholder = 'Choose a file...', 
  label,
  isRequired,
  ...props 
}) => {
  const inputRef = useRef(null);
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('green.50', 'green.900');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedText = useColorModeValue('gray.700', 'white');

  return (
    <Box width="100%">
      {label && (
        <FormLabel htmlFor="file-upload" color={textColor}>
          {label}
          {isRequired && <Text as="span" color="red.500" ml={1}>*</Text>}
        </FormLabel>
      )}
      <Input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onChange}
        display="none"
        id="file-upload"
        {...props}
      />
      <Button
        as="div"
        onClick={() => inputRef.current?.click()}
        width="100%"
        height="auto"
        py={4}
        border="2px dashed"
        borderColor={borderColor}
        bg="transparent"
        color={mutedText}
        transition="all 0.2s ease-in-out"
        _hover={{
          bg: hoverBg,
          opacity: 0.9,
          borderColor: 'green.200',
          color: 'gray.800'
        }}
        cursor="pointer"
      >
        <Flex direction="column" align="center" justify="center">
          <Icon as={FiUpload} w={6} h={6} mb={2} />
          <Text fontWeight="medium">{placeholder}</Text>
        </Flex>
      </Button>
    </Box>
  );
};