import { colors, shadows, transitions } from '@styles/tokens';
import styled, { css } from 'styled-components';

// Tipos do componente Button
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    fullWidth?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    children: React.ReactNode;
}

// Estilos do Button inspirado BTG
const StyledButton = styled.button<ButtonProps>`
  /* Base styles */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 8px;
  font-weight: 600;
  font-family: inherit;
  transition: all ${transitions.normal};
  cursor: pointer;
  border: 1px solid transparent;
  position: relative;
  text-align: center;
  text-decoration: none;
  outline: none;

  /* Prevent selection */
  -webkit-user-select: none;
  user-select: none;

  /* Focus styles */
  &:focus-visible {
    box-shadow: ${shadows.focus};
  }

  /* Disabled state */
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    pointer-events: none;
  }

  /* Full width */
  ${props => props.fullWidth && css`
    width: 100%;
  `}

  /* Size variants */
  ${props => {
        switch (props.size) {
            case 'sm':
                return css`
          height: 32px;
          padding: 0 12px;
          font-size: 14px;
        `;
            case 'lg':
                return css`
          height: 48px;
          padding: 0 32px;
          font-size: 16px;
        `;
            case 'md':
            default:
                return css`
          height: 40px;
          padding: 0 24px;
          font-size: 15px;
        `;
        }
    }}

  /* Variant styles */
  ${props => {
        switch (props.variant) {
            case 'secondary':
                return css`
          background: ${colors.gray[700]};
          color: ${colors.gray[100]};
          border-color: ${colors.gray[600]};

          &:hover:not(:disabled) {
            background: ${colors.gray[600]};
            border-color: ${colors.gray[500]};
          }

          &:active {
            background: ${colors.gray[800]};
          }
        `;

            case 'outline':
                return css`
          background: transparent;
          color: ${colors.primary[400]};
          border-color: ${colors.primary[400]};

          &:hover:not(:disabled) {
            background: ${colors.primary[900]};
            border-color: ${colors.primary[300]};
            color: ${colors.primary[300]};
          }

          &:active {
            background: ${colors.primary[800]};
          }
        `;

            case 'ghost':
                return css`
          background: transparent;
          color: ${colors.gray[400]};
          border-color: transparent;

          &:hover:not(:disabled) {
            background: ${colors.gray[800]};
            color: ${colors.gray[200]};
          }

          &:active {
            background: ${colors.gray[700]};
          }
        `;

            case 'danger':
                return css`
          background: ${colors.gradients.primary};
          background: linear-gradient(135deg, ${colors.error[600]} 0%, ${colors.error[500]} 100%);
          color: white;
          border-color: ${colors.error[500]};

          &:hover:not(:disabled) {
            background: linear-gradient(135deg, ${colors.error[700]} 0%, ${colors.error[600]} 100%);
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
          }

          &:active {
            background: ${colors.error[800]};
          }
        `;

            case 'primary':
            default:
                return css`
          background: ${colors.gradients.button};
          color: white;
          border-color: ${colors.primary[500]};
          box-shadow: ${shadows.button};

          &:hover:not(:disabled) {
            background: linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.primary[500]} 100%);
            box-shadow: 0 6px 16px rgba(79, 70, 229, 0.4);
            transform: translateY(-1px);
          }

          &:active {
            background: ${colors.primary[700]};
            transform: translateY(0);
            box-shadow: ${shadows.sm};
          }
        `;
        }
    }}

  /* Loading state */
  ${props => props.isLoading && css`
    cursor: wait;
    
    &::before {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
  `}

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  /* Icon adjustments */
  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  /* Mobile adjustments */
  @media (max-width: 768px) {
    ${props => props.size === 'lg' && css`
      height: 44px;
      font-size: 15px;
    `}
    
    ${props => props.size === 'md' && css`
      height: 40px;
      font-size: 14px;
    `}
  }
`;

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    disabled,
    ...props
}) => {
    return (
        <StyledButton
            variant={variant}
            size={size}
            isLoading={isLoading}
            fullWidth={fullWidth}
            disabled={disabled || isLoading}
            {...props}
        >
            {!isLoading && leftIcon && leftIcon}
            {!isLoading && children}
            {!isLoading && rightIcon && rightIcon}
        </StyledButton>
    );
};

export default Button;



