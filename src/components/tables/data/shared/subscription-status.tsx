import { useTranslations } from "next-intl";

export type SubscriptionStatus = "active" | "paymentPending" | "expired";

export function useSubscriptionStatus() {
  const t = useTranslations("dashboard.tables.subscriptions.status");

  function mapStatus(status: string): SubscriptionStatus {
    switch (status.toLowerCase()) {
      case "active":
        return "active";
      case "paymentpending":
      case "waitingforpayment":
      case "pendingpayment":
      case "onhold":
        return "paymentPending";
      case "expired":
      case "ended":
        return "expired";
      default:
        return status as SubscriptionStatus;
    }
  }

  function getStatusText(status: string): string {
    const mapped = mapStatus(status);
    return t(mapped);
  }

  function getStatusColorClass(status: string): string {
    const mapped = mapStatus(status);
    switch (mapped) {
      case "active":
        return "bg-success text-white";
      case "paymentPending":
        return "bg-warning text-white";
      case "expired":
        return "bg-danger text-white";
      default:
        return "";
    }
  }

  return {
    getStatusText,
    getStatusColorClass,
    mapStatus,
  };
}
