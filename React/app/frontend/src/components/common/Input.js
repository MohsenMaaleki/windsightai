import React from 'react';
import { Input as ChakraInput, forwardRef, useColorModeValue } from '@chakra-ui/react';

export const Input = forwardRef((props, ref) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const placeholderColor = useColorModeValue('gray.400', 'gray.500');

  return (
    <ChakraInput
      ref={ref}
      bg={bgColor}
      color={textColor}
      _placeholder={{ color: placeholderColor }}
      borderColor="brand.200"
      _hover={{ borderColor: 'brand.300' }}
      _focus={{ borderColor: 'brand.500', boxShadow: 'none' }}
      {...props}
    />
  );
});