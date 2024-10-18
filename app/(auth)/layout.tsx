export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen">
      <div className="w-full p-20 lg:p-44 flex flex-col justify-center items-center lg:w-2/4">{children}</div>
      <div
        className="hidden lg:flex lg:w-2/4 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/assets/images/flower.png")' }}
      ></div>
    </div>
  );
}
