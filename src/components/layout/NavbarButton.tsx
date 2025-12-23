import { useTranslations } from "next-intl";
import { useAuthToken, useAuthUser } from "@/store/authStore";
import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { openSignInModal } from "@/components/modals/SignInModalHandler";
import { handleLogout } from "@/lib/auth-utils";
import { LogOut, LayoutDashboard } from "lucide-react";

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
                {t("buttons.sign-in")}
              </Button>
              <Button asChild size={"sm"} className="sm:hidden font-semibold">
                <Link href="/sign-in">{t("buttons.sign-in")}</Link>
              </Button>
            </>
          )}
        </>
      ) : (
        <>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleLogout()}
            title={t("buttons.logout")}
          >
            <LogOut className="size-4" />
            {/* {t("buttons.logout")} */}
          </Button>

          {dashboardPath && (
            <Button size="sm" variant="default" asChild>
              <Link href={dashboardPath} title={t("buttons.dashboard")}>
                <LayoutDashboard className="size-4" />
                {t("buttons.dashboard")}
              </Link>
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default NavbarButton;
