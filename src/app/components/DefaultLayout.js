import "../globals.css";
import Header from "./Header";
import Footer from "./Footer";

export default function DefaultLayout({ children }) {
  return (
    
     <html lang="ar">
     <body>
       <div>
        <Header/>
         {children}
         <Footer/>
       </div>
     </body>
   </html>
  );
}
