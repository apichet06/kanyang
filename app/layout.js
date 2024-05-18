import { Prompt } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import InstallBootstrap from "./utils/installBootstrap";


const prompt = Prompt({ subsets: ['latin'], weight: '400' })

export const metadata = {
  title: "ประมูลราคายางพารา",
  description: "ระบบประมูลราคายางพารา",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <body className={prompt.className}>
        {children}
        <InstallBootstrap />
      </body>
    </html>
  );
}