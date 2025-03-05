import DefaultLayout from "../components/DefaultLayout";
import { UserTypeProvider } from "../contexts/UserTypeContext";
export const metadata = {
  title: "بشارة",
  description: "هي عبارة عن منصة تساعد المحامين في التواصل مع المواطنين",
  icons: {
    icon: "/images/afav.png", 
  },
};
export default function WithHeaderLayout({ children }) {
  return (
    <UserTypeProvider>
      <DefaultLayout>{children}</DefaultLayout>
    </UserTypeProvider>
  );
}
