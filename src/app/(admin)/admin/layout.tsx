// app/(admin)/layout.tsx
import "../../(main)/globals.css";

export const metadata = {
  title: "Admin",
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}



