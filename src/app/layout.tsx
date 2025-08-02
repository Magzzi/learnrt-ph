import "./globals.css";
import Navbar from "@/components/ui/navbar";
import { Roboto } from "next/font/google";
import Footer from "@/components/ui/footer";

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
        <link rel="icon" href="/learnrt-weblogo.png" />
      </head>
      <body className={`${roboto.variable} font-roboto`} >
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
