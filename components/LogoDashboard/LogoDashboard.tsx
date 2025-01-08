import Image from "next/image";
import Link from "next/link";

type propsLogoDashboard = {
  open: boolean;
};

export function LogoDashboard(props: propsLogoDashboard) {
  const { open } = props;
  return (
    <div>
      <Link
        href="/"
        className={
          open ? "flex items-center h-20 cursor-pointer min-h-20 px-8" : ""
        }
      >
        <Image
          src="/spendsage-logo.png"
          alt="Logo"
          width={70}
          height={70}
          priority
        />
        {open ? (
          <h1 className="text-3xl font-bold font-tsukimi">SpendSage</h1>
        ) : null}
      </Link>
    </div>
  );
}
