"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import {
  checkEmailAction,
  subscribeToNewsletterAction,
} from "@/actions/websiteActions";
import Image from "next/image";
import { X, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function NewsletterPopup({
  isOpen: externalIsOpen,
  onOpenChange,
  isManual = false,
}: {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  isManual?: boolean;
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useAuthStore();
  const t = useTranslations("NewsletterPopup");

  const isControlled = typeof externalIsOpen !== "undefined";
  const isOpen = isControlled ? externalIsOpen : internalIsOpen;
  const setIsOpen = (open: boolean) => {
    if (isControlled && onOpenChange) {
      onOpenChange(open);
    } else {
      setInternalIsOpen(open);
    }
  };

  useEffect(() => {
    if (isManual) return;

    const checkSubscription = async () => {
      // Check if manually closed before
      const isClosed = localStorage.getItem("newsletter_popup_closed");
      if (isClosed) return;

      // If user is logged in, check if they are already subscribed
      if (user?.email) {
        try {
          const res: any = await checkEmailAction(user.email);
          if (res?.data?.exists || res?.exists) {
            return;
          }
        } catch (e) {
          console.error("Failed to check subscription", e);
        }
      }

      // Show popup after a delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);

      return () => clearTimeout(timer);
    };

    checkSubscription();
  }, [user, isManual]);

  const handleClose = () => {
    setIsOpen(false);
    if (!isManual) {
      localStorage.setItem("newsletter_popup_closed", "true");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setErrorMessage("");
    try {
      await subscribeToNewsletterAction(email);
      setSubmitted(true);
      toast.success(t("success"));
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error: any) {
      console.error(error);

      const msg =
        error?.errors?.email?.[0] || error.message || "Failed to subscribe";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen && !submitted) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white rounded-3xl border-none shadow-2xl [&>button]:hidden">
        {/* Close Button - Top Left */}
        <div className="absolute left-4 top-4 z-50">
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="relative w-full min-h-[500px] flex flex-col md:flex-row overflow-hidden">
          {/* Illustrations - Absolute Positioned (Desktop) */}

          {/* Offer Alert (Megaphone) - Top Left */}
          <div className="absolute top-0 rtl:left-8 ltr:right-8 ltr:rotate-y-180 z-10 w-32 md:w-48 hidden md:block">
            <Image
              src="/assets/illustrations/offer-alert.png"
              alt="Offer Alert"
              width={200}
              height={200}
              className="object-contain"
            />
          </div>

          {/* Coupon Cards - Bottom Left */}
          <div className="absolute bottom-0 rtl:left-0 ltr:right-0 ltr:rotate-y-180 z-10 w-64 md:w-[400px] hidden md:block">
            <Image
              src="/assets/illustrations/coupon-cards.png"
              alt="Coupons"
              width={655}
              height={581}
              className="object-contain"
            />
          </div>

          {/* Mobile Image */}
          <div className="md:hidden w-full flex justify-center pt-12 pb-4 bg-linear-to-b from-blue-50 to-white">
            <Image
              src="/assets/illustrations/offer-alert.png"
              alt="Offer Alert"
              width={140}
              height={140}
              className="object-contain"
            />
          </div>

          {/* Content Section - Right Side */}
          <div className="w-full md:w-1/2 md:ltr:mr-auto p-8 md:p-12 flex flex-col justify-center items-center md:items-start md:rtl:items-end text-center md:rtl:text-right md:text-left z-20">
            <div className="mb-2 hidden">
              <DialogTitle>{t("title")}</DialogTitle>
            </div>

            <h2 className="text-2xl md:text-4xl font-bold text-[#1A1D56] mb-4 leading-tight">
              {t("title")}
            </h2>

            <p className="text-gray-500 mb-8 text-lg">{t("subtitle")}</p>

            {submitted ? (
              <div className="text-center py-8 w-full">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-green-600">
                  {t("success")}
                </h3>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-4 w-full max-w-md"
              >
                <div className="relative">
                  <Input
                    type="email"
                    placeholder={t("placeholder")}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrorMessage("");
                    }}
                    className={`w-full h-14 bg-white border-gray-200 focus:border-[#5B60D0] rounded-xl pr-12 ${
                      errorMessage ? "border-red-500 focus:border-red-500" : ""
                    }`}
                    required
                  />
                  {/* Icon */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail
                      className={`w-6 h-6 ${
                        errorMessage ? "text-red-500" : ""
                      }`}
                    />
                  </div>
                </div>
                {errorMessage && (
                  <p className="text-red-500 text-sm text-start w-full px-1">
                    {errorMessage}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-[#5B60D0] hover:bg-[#4A4EB0] text-white font-medium text-lg rounded-xl transition-all shadow-lg shadow-indigo-200"
                >
                  {loading ? t("loading") : t("button")}
                </Button>
              </form>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
