import React from 'react';
import Header from '../../components/layout/Header';
import HeroSection from '../../components/layout/HeroSection';

const HomePage: React.FC = () => {
    return (
        <div style={{ minHeight: '100vh', background: '#0B1426' }}>
            <Header />
            <HeroSection />
        </div>
    );
};

export default HomePage;
