import { Cormorant_Garamond, Lora } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/AuthContext';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-heading-family',
  display: 'swap'
});

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-body-family',
  display: 'swap'
});

export const metadata = {
  title: 'Estudio Lienzo',
  description: 'Diseño y desarrollo web a medida — portafolio de Estudio Lienzo.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${cormorant.variable} ${lora.variable}`}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
