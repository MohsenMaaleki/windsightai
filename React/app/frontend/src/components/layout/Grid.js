import React from 'react';
import { SimpleGrid } from '@chakra-ui/react';

export const Grid = ({ children, columns = { base: 1, md: 2, lg: 3 }, spacing = 6, ...props }) => (
  <SimpleGrid
    columns={columns}
    spacing={spacing}
    {...props}
  >
    {children}
  </SimpleGrid>
); 