import { Container as ChakraContainer } from '@chakra-ui/react';

export const Container = ({ children, ...props }) => {
  return (
    <ChakraContainer maxW="container.xl" px={[4, 6, 8]} {...props}>
      {children}
    </ChakraContainer>
  );
};