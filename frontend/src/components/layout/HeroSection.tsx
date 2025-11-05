import React from 'react';

const HeroSection: React.FC = () => (
    <section style={{
        background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #60A5FA 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '80px 32px',
        position: 'relative',
        overflow: 'hidden'
    }}>
        <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '80px',
            alignItems: 'center',
            width: '100%'
        }}>
            {/* Content Left */}
            <div>
                <h1 style={{
                    fontSize: '52px',
                    fontWeight: '800',
                    color: 'white',
                    lineHeight: '1.1',
                    marginBottom: '24px',
                    fontFamily: '"Inter", sans-serif',
                    letterSpacing: '-0.025em'
                }}>
                    A melhor solução<br />
                    para uma vida{' '}
                    <span style={{
                        background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        financeira saudável
                    </span>
                </h1>

                <p style={{
                    fontSize: '20px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: '1.6',
                    marginBottom: '40px',
                    maxWidth: '500px'
                }}>
                    Reúna todas as suas despesas em um único aplicativo
                    e simplifique suas finanças com o nosso gerenciador.
                </p>

                <p style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    maxWidth: '500px'
                }}>
                    * Sistema sujeito a análise. Desenvolvido exclusivamente para fins educacionais da FIAP por
                    estudantes, totalmente gratuito para estudantes.
                </p>
            </div>

            {/* Right side - Dashboard Preview */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '600px',
                position: 'relative'
            }}>
                {/* Main Dashboard Device */}
                <div style={{
                    width: '280px',
                    height: '500px',
                    background: 'linear-gradient(145deg, #1f2937 0%, #111827 100%)',
                    borderRadius: '40px',
                    position: 'relative',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
                    transform: 'rotate(-8deg)',
                    overflow: 'hidden',
                    border: '6px solid transparent',
                    backgroundImage: 'linear-gradient(145deg, #1f2937 0%, #111827 100%), linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #EF4444 100%)',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box'
                }}>
                    {/* Screen Content */}
                    <div style={{
                        padding: '24px 18px',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {/* Header */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '14px',
                            color: 'white'
                        }}>
                            <div style={{
                                fontSize: '18px',
                                fontWeight: '600'
                            }}>
                                FIAP Fintech
                            </div>
                            <div style={{
                                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                color: 'white',
                                fontSize: '11px',
                                padding: '4px 10px',
                                borderRadius: '12px',
                                fontWeight: '600',
                                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                            }}>
                                ONLINE
                            </div>
                        </div>

                        {/* Balance Card */}
                        <div style={{
                            background: 'linear-gradient(135deg, #4F9CF9 0%, #3B82F6 100%)',
                            borderRadius: '18px',
                            padding: '18px',
                            marginBottom: '14px',
                            marginTop: '24px',
                            color: 'white',
                            boxShadow: '0 6px 16px rgba(79, 156, 249, 0.25)'
                        }}>
                            <div style={{
                                fontSize: '12px',
                                opacity: 0.9,
                                marginBottom: '4px'
                            }}>
                                Saldo Total
                            </div>
                            <div style={{
                                fontSize: '22px',
                                fontWeight: '600'
                            }}>
                                R$ 12.847,50
                            </div>
                        </div>

                        {/* Income and Expense Cards */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '10px'
                        }}>
                            {/* Income */}
                            <div style={{
                                background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.25) 0%, rgba(245, 158, 11, 0.25) 100%)',
                                borderRadius: '14px',
                                padding: '14px',
                                color: '#FCD34D',
                                border: '1px solid rgba(251, 191, 36, 0.4)',
                                boxShadow: '0 3px 10px rgba(251, 191, 36, 0.15)'
                            }}>
                                <div style={{
                                    fontSize: '10px',
                                    opacity: 0.9,
                                    marginBottom: '4px'
                                }}>
                                    Receitas
                                </div>
                                <div style={{
                                    fontSize: '14px',
                                    fontWeight: '600'
                                }}>
                                    R$ 8.500
                                </div>
                            </div>

                            {/* Expenses */}
                            <div style={{
                                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(220, 38, 38, 0.25) 100%)',
                                borderRadius: '14px',
                                padding: '14px',
                                color: '#F87171',
                                border: '1px solid rgba(239, 68, 68, 0.4)',
                                boxShadow: '0 3px 10px rgba(239, 68, 68, 0.15)'
                            }}>
                                <div style={{
                                    fontSize: '10px',
                                    opacity: 0.9,
                                    marginBottom: '4px'
                                }}>
                                    Gastos
                                </div>
                                <div style={{
                                    fontSize: '14px',
                                    fontWeight: '600'
                                }}>
                                    R$ 3.200
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Notification Tooltip */}
                <div style={{
                    position: 'absolute',
                    top: '92px',
                    right: '65px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '25px',
                    fontSize: '13px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.3s ease',
                    zIndex: 20,
                    whiteSpace: 'nowrap'
                }}>
                    <span style={{ fontSize: '14px' }}>💰</span>
                    <span>+R$ 2.500 hoje</span>
                </div>

                {/* Goal Badge */}
                <div style={{
                    position: 'absolute',
                    bottom: '80px',
                    left: '40px',
                    background: '#10B981',
                    color: 'white',
                    padding: '10px 18px',
                    borderRadius: '24px',
                    fontSize: '14px',
                    fontWeight: '600',
                    boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
                    zIndex: 10
                }}>
                    ✓ Meta: 78%
                </div>
            </div>
        </div>
    </section>
);

export default HeroSection;
