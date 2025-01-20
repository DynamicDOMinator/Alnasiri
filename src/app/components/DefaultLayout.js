"use client";
import "../globals.css";
import { Cairo } from "next/font/google";
import Header from "./Header";
import Footer from "./Footer";
import { AuthProvider } from "../contexts/AuthContext";
import { QuestionProvider } from "../contexts/QuestionContext";
const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
});

export default function DefaultLayout({ children }) {
  return (
    <html lang="ar">
      <body className={cairo.className}>
        <AuthProvider>
          <QuestionProvider>
            <div>
              <Header />
              {children}
              <Footer />
            </div>
          </QuestionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
