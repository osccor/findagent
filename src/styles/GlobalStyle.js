import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }

  html, body {
    margin: 0;
    padding: 0;
    font-family: ${({ theme }) => theme.font.family};
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.pageBg};
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  a { color: inherit; text-decoration: none; }

  h1, h2, h3, h4, p { margin: 0; }

  ol, ul { margin: 0; padding: 0; list-style: none; }

  button { font-family: inherit; cursor: pointer; }

  img { max-width: 100%; display: block; }

  :focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export default GlobalStyle;
