import { Toaster } from "react-hot-toast";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 w-full">
        <div className="w-full max-w-full  rounded-xl shadow-lg p-8 ">
          {children}
        </div>
      </div>
    </>
  );
}
