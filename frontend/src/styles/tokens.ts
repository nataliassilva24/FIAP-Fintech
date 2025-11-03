// Design Tokens - Inspirado no BTG Design System

export const colors = {
    // Cores primárias BTG (baseadas na identidade visual real)
    primary: {
        50: '#EEF2FF',
        100: '#E0E7FF',
        200: '#C7D2FE',
        300: '#A5B4FC',
        400: '#4F9CF9',
        500: '#2563EB', // BTG Blue Principal (mais próximo do real)
        600: '#1D4ED8',
        700: '#1E40AF',
        800: '#1E3A8A',
        900: '#1E40AF',
        950: '#0B1426'  // Azul muito escuro do header BTG
    },

    // Cores BTG Brand específicas
    brand: {
        darkBlue: '#0B1426',    // Header background BTG
        primaryBlue: '#2563EB', // Azul principal BTG
        lightBlue: '#3B82F6',   // Azul claro para acentos
        navyBlue: '#1E293B',    // Background sections
        slate: '#334155',       // Elementos secundários
        accent: '#4F9CF9',      // Azul vibrante para CTAs
    },

    // Tons de cinza (BTG Style)
    gray: {
        50: '#F8FAFC',
        100: '#F1F5F9',
        200: '#E2E8F0',
        300: '#CBD5E1',
        400: '#94A3B8',
        500: '#64748B',
        600: '#475569',
        700: '#334155',
        800: '#1E293B',
        900: '#0F172A',
        950: '#020617'
    },

    // Cores semânticas
    success: {
        50: '#ECFDF5',
        100: '#D1FAE5',
        500: '#10B981',
        600: '#059669',
        700: '#047857',
        900: '#064E3B'
    },

    warning: {
        50: '#FFFBEB',
        100: '#FEF3C7',
        500: '#F59E0B',
        600: '#D97706',
        700: '#B45309'
    },

    error: {
        50: '#FEF2F2',
        100: '#FEE2E2',
        500: '#EF4444',
        600: '#DC2626',
        700: '#B91C1C',
        900: '#7F1D1D'
    },

    // Background gradients BTG (baseados no site real)
    gradients: {
        // Gradiente principal do site BTG (como na imagem)
        primary: 'linear-gradient(135deg, #0B1426 0%, #1E293B 60%, #334155 100%)',
        // Gradiente para o hero section
        hero: 'linear-gradient(90deg, #0B1426 0%, #1E293B 70%, rgba(30, 41, 59, 0.8) 100%)',
        // Gradiente para cards (mais sutil)
        card: 'linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
        // Gradiente para botões principais BTG
        button: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
        // Gradiente de acento
        accent: 'linear-gradient(135deg, #4F9CF9 0%, #2563EB 100%)',
        // Overlay para imagens/backgrounds
        overlay: 'linear-gradient(90deg, rgba(11, 20, 38, 0.95) 0%, rgba(30, 41, 59, 0.7) 70%, transparent 100%)'
    }
} as const;

export const typography = {
    fontFamily: {
        // Fonte mais próxima da BTG (mais corporativa)
        primary: '"Inter", "Helvetica Neue", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: '"Inter", "Helvetica Neue", sans-serif', // Para títulos grandes
        mono: '"JetBrains Mono", "Fira Code", "Monaco", "Consolas", monospace'
    },

    fontSize: {
        xs: '0.75rem',    // 12px
        sm: '0.875rem',   // 14px  
        base: '1rem',     // 16px
        lg: '1.125rem',   // 18px
        xl: '1.25rem',    // 20px
        '2xl': '1.5rem',  // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem',  // 36px
        '5xl': '3rem'      // 48px
    },

    fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700
    },

    lineHeight: {
        none: 1,
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75
    }
} as const;

export const spacing = {
    px: '1px',
    0.5: '0.125rem', // 2px
    1: '0.25rem',    // 4px
    1.5: '0.375rem', // 6px
    2: '0.5rem',     // 8px
    2.5: '0.625rem', // 10px
    3: '0.75rem',    // 12px
    3.5: '0.875rem', // 14px
    4: '1rem',       // 16px
    5: '1.25rem',    // 20px
    6: '1.5rem',     // 24px
    7: '1.75rem',    // 28px
    8: '2rem',       // 32px
    9: '2.25rem',    // 36px
    10: '2.5rem',    // 40px
    12: '3rem',      // 48px
    16: '4rem',      // 64px
    20: '5rem',      // 80px
    24: '6rem',      // 96px
    32: '8rem',      // 128px
} as const;

export const borderRadius = {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px'
} as const;

export const shadows = {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',

    // Shadows específicos BTG
    card: '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)',
    button: '0 4px 8px rgba(79, 70, 229, 0.3)',
    focus: '0 0 0 3px rgba(99, 102, 241, 0.4)'
} as const;

export const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
} as const;

export const transitions = {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)'
} as const;

// Z-index system
export const zIndex = {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800
} as const;

// Component specific tokens
export const components = {
    button: {
        height: {
            sm: '32px',
            md: '40px',
            lg: '48px'
        },
        padding: {
            sm: '8px 12px',
            md: '12px 24px',
            lg: '16px 32px'
        }
    },

    input: {
        height: {
            sm: '36px',
            md: '44px',
            lg: '52px'
        },
        padding: '12px 16px'
    },

    card: {
        padding: {
            sm: '16px',
            md: '24px',
            lg: '32px'
        }
    }
} as const;

export default {
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
    breakpoints,
    transitions,
    zIndex,
    components
};
