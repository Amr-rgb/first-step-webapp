import { useTranslations } from "next-intl";
import { useAuthStore, useAuthToken, useAuthUser } from "@/store/authStore";
import { Link } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { openSignInModal } from "@/components/modals/SignInModalHandler";

const NavbarButton = () => {
  const token = useAuthToken();
  const user = useAuthUser();
  const authStore = useAuthStore();
  const tBtns = useTranslations("navbar.buttons");

  // Determine dashboard path based on user role
  let dashboardPath = null;
  if (user && user.role) {
    if (user.role === "admin") dashboardPath = "/dashboard/admin";
    else if (user.role === "center" || user.role === "branch_admin")
      dashboardPath = "/dashboard/center";
    else if (user.role === "parent") dashboardPath = "/dashboard/parent";
  }

  return (
    <div className="flex gap-2 items-center">
      {!token ? (
        <Button size={"sm"} onClick={openSignInModal} className="inline-block font-semibold">
          <span className="font-normal text-xs">
            {tBtns("already-have-account")}
          </span>
          <span>{tBtns("sign-in")}</span>
        </Button>
      ) : (
        <>
          {dashboardPath && (
            <Button size={"sm"} asChild>
              <Link href={dashboardPath} className="inline-block font-semibold" >
                {tBtns("dashboard")}
              </Link>
            </Button>
          )}
          <Button
            size={"sm"}
            variant="outline"
            onClick={() => authStore.clearAuth()}
          >
            {tBtns("logout")}
          </Button>
        </>
      )}
    </div>
  );
};

export default NavbarButton;
