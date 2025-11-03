import { colors, shadows } from '@styles/tokens';
import styled, { css } from 'styled-components';

// Tipos do componente Card
export interface CardProps {
    children: React.ReactNode;
    variant?: 'default' | 'elevated' | 'outlined' | 'gradient';
    padding?: 'sm' | 'md' | 'lg';
    hoverable?: boolean;
    className?: string;
}

// Card principal
const StyledCard = styled.div<CardProps>`
  border-radius: 12px;
  transition: all 200ms ease;
  overflow: hidden;

  /* Padding variants */
  ${props => {
        switch (props.padding) {
            case 'sm':
                return css`padding: 16px;`;
            case 'lg':
                return css`padding: 32px;`;
            case 'md':
            default:
                return css`padding: 24px;`;
        }
    }}

  /* Style variants */
  ${props => {
        switch (props.variant) {
            case 'elevated':
                return css`
          background: ${colors.gray[800]};
          box-shadow: ${shadows.xl};
          border: 1px solid ${colors.gray[700]};
        `;

            case 'outlined':
                return css`
          background: transparent;
          border: 2px solid ${colors.gray[700]};
        `;

            case 'gradient':
                return css`
          background: ${colors.gradients.card};
          border: 1px solid ${colors.gray[600]};
          box-shadow: ${shadows.lg};
        `;

            case 'default':
            default:
                return css`
          background: ${colors.gray[800]};
          border: 1px solid ${colors.gray[700]};
          box-shadow: ${shadows.card};
        `;
        }
    }}

  /* Hoverable effect */
  ${props => props.hoverable && css`
    cursor: pointer;
    
    &:hover {
      border-color: ${colors.gray[600]};
      box-shadow: ${shadows.lg};
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
    }
  `}

  /* Mobile adjustments */
  @media (max-width: 768px) {
    ${props => props.padding === 'lg' && css`
      padding: 20px;
    `}
    
    ${props => props.padding === 'md' && css`
      padding: 16px;
    `}
  }
`;

// Card Header
export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${colors.gray[700]};
`;

// Card Title
export const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${colors.gray[100]};
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 20px;
    height: 20px;
    color: ${colors.primary[400]};
  }
`;

// Card Description
export const CardDescription = styled.p`
  font-size: 14px;
  color: ${colors.gray[400]};
  margin-top: 4px;
`;

// Card Content
export const CardContent = styled.div`
  flex: 1;
`;

// Card Footer
export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid ${colors.gray[700]};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
`;

// Card Actions
export const CardActions = styled.div`
  display: flex;
  gap: 8px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const Card: React.FC<CardProps> = ({
    children,
    variant = 'default',
    padding = 'md',
    hoverable = false,
    className,
    ...props
}) => {
    return (
        <StyledCard
            variant={variant}
            padding={padding}
            hoverable={hoverable}
            className={className}
            {...props}
        >
            {children}
        </StyledCard>
    );
};

export default Card;



