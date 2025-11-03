import { Edit, Eye, Plus, Search, Trash2, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';
import { Input } from '@components/ui/Input';
import { useAuth } from '@contexts/AuthContext';
import { usuariosAPI } from '@services/api';
import { colors, transitions, typography } from '@styles/tokens';
import { GeneroLabels, Usuario } from '@types/entities';
import toast from 'react-hot-toast';

// ============================================
// STYLED COMPONENTS
// ============================================

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: between;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
`;

const PageTitle = styled.div`
  flex: 1;
  
  h1 {
    font-size: ${typography.fontSize['3xl']};
    font-weight: ${typography.fontWeight.bold};
    color: ${colors.gray[100]};
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 12px;
    
    svg {
      color: ${colors.primary[400]};
    }
  }
  
  p {
    color: ${colors.gray[400]};
  }
`;

const PageActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const FiltersSection = styled.div`
  margin-bottom: 24px;
  display: flex;
  gap: 16px;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const UsersTable = styled.div`
  background: ${colors.gradients.card};
  border: 1px solid ${colors.gray[700]};
  border-radius: 12px;
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 120px 100px 120px;
  gap: 16px;
  padding: 16px 24px;
  background: ${colors.gray[800]};
  border-bottom: 1px solid ${colors.gray[700]};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.gray[300]};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr 80px;
    gap: 12px;
    padding: 12px 16px;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 120px 100px 120px;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid ${colors.gray[700]};
  transition: background ${transitions.fast};
  
  &:hover {
    background: ${colors.gray[800]};
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr 80px;
    gap: 12px;
    padding: 12px 16px;
  }
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: ${colors.primary[600]};
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 12px;
    }
    
    .details {
      .name {
        font-size: ${typography.fontSize.sm};
        font-weight: ${typography.fontWeight.medium};
        color: ${colors.gray[100]};
        margin-bottom: 2px;
      }
      
      .email {
        font-size: ${typography.fontSize.xs};
        color: ${colors.gray[400]};
      }
    }
  }
  
  .status {
    display: inline-flex;
    align-items: center;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: ${typography.fontSize.xs};
    font-weight: ${typography.fontWeight.medium};
    
    &.ativo {
      background: ${colors.success[900]};
      color: ${colors.success[300]};
    }
    
    &.inativo {
      background: ${colors.gray[800]};
      color: ${colors.gray[400]};
    }
  }
  
  .actions {
    display: flex;
    gap: 4px;
    justify-content: flex-end;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${colors.gray[400]};
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  transition: all ${transitions.fast};
  
  &:hover {
    background: ${colors.gray[700]};
    color: ${colors.gray[200]};
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${colors.gray[400]};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  
  .empty-icon {
    width: 48px;
    height: 48px;
    color: ${colors.gray[500]};
    margin: 0 auto 16px;
  }
  
  h3 {
    color: ${colors.gray[300]};
    margin-bottom: 8px;
  }
  
  p {
    color: ${colors.gray[400]};
    margin-bottom: 20px;
  }
`;

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export const UsuariosPage: React.FC = () => {
    const { user } = useAuth();
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Carregar usuários
    useEffect(() => {
        const loadUsuarios = async () => {
            try {
                setIsLoading(true);
                const data = await usuariosAPI.listar();
                setUsuarios(data);
            } catch (error) {
                console.error('Erro ao carregar usuários:', error);
                toast.error('Erro ao carregar lista de usuários');
            } finally {
                setIsLoading(false);
            }
        };

        loadUsuarios();
    }, []);

    // Filtrar usuários
    const filteredUsuarios = usuarios.filter(usuario =>
        usuario.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Gerar iniciais do usuário
    const getUserInitials = (name: string) => {
        return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().substring(0, 2);
    };

    // Formatar data
    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    // Handlers
    const handleEdit = (usuario: Usuario) => {
        toast.info(`Editar usuário: ${usuario.nomeCompleto}`);
        // TODO: Abrir modal de edição
    };

    const handleDelete = (usuario: Usuario) => {
        if (confirm(`Tem certeza que deseja excluir o usuário ${usuario.nomeCompleto}?`)) {
            toast.info(`Excluir usuário: ${usuario.nomeCompleto}`);
            // TODO: Implementar exclusão
        }
    };

    const handleView = (usuario: Usuario) => {
        toast.info(`Visualizar detalhes: ${usuario.nomeCompleto}`);
        // TODO: Navegar para página de detalhes
    };

    return (
        <PageContainer>
            {/* Header da página */}
            <PageHeader>
                <PageTitle>
                    <h1>
                        <Users />
                        Usuários
                    </h1>
                    <p>Gerencie os usuários do sistema</p>
                </PageTitle>

                <PageActions>
                    <Button
                        variant="primary"
                        leftIcon={<Plus />}
                        onClick={() => toast.info('Abrir formulário de novo usuário')}
                    >
                        Novo Usuário
                    </Button>
                </PageActions>
            </PageHeader>

            {/* Filtros */}
            <FiltersSection>
                <Input
                    placeholder="Buscar por nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    leftIcon={<Search />}
                    style={{ maxWidth: '400px' }}
                />
            </FiltersSection>

            {/* Tabela de usuários */}
            <Card variant="default">
                <UsersTable>
                    <TableHeader>
                        <div>Usuário</div>
                        <div className="hidden-mobile">Gênero</div>
                        <div className="hidden-mobile">Data Cadastro</div>
                        <div className="hidden-mobile">Status</div>
                        <div>Ações</div>
                    </TableHeader>

                    {isLoading ? (
                        <LoadingState>Carregando usuários...</LoadingState>
                    ) : filteredUsuarios.length === 0 ? (
                        <EmptyState>
                            <Users className="empty-icon" />
                            <h3>Nenhum usuário encontrado</h3>
                            <p>
                                {searchTerm
                                    ? 'Tente ajustar os filtros de busca'
                                    : 'Comece criando o primeiro usuário'
                                }
                            </p>
                            {!searchTerm && (
                                <Button
                                    variant="primary"
                                    leftIcon={<Plus />}
                                    onClick={() => toast.info('Criar primeiro usuário')}
                                >
                                    Criar Usuário
                                </Button>
                            )}
                        </EmptyState>
                    ) : (
                        filteredUsuarios.map((usuario) => (
                            <TableRow key={usuario.idUsuario}>
                                <div className="user-info">
                                    <div className="avatar">
                                        {getUserInitials(usuario.nomeCompleto)}
                                    </div>
                                    <div className="details">
                                        <div className="name">{usuario.nomeCompleto}</div>
                                        <div className="email">{usuario.email}</div>
                                    </div>
                                </div>

                                <div className="hidden-mobile">
                                    {GeneroLabels[usuario.genero]}
                                </div>

                                <div className="hidden-mobile">
                                    {formatDate(usuario.dataCadastro)}
                                </div>

                                <div className="hidden-mobile">
                                    <span className={`status ${usuario.ativo ? 'ativo' : 'inativo'}`}>
                                        {usuario.ativo ? 'Ativo' : 'Inativo'}
                                    </span>
                                </div>

                                <div className="actions">
                                    <ActionButton onClick={() => handleView(usuario)} title="Visualizar">
                                        <Eye />
                                    </ActionButton>
                                    <ActionButton onClick={() => handleEdit(usuario)} title="Editar">
                                        <Edit />
                                    </ActionButton>
                                    <ActionButton onClick={() => handleDelete(usuario)} title="Excluir">
                                        <Trash2 />
                                    </ActionButton>
                                </div>
                            </TableRow>
                        ))
                    )}
                </UsersTable>
            </Card>
        </PageContainer>
    );
};

export default UsuariosPage;
