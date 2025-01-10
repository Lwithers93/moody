import { Fugaz_One, Open_Sans, Poppins } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { AuthProvider } from "@/context/AuthContext";
import Logout from "@/components/Logout";

const openSans = Open_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const fugaz = Poppins({ subsets: ["latin"], weight: ["400"] });

// Displays on tab in browser
export const metadata = {
  title: "Mood App",
  description: "Track your daily mood",
};

export default function RootLayout({ children }) {
  const header = (
    <header className="p-4 sm:p-8 flex items-center justify-between gap-4">
      {/* app name / title */}
      <Link href={"/"}>
        <h1 className={`text-base sm:text-lg textGradient ${fugaz.className}`}>
          Moody
        </h1>
      </Link>
      <Logout />
    </header>
  );

  const footer = (
    <footer className="p-4 sm:p-8 grid place-items-center">
      <p className={"text-green-500 " + fugaz.className}>Created with 💛</p>
    </footer>
  );

  return (
    <html lang="en">
      <link rel="icon" href="/favicon.png" />
      {/* wrap entire application in Auth Provider  */}

      <body
        className={`w-full max-width-[1000px] mx-auto text-sm sm:text-base min-h-screen flex flex-col text-slate-700 ${openSans.variable} antialiased`}
      >
        <AuthProvider>
          {header}
          {children}
          {footer}
        </AuthProvider>
      </body>
    </html>
  );
}
