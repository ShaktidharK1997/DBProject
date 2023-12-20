import { Inter } from 'next/font/google'
import './globals.css'
import Header from './header';
import Footer from './footer'

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Meta tags, stylesheets, and other head elements here */}
      </head>
      <body className={inter.className}>
      <div className="site-container">
        <Header /> {/* Place the Header component here */}
        <main className="content-wrap">  
          {children}
        </main>
      </div>
      </body>
    </html>
  );
}
