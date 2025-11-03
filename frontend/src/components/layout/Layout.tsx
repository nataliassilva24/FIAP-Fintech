import {
    DollarSign,
    Home,
    LogOut,
    Menu,
    Settings,
    Target,
    TrendingUp,
    Users,
    X
} from 'lucide-react';
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from '@components/ui/Button';
import { useAuth } from '@contexts/AuthContext';
import { colors, shadows, transitions } from '@styles/tokens';

// ============================================
// STYLED COMPONENTS - LAYOUT BTG
// ============================================

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${colors.gradients.primary};
`;

const Sidebar = styled.aside<{ isOpen: boolean }>`
  width: 280px;
  background: ${colors.gradients.card};
  border-right: 1px solid ${colors.gray[700]};
  box-shadow: ${shadows.lg};
  transition: transform ${transitions.normal};
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 1000;
  overflow-y: auto;

  @media (max-width: 1024px) {
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  }

  @media (min-width: 1025px) {
    position: relative;
    transform: translateX(0);
  }
`;

const SidebarHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${colors.gray[700]};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  .logo-icon {
    width: 28px;
    height: 28px;
    color: ${colors.primary[400]};
  }
`;

const LogoText = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: ${colors.gray[100]};
  
  .highlight {
    color: ${colors.primary[400]};
  }
`;

const CloseButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${colors.gray[400]};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  
  &:hover {
    color: ${colors.gray[300]};
    background: ${colors.gray[800]};
  }

  @media (max-width: 1024px) {
    display: block;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Navigation = styled.nav`
  padding: 24px 0;
`;

const NavSection = styled.div`
  margin-bottom: 32px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const NavSectionTitle = styled.h3`
  font-size: 12px;
  font-weight: 600;
  color: ${colors.gray[400]};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
  padding: 0 24px;
`;

const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  margin: 4px 0;
`;

const NavLinkStyled = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  color: ${colors.gray[300]};
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all ${transitions.fast};
  position: relative;

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  &:hover {
    color: ${colors.gray[100]};
    background: ${colors.gray[800]};
  }

  &.active {
    color: ${colors.primary[300]};
    background: ${colors.primary[900]};
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: ${colors.primary[400]};
    }

    svg {
      color: ${colors.primary[400]};
    }
  }
`;

const UserSection = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px;
  border-top: 1px solid ${colors.gray[700]};
  background: ${colors.gray[900]};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: ${colors.primary[600]};
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 16px;
  }
  
  .user-details {
    flex: 1;
    min-width: 0;
    
    .name {
      font-size: 14px;
      font-weight: 600;
      color: ${colors.gray[100]};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .email {
      font-size: 12px;
      color: ${colors.gray[400]};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

const UserActions = styled.div`
  display: flex;
  gap: 8px;
`;

// Main Content Area
const MainContent = styled.main<{ sidebarOpen: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  
  @media (min-width: 1025px) {
    margin-left: 280px;
  }

  @media (max-width: 1024px) {
    margin-left: 0;
  }
`;

const TopBar = styled.header`
  height: 64px;
  background: ${colors.gray[900]};
  border-bottom: 1px solid ${colors.gray[700]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: ${shadows.sm};
  position: sticky;
  top: 0;
  z-index: 100;

  @media (max-width: 1024px) {
    padding: 0 16px;
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${colors.gray[400]};
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  
  &:hover {
    color: ${colors.gray[300]};
    background: ${colors.gray[800]};
  }

  @media (max-width: 1024px) {
    display: block;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const PageContent = styled.div`
  flex: 1;
  padding: 24px;
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const Overlay = styled.div<{ show: boolean }>`
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: ${props => props.show ? 1 : 0};
  pointer-events: ${props => props.show ? 'auto' : 'none'};
  transition: opacity ${transitions.normal};

  @media (max-width: 1024px) {
    display: block;
  }
`;

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Links de navegação
    const navigationLinks = [
        {
            section: 'Principal',
            links: [
                { to: '/dashboard', icon: Home, label: 'Dashboard' },
                { to: '/usuarios', icon: Users, label: 'Usuários' },
            ]
        },
        {
            section: 'Financeiro',
            links: [
                { to: '/transacoes', icon: DollarSign, label: 'Transações' },
                { to: '/investimentos', icon: TrendingUp, label: 'Investimentos' },
                { to: '/metas', icon: Target, label: 'Metas' },
            ]
        }
    ];

    const handleLogout = () => {
        logout();
        navigate('/home');
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    // Gerar iniciais do usuário para avatar
    const getUserInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <LayoutContainer>
            {/* Overlay para mobile */}
            <Overlay show={sidebarOpen} onClick={closeSidebar} />

            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen}>
                <SidebarHeader>
                    <Logo>
                        <TrendingUp className="logo-icon" />
                        <LogoText>
                            FIAP <span className="highlight">Fintech</span>
                        </LogoText>
                    </Logo>
                    <CloseButton onClick={closeSidebar}>
                        <X />
                    </CloseButton>
                </SidebarHeader>

                <Navigation>
                    {navigationLinks.map((section, index) => (
                        <NavSection key={index}>
                            <NavSectionTitle>{section.section}</NavSectionTitle>
                            <NavList>
                                {section.links.map((link) => (
                                    <NavItem key={link.to}>
                                        <NavLinkStyled
                                            to={link.to}
                                            onClick={closeSidebar}
                                        >
                                            <link.icon />
                                            {link.label}
                                        </NavLinkStyled>
                                    </NavItem>
                                ))}
                            </NavList>
                        </NavSection>
                    ))}
                </Navigation>

                {/* Informações do usuário */}
                <UserSection>
                    <UserInfo>
                        <div className="avatar">
                            {user ? getUserInitials(user.nomeCompleto) : 'U'}
                        </div>
                        <div className="user-details">
                            <div className="name">
                                {user?.nomeCompleto || 'Usuário'}
                            </div>
                            <div className="email">
                                {user?.email || 'email@exemplo.com'}
                            </div>
                        </div>
                    </UserInfo>

                    <UserActions>
                        <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<Settings />}
                            onClick={() => navigate('/configuracoes')}
                        >
                            Config
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<LogOut />}
                            onClick={handleLogout}
                        >
                            Sair
                        </Button>
                    </UserActions>
                </UserSection>
            </Sidebar>

            {/* Conteúdo principal */}
            <MainContent sidebarOpen={sidebarOpen}>
                <TopBar>
                    <MenuButton onClick={toggleSidebar}>
                        <Menu />
                    </MenuButton>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '14px', color: colors.gray[400] }}>
                            {new Date().toLocaleDateString('pt-BR', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                    </div>
                </TopBar>

                <PageContent>
                    {children}
                </PageContent>
            </MainContent>
        </LayoutContainer>
    );
};

export default Layout;



