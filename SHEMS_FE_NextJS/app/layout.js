import { Inter } from 'next/font/google'
import './globals.css'
import Header from './header';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Meta tags, stylesheets, and other head elements here */}
      </head>
      <body className={inter.className}>
        <Header /> {/* Place the Header component here */}
        {children}
      </body>
    </html>
  );
}
