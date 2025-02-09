// src/components/common/Select.js
import { Select as ChakraSelect, forwardRef, useColorModeValue } from '@chakra-ui/react';

export const Select = forwardRef((props, ref) => {
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const focusBorderColor = useColorModeValue('brand.500', 'brand.400');
  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <ChakraSelect
      ref={ref}
      borderColor={borderColor}
      focusBorderColor={focusBorderColor}
      bg={bgColor}
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

