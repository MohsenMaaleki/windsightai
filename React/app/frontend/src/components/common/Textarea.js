// src/components/common/Textarea.js
import { Textarea as ChakraTextarea, forwardRef, useColorModeValue } from '@chakra-ui/react';

export const Textarea = forwardRef((props, ref) => {
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const focusBorderColor = useColorModeValue('brand.500', 'brand.400');
  const bgColor = useColorModeValue('white', 'gray.800');
  const placeholderColor = useColorModeValue('gray.600', 'gray.400');
  const textColor = useColorModeValue('gray.800', 'gray.100');

  return (
    <ChakraTextarea
      ref={ref}
      borderColor={borderColor}
      focusBorderColor={focusBorderColor}
      bg={bgColor}
      color={textColor}
      _placeholder={{ color: placeholderColor }}
      size="lg"
      {...props}
      sx={{
        '&:focus-visible': {
          boxShadow: 'none',
          borderColor: focusBorderColor,
        },
      }}
    />
  );
});
// finished