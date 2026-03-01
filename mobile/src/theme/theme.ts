// ─── Design System ── Inspired by Image 2 (Clean EdTech UI) ──────────────────
// Palette: Pure whites, soft grays, mint/green primary, coral/orange accents
// Style: Airy, minimal, card-based, light and professional

export const theme = {
    colors: {
        // Backgrounds
        background: '#F5F6FA',          // Very light gray-blue
        surface: '#FFFFFF',             // Pure white cards
        surfaceAlt: '#F0FAF6',          // Mint-tinted surface

        // Text
        text: '#1C1C2E',               // Near-black, warm
        textSubtle: '#8A8FA8',         // Muted gray-blue
        textLight: '#FFFFFF',

        // Primary - Mint/Teal Green (like image 2 class cards)
        primary: '#2DC87A',            // Vibrant mint green
        primaryDark: '#1DA362',        // Deeper green
        primaryLight: '#E8FAF2',       // Very light mint bg

        // Secondary - Warm Orange (decorative dots in image 2)
        secondary: '#FF8C42',          // Warm orange
        secondaryLight: '#FFF1E8',

        // Accent colors for subject/class categories
        violet: '#7C6EF5',
        violetLight: '#EEF0FE',
        coral: '#FF6B6B',
        coralLight: '#FFF0F0',
        blue: '#4A90E2',
        blueLight: '#EBF3FD',
        amber: '#FFB830',
        amberLight: '#FFF8E7',
        teal: '#48BDB8',
        tealLight: '#E8F8F8',

        // Status
        live: '#4CAF50',              // Green for live badge
        liveLight: '#E8F5E9',

        // Borders/Dividers
        border: '#EBEBF0',
        borderLight: '#F5F5FA',

        gradients: {
            primary: ['#2DC87A', '#1DA362'] as const,
            noticeBoard: ['#3CB371', '#48BDB8'] as const,
            banner: ['#7C6EF5', '#4A90E2'] as const,
            warm: ['#FF8C42', '#FFB830'] as const,
        }
    },
    radius: {
        xs: 8,
        sm: 12,
        md: 16,
        lg: 20,
        xl: 28,
        xxl: 36,
        pill: 999,
    },
    spacing: {
        xs: 6,
        sm: 10,
        md: 16,
        lg: 20,
        xl: 24,
        xxl: 32,
        xxxl: 48,
    },
    shadows: {
        card: {
            shadowColor: '#9BA3C2',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 2,
        },
        soft: {
            shadowColor: '#B0B7D3',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.10,
            shadowRadius: 12,
            elevation: 3,
        },
        medium: {
            shadowColor: '#8A8FA8',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.12,
            shadowRadius: 16,
            elevation: 5,
        },
        primary: {
            shadowColor: '#2DC87A',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 12,
            elevation: 6,
        },
    }
};
