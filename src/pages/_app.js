import { ThemeProvider } from 'styled-components';
import { DefaultSeo } from 'next-seo';
import { DM_Sans } from 'next/font/google';
import theme from '@/styles/theme';
import GlobalStyle from '@/styles/GlobalStyle';
import defaultSeo from '@/components/seo/defaultSeo';

// Self-hosted via next/font → no render-blocking Google request, good CWV.
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <DefaultSeo {...defaultSeo} />
      {/* The font variable is scoped here; every visible node lives inside it. */}
      <div className={dmSans.variable} style={{ fontFamily: 'var(--font-dm-sans)' }}>
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
  );
}
