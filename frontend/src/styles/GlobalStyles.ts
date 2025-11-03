import styled, { createGlobalStyle } from 'styled-components';
import { colors, shadows, typography } from './tokens';

export const GlobalStyles = createGlobalStyle`
  /* Reset e base styles */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    height: 100%;
    scroll-behavior: smooth;
  }

  body {
    height: 100%;
    font-family: ${typography.fontFamily.primary};
    font-size: ${typography.fontSize.base};
    font-weight: ${typography.fontWeight.normal};
    line-height: ${typography.lineHeight.normal};
    background: ${colors.gradients.primary};
    color: ${colors.gray[100]};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Links */
  a {
    color: ${colors.primary[400]};
    text-decoration: none;
    transition: color 200ms ease;

    &:hover {
      color: ${colors.primary[300]};
    }

    &:focus {
      outline: 2px solid ${colors.primary[500]};
      outline-offset: 2px;
      border-radius: 2px;
    }
  }

  /* Inputs */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }

  /* Buttons */
  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
    
    &:focus {
      outline: 2px solid ${colors.primary[500]};
      outline-offset: 2px;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  /* Scrollbar personalizada (BTG Style) */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${colors.gray[800]};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${colors.gray[600]};
    border-radius: 4px;
    
    &:hover {
      background: ${colors.gray[500]};
    }
  }

  /* Selection */
  ::selection {
    background: ${colors.primary[600]};
    color: white;
  }

  /* Focus styles */
  .focus-visible {
    outline: 2px solid ${colors.primary[500]};
    outline-offset: 2px;
  }

  /* Utility classes */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  /* Animation utilities */
  .fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }

  .slide-up {
    animation: slideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  @keyframes fadeIn {
    from { 
      opacity: 0;
    }
    to { 
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* BTG Loading animation */
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  /* Responsive font sizes */
  @media (max-width: 768px) {
    body {
      font-size: ${typography.fontSize.sm};
    }
  }

  /* Print styles */
  @media print {
    * {
      background: white !important;
      color: black !important;
      box-shadow: none !important;
    }
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    * {
      border-color: currentColor;
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;

// Styled components utilitários
export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

export const Card = styled.div`
  background: ${colors.gradients.card};
  border: 1px solid ${colors.gray[700]};
  border-radius: 12px;
  padding: 24px;
  box-shadow: ${shadows.card};
  transition: all 200ms ease;

  &:hover {
    border-color: ${colors.gray[600]};
    box-shadow: ${shadows.lg};
  }
`;

export const FlexRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Grid = styled.div<{ columns?: number; gap?: string }>`
  display: grid;
  grid-template-columns: repeat(${props => props.columns || 1}, 1fr);
  gap: ${props => props.gap || '20px'};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;



