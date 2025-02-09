// src/components/common/Button.js
import { Button as ChakraButton, forwardRef } from '@chakra-ui/react';

export const Button = forwardRef(({ children, variant = 'primary', ...props }, ref) => {
  const getVariantStyles = (variant) => {
    const variants = {
      primary: {
        bg: 'brand.500',
        color: 'white',
        _hover: {
          bg: 'brand.600',
          _disabled: {
            bg: 'brand.500',
          },
        },
        _active: {
          bg: 'brand.700',
        },
      },
      secondary: {
        bg: 'white',
        color: 'brand.600',
        _hover: {
          bg: 'gray.100',
          _disabled: {
            bg: 'white',
          },
        },
        _active: {
          bg: 'gray.200',
        },
      },
      outline: {
        bg: 'transparent',
        color: 'white',
        border: '1px solid',
        borderColor: 'white',
        _hover: {
          bg: 'whiteAlpha.200',
          _disabled: {
            bg: 'transparent',
          },
        },
        _active: {
          bg: 'whiteAlpha.300',
        },
      },
      ghost: {
        bg: 'brand.500',
        color: 'white',
        _hover: {
          bg: 'brand.400',
          _disabled: {
            bg: 'brand.500',
          },
        },
        _active: {
          bg: 'brand.600',
        },
      },
    };

    return variants[variant] || variants.primary;
  };

  return (
    <ChakraButton
      ref={ref}
      fontWeight="medium"
      borderRadius="md"
      transition="all 0.2s"
      {...getVariantStyles(variant)}
      {...props}
    >
      {children}
    </ChakraButton>
  );
});