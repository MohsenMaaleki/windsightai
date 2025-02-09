// src/components/common/Spinner.js
import { Spinner as ChakraSpinner } from '@chakra-ui/react';

export const Spinner = (props) => {
  return (
    <ChakraSpinner
      thickness="3px"
      speed="0.65s"
      color="brand.500"
      {...props}
    />
  );
};