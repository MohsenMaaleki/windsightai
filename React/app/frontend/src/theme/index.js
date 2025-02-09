import { extendTheme } from '@chakra-ui/react';
import { colors } from './foundations/colors';
import { Button } from '../components/common/Button';

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors,
  styles: {
    global: () => ({
      'html, body': {
        background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #3B82F6 100%)',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        margin: 0,
        padding: 0,
      },
      '#root': {
        minHeight: '100vh',
      },
      '.card-glass': {
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        borderRadius: 'lg',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
      'h1, h2': {
        color: 'white',
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
        letterSpacing: '0.5px',
      },
      '.feature-title': {
        color: '#F0F9FF',
        fontWeight: 'bold',
        fontSize: 'xl',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
      },
      '.feature-description': {
        color: '#E0F7FF',
        fontSize: 'md',
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.15)',
      },
      '.highlight-text': {
        color: '#BAE6FD',
        fontWeight: 'semibold',
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
      },
      '.section-title': {
        color: '#F0F9FF',
        fontWeight: 'bold',
        fontSize: '2xl',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
      },
      '.gradient-text': {
        backgroundClip: 'text',
        backgroundImage: 'linear-gradient(135deg, #F0F9FF 0%, #60A5FA 50%, #93C5FD 100%)',
        color: 'transparent',
        fontWeight: 'bold',
        textShadow: 'none',
        animation: 'shimmer 2s infinite linear',
      },
    }),
  },
  components: {
    Button,
  },
});

export default theme;