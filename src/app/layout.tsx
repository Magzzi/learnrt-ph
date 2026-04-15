import "./globals.css";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { ThemeProvider } from "@/context/ThemeContext";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>LearnRT</title>
        <link rel="icon" href="https://i.postimg.cc/0jLYvjV2/Learn-RT-Web-Logo.png" />
        {/* Anti-flicker: apply saved theme before React hydrates */}
        <script dangerouslySetInnerHTML={{
          __html: `try{var t=localStorage.getItem('learnrt-theme');if(t==='light')document.documentElement.classList.add('light');}catch(e){}`
        }} />
      </head>
      <body className={`${roboto.variable} font-roboto bg-[#0a1a1a]`}>
        <ThemeProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
