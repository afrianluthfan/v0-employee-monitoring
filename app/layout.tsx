import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Employee Monitoring Dashboard",
  description:
    "A dashboard for the human capital department to monitor employee data",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className + " bg-gray-100"}>{children}</body>
    </html>
  );
}
