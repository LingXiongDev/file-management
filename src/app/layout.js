import { Inter } from "next/font/google";
import "./globals.css";
import StyledJsxRegistry from "./utils/registry";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "File Management",
  description: "File Management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledJsxRegistry>{children}</StyledJsxRegistry>
      </body>
    </html>
  );
}
