import Image from "next/image";
import Link from "next/link";

export function LogoDashboard() {
  return (
    <div>
      <Link
        href="/"
        className="flex items-center h-20 gap-4 cursor-pointer min-h-20 px-8"
      >
        <Image
          src="/cat-logo-2.png"
          alt="Logo"
          width={50}
          height={50}
          priority
        />
        <h1 className="text-3xl font-bold font-caveat">SpendSage</h1>
      </Link>
    </div>
  );
}
