import Link from "next/link";
import { SidebarItemProps } from "./SidebarItem.types";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function SidebarItem(props: SidebarItemProps) {
  const { item, setOpen } = props;
  const { href, icon: Icon, label } = item;

  const pathname = usePathname();

  const activePath = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        `flex gap-x-2 mt-2 text-slate-700 text-sm items-center p-2 rounded-lg cursor-pointer hover:bg-slate-400/20`,
        activePath && "bg-slate-400/10 ",
      )}
    >
      <Icon
        className={`${
          setOpen
            ? "w-7 h-7"
            : "w-7 h-7 hover:w-10 hover:h-10 transition-all duration-300"
        }`}
        strokeWidth={1}
      />
      {setOpen ? (
        <span className={` ${setOpen ? "text-lg" : ""}`}>{label}</span>
      ) : null}
    </Link>
  );
}
