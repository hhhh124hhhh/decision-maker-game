/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			fontFamily: {
				'pixel-display': ['Press Start 2P', 'monospace'],
				'pixel-body': ['Pixel Sans Serif', 'monospace'],
			},
			colors: {
				// 游戏主色调（暖色系）
				gold: {
					DEFAULT: '#FFD700',
					bright: '#FFFF99',  // 更亮的黄色作为视觉中心
					dark: '#D4A017',
					light: '#FFE55C',
				},
				orange: {
					DEFAULT: '#FF8C00',
					dark: '#CC6600',
					light: '#FFB347',
				},
				red: {
					DEFAULT: '#DC143C',
					dark: '#8B0000',
					light: '#FF6B6B',
				},
				brown: {
					DEFAULT: '#8B4513',
					dark: '#5C2E0A',
					light: '#D2691E',
					// 新增：UI优化颜色
					'ultra-dark': '#2e1d14',  // 背景深棕色
					'medium': '#a96f38',      // 中间模块浅棕色
				},
				// 辅助色
				blue: {
					DEFAULT: '#4169E1',
					dark: '#1E3A8A',
				},
				green: {
					DEFAULT: '#32CD32',
					dark: '#228B22',
					light: '#90EE90',
				},
				// 中性色
				gray: {
					DEFAULT: '#666666',
					dark: '#333333',
					light: '#CCCCCC',
				},
				terminal: {
					green: '#00FF00',
				},
				// 属性颜色
				attribute: {
					capital: '#FFD700',
					reputation: '#4169E1',
					innovation: '#32CD32',
					morale: '#FF8C00',
				},
				// 原有颜色保持兼容
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#2B5D3A',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: '#4A90E2',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				accent: {
					DEFAULT: '#F5A623',
					foreground: 'hsl(var(--accent-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
			},
			spacing: {
				'xs': '4px',
				'sm': '8px',
				'md': '16px',
				'lg': '24px',
				'xl': '32px',
				'2xl': '48px',
				'70': '280px',
				'80': '320px',
				'96': '384px',
				'120': '480px',
				'140': '560px',
				'150': '600px',
			},
			boxShadow: {
				'pixel-sm': '2px 2px 0px #5C2E0A',
				'pixel-md': '4px 4px 0px #5C2E0A',
				'pixel-lg': '6px 6px 0px #5C2E0A',
			},
			borderWidth: {
				'pixel-thin': '2px',
				'pixel-thick': '4px',
			},
			borderRadius: {
				'pixel': '0px',
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'bounce-pixel': 'bounce-pixel 0.5s steps(8)',
				'pulse-pixel': 'pulse-pixel 0.3s steps(12)',
				'fade-pixel': 'fade-pixel 0.3s steps(12)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
				'bounce-pixel': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-2px)' },
				},
				'pulse-pixel': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' },
				},
				'fade-pixel': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}