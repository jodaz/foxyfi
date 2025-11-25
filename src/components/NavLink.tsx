import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
  exact?: boolean;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ href, className, activeClassName, pendingClassName, exact = false, ...props }, ref) => {
    const pathname = usePathname() || "/";

    const isActive = exact
      ? pathname === href
      : href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

    return (
      <Link href={href} legacyBehavior>
        <a ref={ref} className={cn(className, isActive && activeClassName)} {...props} />
      </Link>
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
