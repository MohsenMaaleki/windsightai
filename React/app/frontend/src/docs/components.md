# WindSightAI Component Library Documentation

## Overview
This document provides comprehensive documentation for the WindSightAI component library, built with Chakra UI.

## Theme Configuration
The theme is configured in `src/theme/index.js` and provides consistent styling across the application. It includes:
- Custom color schemes
- Typography settings
- Spacing scales
- Component variants
- Responsive breakpoints

## Core Components

### Button
```jsx
import { Button } from '../components/common/Button';

// Usage
<Button variant="primary" size="lg">Click Me</Button>
```

Variants:
- primary: Main call-to-action buttons
- secondary: Less prominent actions
- outline: Bordered buttons
- ghost: Minimal styling

Sizes:
- sm: Small buttons
- md: Medium buttons (default)
- lg: Large buttons
- xl: Extra large buttons

### Input
```jsx
import { Input } from '../components/common/Input';

// Usage
<Input 
  placeholder="Enter text"
  size="lg"
  isRequired
/>
```

Features:
- Built-in error states
- Dark mode support
- Focus styles
- Placeholder styling

### Card
```jsx
import { Card } from '../components/common/Card';

// Usage
<Card p={6}>
  Content goes here
</Card>
```

Properties:
- Consistent padding
- Shadow effects
- Border radius
- Dark mode support

### Layout Components

#### Layout
```jsx
import { Layout } from '../components/layout/Layout';

// Usage
<Layout>
  <YourPageContent />
</Layout>
```

Features:
- Consistent page structure
- Responsive padding
- Header integration
- Container constraints

#### Grid
```jsx
import { Grid } from '../components/layout/Grid';

// Usage
<Grid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
  <GridItem />
</Grid>
```

#### Section
```jsx
import { Section } from '../components/layout/Section';

// Usage
<Section>
  <YourSectionContent />
</Section>
```

## Best Practices

1. Responsive Design
- Use responsive object syntax for properties
- Follow mobile-first approach
- Test across all breakpoints

2. Theme Usage
- Use theme tokens for colors
- Maintain spacing scale
- Follow typography hierarchy

3. Dark Mode
- Always use useColorModeValue for colors
- Test components in both modes
- Ensure sufficient contrast

4. Accessibility
- Include proper ARIA labels
- Maintain focus states
- Use semantic HTML

## Implementation Examples

### Form Implementation
```jsx
<VStack spacing={4}>
  <FormControl isRequired>
    <FormLabel>Email</FormLabel>
    <Input type="email" placeholder="Enter your email" />
  </FormControl>
  <Button type="submit" variant="primary">Submit</Button>
</VStack>
```

### Card Grid Implementation
```jsx
<Grid>
  <Card>
    <VStack spacing={4}>
      <Heading size="md">Card Title</Heading>
      <Text>Card content</Text>
    </VStack>
  </Card>
</Grid>
```

## Utilities

### Spacing
- Use theme spacing tokens
- Follow 4-point grid system
- Use responsive spacing when needed

### Colors
- Use semantic color names
- Maintain consistent contrast ratios
- Follow brand color palette

### Typography
- Use predefined font sizes
- Maintain heading hierarchy
- Follow responsive text guidelines