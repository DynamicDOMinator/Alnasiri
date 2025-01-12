import "../globals.css";
import { Cairo } from "next/font/google";
import Header from "./Header";
import Footer from "./Footer";
const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
});

export default function DefaultLayout({ children }) {
  return (
    <html lang="ar">
      <body className={cairo.className}>
        <div>
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
