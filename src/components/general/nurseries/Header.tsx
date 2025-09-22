import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

const Header = ({
  name,
  slogan,
  description,
  backgroundImage,
  preview,
}: {
  name: string;
  slogan?: string;
  description?: string;
  backgroundImage?: string;
  preview?: boolean;
}) => {
  const t = useTranslations("nurseryDetails");

  const defaultBackgroundImage =
    "https://images.unsplash.com/photo-1567746455504-cb3213f8f5b8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <div
      className="relative flex h-[37.5rem] px-4 bg-center bg-cover"
      style={{
        backgroundImage: `url(${backgroundImage || defaultBackgroundImage})`,
      }}
    >
      <div className="bg-white max-w-[37.5rem] rounded-5xl sm:rounded-[6.25rem] mx-auto mt-auto mb-12">
        <div className="space-y-6 text-center px-4 py-8 sm:pb-10 sm:pt-8 sm:px-20">
          <div className="space-y-1">
            <p className="heading-3 text-primary font-extrabold">{name}</p>
            <p className="heading-4 text-secondary-mint-green font-medium">
              {slogan || t("header.sloganFallback")}
            </p>
          </div>

          <div className="space-y-4">
            <p className="font-bold text-mid-gray">
              {description || t("header.description")}
            </p>
            <div className="relative group">
              <Button
                size={"sm"}
                disabled={preview}
                className="opacity-50 cursor-not-allowed bg-gray-400 hover:bg-gray-400"
              >
                {t("branches.cta")}
              </Button>
              {!preview ? (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                  Wait until the nursery adds its plans or programs
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
