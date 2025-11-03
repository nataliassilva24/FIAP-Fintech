import { colors, transitions } from '@styles/tokens';
import styled, { css } from 'styled-components';

// Tipos do componente Input
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
    variant?: 'default' | 'filled';
}

// Container do input
const InputContainer = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  
  ${props => props.fullWidth && css`
    width: 100%;
  `}
`;

// Label do input
const InputLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${colors.gray[200]};
  margin-bottom: 4px;

  &.required::after {
    content: ' *';
    color: ${colors.error[400]};
  }
`;

// Wrapper do input com ícones
const InputWrapper = styled.div<{ hasError?: boolean; hasLeftIcon?: boolean; hasRightIcon?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;

  /* Ícone à esquerda */
  ${props => props.hasLeftIcon && css`
    .left-icon {
      position: absolute;
      left: 12px;
      z-index: 1;
      color: ${colors.gray[400]};
      width: 16px;
      height: 16px;
      pointer-events: none;
    }
  `}

  /* Ícone à direita */
  ${props => props.hasRightIcon && css`
    .right-icon {
      position: absolute;
      right: 12px;
      z-index: 1;
      color: ${colors.gray[400]};
      width: 16px;
      height: 16px;
      pointer-events: none;
    }
  `}
`;

// Input estilizado
const StyledInput = styled.input<InputProps>`
  width: 100%;
  height: 44px;
  padding: 12px 16px;
  background: ${props => props.variant === 'filled' ? colors.gray[800] : 'transparent'};
  border: 1px solid ${props => props.error ? colors.error[500] : colors.gray[600]};
  border-radius: 8px;
  font-size: 15px;
  color: ${colors.gray[100]};
  transition: all ${transitions.normal};
  outline: none;

  /* Ajustar padding quando há ícones */
  ${props => props.leftIcon && css`
    padding-left: 44px;
  `}

  ${props => props.rightIcon && css`
    padding-right: 44px;
  `}

  /* Placeholder */
  &::placeholder {
    color: ${colors.gray[400]};
  }

  /* Focus state */
  &:focus {
    border-color: ${colors.primary[400]};
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    background: ${colors.gray[900]};
  }

  /* Hover state */
  &:hover:not(:focus):not(:disabled) {
    border-color: ${colors.gray[500]};
  }

  /* Error state */
  ${props => props.error && css`
    border-color: ${colors.error[500]};
    
    &:focus {
      border-color: ${colors.error[400]};
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  `}

  /* Disabled state */
  &:disabled {
    background: ${colors.gray[900]};
    border-color: ${colors.gray[700]};
    color: ${colors.gray[500]};
    cursor: not-allowed;
  }

  /* Auto-fill styles */
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0px 1000px ${colors.gray[800]} inset;
    -webkit-text-fill-color: ${colors.gray[100]};
    border-color: ${colors.primary[400]};
  }

  /* Input types específicos */
  &[type="number"] {
    -moz-appearance: textfield;
    
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  &[type="date"] {
    color-scheme: dark;
  }

  &[type="password"] {
    font-family: inherit;
    letter-spacing: 0.05em;
  }
`;

// Mensagem de erro
const ErrorMessage = styled.span`
  font-size: 12px;
  color: ${colors.error[400]};
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;

  svg {
    width: 12px;
    height: 12px;
    flex-shrink: 0;
  }
`;

// Mensagem de ajuda
const HelperText = styled.span`
  font-size: 12px;
  color: ${colors.gray[400]};
  margin-top: 2px;
`;

export const Input: React.FC<InputProps> = ({
    label,
    error,
    leftIcon,
    rightIcon,
    fullWidth = false,
    variant = 'default',
    required,
    id,
    className,
    ...props
}) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <InputContainer fullWidth={fullWidth} className={className}>
            {label && (
                <InputLabel htmlFor={inputId} className={required ? 'required' : ''}>
                    {label}
                </InputLabel>
            )}

            <InputWrapper
                hasError={!!error}
                hasLeftIcon={!!leftIcon}
                hasRightIcon={!!rightIcon}
            >
                {leftIcon && <span className="left-icon">{leftIcon}</span>}

                <StyledInput
                    id={inputId}
                    variant={variant}
                    error={error}
                    leftIcon={leftIcon}
                    rightIcon={rightIcon}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${inputId}-error` : undefined}
                    {...props}
                />

                {rightIcon && <span className="right-icon">{rightIcon}</span>}
            </InputWrapper>

            {error && (
                <ErrorMessage id={`${inputId}-error`} role="alert">
                    ⚠️ {error}
                </ErrorMessage>
            )}
        </InputContainer>
    );
};

export default Input;



