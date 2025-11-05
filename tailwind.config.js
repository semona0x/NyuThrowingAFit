/** @type {import('tailwindcss').Config} */
import tailwindcssMotion from 'tailwindcss-motion';
import typography from '@tailwindcss/typography';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // ✨ 自定义“杂志感”排版主题：prose-mag
      typography: {
        mag: {
          css: {
            // 基础字体&行高
            '--tw-prose-body': 'theme(colors.zinc.800)',
            '--tw-prose-headings': 'theme(colors.black)',
            '--tw-prose-links': 'theme(colors.zinc.900)',
            '--tw-prose-bold': 'theme(colors.zinc.900)',
            '--tw-prose-quotes': 'theme(colors.zinc.900)',
            '--tw-prose-captions': 'theme(colors.zinc.500)',
            maxWidth: 'none',

            p: {
              fontSize: '1.05rem',
              lineHeight: '1.9',
              letterSpacing: '-0.004em',
              marginTop: '1.05em',
              marginBottom: '1.05em',
            },

            h1: {
              fontFamily: `Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial`,
              fontWeight: '800',
              letterSpacing: '-0.02em',
              lineHeight: '1.05',
              marginTop: '0',
              marginBottom: '0.6em',
            },
            h2: {
              fontFamily: `Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial`,
              fontWeight: '800',
              letterSpacing: '-0.015em',
              lineHeight: '1.15',
              marginTop: '1.6em',
              marginBottom: '0.6em',
            },
            h3: {
              fontWeight: '700',
              letterSpacing: '-0.01em',
              lineHeight: '1.2',
              marginTop: '1.4em',
              marginBottom: '0.5em',
            },

            // 让图片像杂志插图：圆角+微阴影+上下呼吸
            img: {
              borderRadius: '0.9rem',
              boxShadow: '0 10px 30px -12px rgba(0,0,0,.25)',
              marginTop: '1.4em',
              marginBottom: '1.4em',
            },
            'figure img': {
              marginTop: '0.6em',
              marginBottom: '0.6em',
            },
            figcaption: {
              textAlign: 'center',
              fontSize: '.85rem',
              color: 'theme(colors.zinc.500)',
              marginTop: '.4rem',
            },

            // 引文 & 分割线
            blockquote: {
              fontStyle: 'normal',
              fontWeight: '600',
              borderLeftColor: 'theme(colors.zinc.300)',
              borderLeftWidth: '4px',
              paddingLeft: '1rem',
              color: 'theme(colors.zinc.800)',
            },
            hr: {
              borderColor: 'theme(colors.zinc.200)',
              marginTop: '2.2em',
              marginBottom: '2.2em',
            },

            // 列表更“编辑部”一点
            'ul > li': { marginTop: '.4em', marginBottom: '.4em' },
            'ol > li': { marginTop: '.4em', marginBottom: '.4em' },
            'ul > li::marker': { color: 'theme(colors.zinc.400)' },
            'ol > li::marker': { color: 'theme(colors.zinc.400)' },

            // 链接（低调）
            a: {
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              textDecorationThickness: '1px',
              transition: 'color .2s ease',
            },
            'a:hover': {
              color: 'theme(colors.zinc.700)',
            },
          },
        },

        // 可选：暗色版
        invert: {
          css: {
            '--tw-prose-body': 'theme(colors.zinc.200)',
            '--tw-prose-headings': 'theme(colors.white)',
            '--tw-prose-links': 'theme(colors.white)',
            img: { boxShadow: '0 10px 30px -12px rgba(0,0,0,.55)' },
            blockquote: { borderLeftColor: 'theme(colors.zinc.700)' },
            hr: { borderColor: 'theme(colors.zinc.700)' },
          },
        },
      },
    },
  },
  plugins: [tailwindcssMotion, typography],
};
