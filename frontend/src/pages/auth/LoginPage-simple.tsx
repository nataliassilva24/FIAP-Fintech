import { Eye, EyeOff, Lock, Mail, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Importar componentes
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';
import { Input } from '@components/ui/Input';
import { colors, shadows, typography } from '@styles/tokens';

// ============================================
// STYLED COMPONENTS - DESIGN BTG (SIMPLIFICADO)
// ============================================

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${colors.gradients.primary};
  padding: 20px;
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 420px;
  background: ${colors.gradients.card};
  border: 1px solid ${colors.gray[600]};
  box-shadow: ${shadows['2xl']};
`;

const LogoSection = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 8px;
  
  .logo-icon {
    width: 32px;
    height: 32px;
    color: ${colors.primary[400]};
  }
`;

const LogoTitle = styled.h1`
  font-size: ${typography.fontSize['3xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.gray[100]};
  margin: 0;
  
  .highlight {
    color: ${colors.primary[400]};
  }
`;

const LogoSubtitle = styled.p`
  font-size: ${typography.fontSize.sm};
  color: ${colors.gray[400]};
  margin: 8px 0 0 0;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormTitle = styled.h2`
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.gray[100]};
  text-align: center;
  margin-bottom: 8px;
`;

const FormSubtitle = styled.p`
  font-size: ${typography.fontSize.sm};
  color: ${colors.gray[400]};
  text-align: center;
  margin-bottom: 24px;
`;

const DemoSection = styled.div`
  margin-top: 24px;
  padding: 16px;
  background: ${colors.gray[900]};
  border: 1px solid ${colors.gray[700]};
  border-radius: 8px;
  text-align: center;
`;

const DemoTitle = styled.h4`
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.gray[200]};
  margin-bottom: 8px;
`;

// ============================================
// COMPONENTE SIMPLIFICADO
// ============================================

export const LoginPage: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        senha: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Demo: Login tentado com ${formData.email}`);
    };

    const useDemoCredentials = () => {
        setFormData({
            email: 'joao.silva@email.com',
            senha: 'senha123'
        });
    };

    return (
        <LoginContainer>
            <LoginCard padding="lg">
                {/* Logo e Header */}
                <LogoSection>
                    <Logo>
                        <TrendingUp className="logo-icon" />
                        <LogoTitle>
                            FIAP <span className="highlight">Fintech</span>
                        </LogoTitle>
                    </Logo>
                    <LogoSubtitle>
                        Sua gestão financeira inteligente
                    </LogoSubtitle>
                </LogoSection>

                {/* Título do formulário */}
                <FormTitle>Entrar na sua conta</FormTitle>
                <FormSubtitle>
                    Acesse sua carteira digital e gerencie seus investimentos
                </FormSubtitle>

                {/* Formulário de login */}
                <FormContainer onSubmit={handleSubmit}>
                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="seu.email@exemplo.com"
                        leftIcon={<Mail />}
                        required
                        fullWidth
                    />

                    <div style={{ position: 'relative' }}>
                        <Input
                            label="Senha"
                            type={showPassword ? 'text' : 'password'}
                            name="senha"
                            value={formData.senha}
                            onChange={handleInputChange}
                            placeholder="Digite sua senha"
                            leftIcon={<Lock />}
                            required
                            fullWidth
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute',
                                right: '12px',
                                top: '32px',
                                background: 'none',
                                border: 'none',
                                color: colors.gray[400],
                                cursor: 'pointer',
                                padding: '4px',
                            }}
                        >
                            {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                    >
                        Entrar
                    </Button>
                </FormContainer>

                {/* Demo Section */}
                <DemoSection>
                    <DemoTitle>🧪 Demonstração FIAP</DemoTitle>
                    <div style={{ fontSize: '12px', color: colors.gray[400], marginBottom: '12px' }}>
                        <div>📧 joao.silva@email.com</div>
                        <div>🔒 senha123</div>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        fullWidth
                        onClick={useDemoCredentials}
                    >
                        Preencher Demo
                    </Button>
                </DemoSection>

                {/* Link para home */}
                <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: colors.gray[400] }}>
                    <Link to="/home" style={{ color: colors.primary[400] }}>
                        ← Voltar para página inicial
                    </Link>
                </div>
            </LoginCard>
        </LoginContainer>
    );
};

export default LoginPage;



