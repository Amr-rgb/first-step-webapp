import { useTranslations } from "next-intl";
import { useAuthToken, useAuthUser } from "@/store/authStore";
import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { openSignInModal } from "@/components/modals/SignInModalHandler";
import { handleLogout } from "@/lib/auth-utils";
import { LogOut, TicketPercent, LayoutDashboard } from "lucide-react";

const NavbarButton = () => {
  const token = useAuthToken();
  const user = useAuthUser();
  const pathname = usePathname();
  const t = useTranslations("navbar");
  const isSignInPage = pathname === "/sign-in";

  // Determine dashboard path based on user role
  let dashboardPath = null;
  if (user && user.role) {
    if (user.role.toLowerCase() === "admin") dashboardPath = "/dashboard/admin";
    else if (
      user.role.toLowerCase() === "center" ||
      user.role === "branch_admin"
    )
      dashboardPath = "/dashboard/center";
    else if (user.role.toLowerCase() === "parent")
      dashboardPath = "/dashboard/parent";
  }

  return (
    <div className="flex gap-4 items-center">
      {!token ? (
        <>
          {!isSignInPage && (
            <>
              <Button
                size={"sm"}
                className="hidden sm:inline-flex font-semibold"
                onClick={openSignInModal}
              >
                <div className="flex items-center gap-1">
                  <span className="font-normal text-xs">
                    {t("buttons.already-have-account")}
                  </span>
                  <span>{t("buttons.sign-in")}</span>
                </div>
              </Button>
              <Button asChild size={"sm"} className="sm:hidden font-semibold">
                <Link href="/sign-in">
                  <span className="font-normal text-xs">
                    {t("buttons.already-have-account")}
                  </span>
                  <span>{t("buttons.sign-in")}</span>
                </Link>
              </Button>
            </>
          )}
        </>
      ) : (
        <>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleLogout()}
            title={t("buttons.logout")}
            className="text-primary hover:text-primary/80"
          >
            <LogOut className="size-6" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            asChild
            className="text-primary hover:text-primary/80"
          >
            <Link href="/coupon-codes" title={t("links.coupon-codes.title")}>
              <TicketPercent className="size-6" />
            </Link>
          </Button>

          {dashboardPath && (
            <Button
              size="icon"
              variant="ghost"
              asChild
              className="text-primary hover:text-primary/80"
            >
              <Link href={dashboardPath} title={t("buttons.dashboard")}>
                <LayoutDashboard className="size-6" />
              </Link>
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default NavbarButton;
