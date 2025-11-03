import { Eye, EyeOff, Lock, Mail, TrendingUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Importar componentes e serviços
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';
import { Input } from '@components/ui/Input';
import { useAuth } from '@contexts/AuthContext';
import { colors, shadows, typography } from '@styles/tokens';
import { LoginForm } from '@types/entities';
import toast from 'react-hot-toast';

// ============================================
// STYLED COMPONENTS - DESIGN BTG
// ============================================

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${colors.gradients.primary};
  padding: 20px;
  
  /* Overlay pattern subtle */
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 420px;
  background: ${colors.gradients.card};
  border: 1px solid ${colors.gray[600]};
  box-shadow: ${shadows['2xl']};
  backdrop-filter: blur(10px);
  
  @media (max-width: 480px) {
    max-width: 100%;
    margin: 0;
    border-radius: 0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
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

const LoginFormContainer = styled.form`
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

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${colors.gray[400]};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  
  &:hover {
    color: ${colors.gray[300]};
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const LoginOptions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 16px 0;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
`;

const RememberMe = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${typography.fontSize.sm};
  color: ${colors.gray[400]};
  cursor: pointer;
  
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: ${colors.primary[500]};
  }
`;

const ForgotPassword = styled(Link)`
  font-size: ${typography.fontSize.sm};
  color: ${colors.primary[400]};
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 24px 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${colors.gray[700]};
  }
  
  span {
    padding: 0 16px;
    font-size: ${typography.fontSize.sm};
    color: ${colors.gray[500]};
  }
`;

const RegisterLink = styled.div`
  text-align: center;
  margin-top: 24px;
  font-size: ${typography.fontSize.sm};
  color: ${colors.gray[400]};
  
  a {
    color: ${colors.primary[400]};
    font-weight: 500;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const DemoSection = styled.div`
  margin-top: 24px;
  padding: 16px;
  background: ${colors.gray[900]};
  border: 1px solid ${colors.gray[700]};
  border-radius: 8px;
`;

const DemoTitle = styled.h4`
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.gray[200]};
  margin-bottom: 8px;
`;

const DemoCredentials = styled.div`
  font-size: ${typography.fontSize.xs};
  color: ${colors.gray[400]};
  font-family: ${typography.fontFamily.mono};
  
  .credential {
    margin: 4px 0;
  }
`;

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export const LoginPage: React.FC = () => {
    // Hooks e state
    const { login, isAuthenticated, isLoading, error, clearError } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<LoginForm>({
        email: '',
        senha: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    // Redirect se já autenticado
    useEffect(() => {
        if (isAuthenticated && !isLoading) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, isLoading, navigate]);

    // Limpar erro quando começar a digitar
    useEffect(() => {
        if (error) {
            clearError();
        }
    }, [formData.email, formData.senha, error, clearError]);

    // Handler para mudança nos inputs
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handler para submit do formulário
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.senha) {
            toast.error('Preencha todos os campos obrigatórios');
            return;
        }

        setIsSubmitting(true);

        try {
            const success = await login(formData);

            if (success) {
                // Se "Lembrar-me" estiver marcado, salvar preferência
                if (rememberMe) {
                    localStorage.setItem('remember_email', formData.email);
                } else {
                    localStorage.removeItem('remember_email');
                }

                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Erro no login:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Carregar email salvo (se existir)
    useEffect(() => {
        const savedEmail = localStorage.getItem('remember_email');
        if (savedEmail) {
            setFormData(prev => ({ ...prev, email: savedEmail }));
            setRememberMe(true);
        }
    }, []);

    // Função para usar credenciais de demo
    const useDemoCredentials = () => {
        setFormData({
            email: 'joao.silva@email.com',
            senha: 'senha123'
        });
        toast.info('Credenciais de demo preenchidas');
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
                <LoginFormContainer onSubmit={handleSubmit}>
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
                        autoComplete="email"
                        disabled={isSubmitting}
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
                            autoComplete="current-password"
                            disabled={isSubmitting}
                        />
                        <PasswordToggle
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isSubmitting}
                        >
                            {showPassword ? <EyeOff /> : <Eye />}
                        </PasswordToggle>
                    </div>

                    <LoginOptions>
                        <RememberMe>
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                disabled={isSubmitting}
                            />
                            Lembrar-me
                        </RememberMe>

                        <ForgotPassword to="/forgot-password">
                            Esqueceu sua senha?
                        </ForgotPassword>
                    </LoginOptions>

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        isLoading={isSubmitting}
                        disabled={isSubmitting || !formData.email || !formData.senha}
                    >
                        {isSubmitting ? 'Entrando...' : 'Entrar'}
                    </Button>
                </LoginFormContainer>

                {/* Divider */}
                <Divider>
                    <span>ou</span>
                </Divider>

                {/* Demo Section */}
                <DemoSection>
                    <DemoTitle>🧪 Dados para Demonstração</DemoTitle>
                    <DemoCredentials>
                        <div className="credential">📧 joao.silva@email.com</div>
                        <div className="credential">🔒 senha123</div>
                    </DemoCredentials>

                    <Button
                        variant="outline"
                        size="sm"
                        fullWidth
                        onClick={useDemoCredentials}
                        disabled={isSubmitting}
                        style={{ marginTop: '12px' }}
                    >
                        Usar Credenciais Demo
                    </Button>
                </DemoSection>

                {/* Link para registro */}
                <RegisterLink>
                    Não tem uma conta?{' '}
                    <Link to="/register">
                        Criar conta gratuita
                    </Link>
                </RegisterLink>
            </LoginCard>
        </LoginContainer>
    );
};

export default LoginPage;
