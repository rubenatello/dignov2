import Image from "next/image";

export default function StudioHeader({ user = { name: "Admin" } }) {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b shadow-sm mb-8">
      <div className="flex items-center gap-3">
        <Image src="/digno-logo.svg" alt="Digno Logo" width={48} height={48} />
        <span className="font-roboto text-2xl font-regular text-secondary">Studio</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-block w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-lg font-bold">{user.name[0]}</span>
        <span className="hidden md:inline text-sm font-medium">{user.name}</span>
      </div>
    </header>
  );
}
