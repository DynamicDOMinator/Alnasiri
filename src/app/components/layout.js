import "./globals.css";
import { Cairo } from "next/font/google";
export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};
const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="ar">
      <body className={cairo.className}>{children}</body>
    </html>
  );
}
