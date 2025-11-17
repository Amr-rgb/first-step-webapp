import { useTranslations } from "next-intl";

export type ReservationStatus =
  | "confirmed"
  | "waitingForPayment"
  | "waitingForConfirmation"
  | "rejected"
  | "cancelled"
  | "paid"
  | "existing"
  | "expired"
  | "selectChild";

export function useReservationStatus() {
  const t = useTranslations("dashboard.tables.shared.status");

  function mapStatus(status: string): ReservationStatus {
    switch (status.toLowerCase()) {
      case "accepted":
        return "confirmed";
      case "pending":
        return "waitingForConfirmation";
      case "rejected":
        return "rejected";
      case "cancelled":
        return "cancelled";
      case "paid":
        return "paid";
      case "existing":
        return "existing";
      case "expired":
        return "expired";
      default:
        return status as ReservationStatus;
    }
  }

  function getStatusText(status: string): string {
    const mappedStatus = mapStatus(status);
    return t(mappedStatus);
  }

  function getStatusColorClass(status: string): string {
    const mappedStatus = mapStatus(status);
    switch (mappedStatus) {
      case "confirmed":
        return "bg-warning text-white";
      case "waitingForPayment":
        return "bg-warning text-white";
      case "waitingForConfirmation":
        return "bg-[#9891FF] text-white";
      case "rejected":
        return "bg-danger text-white";
      case "cancelled":
        return "bg-black text-white";
      case "paid":
        return "bg-success text-white";
      case "existing":
        return "bg-info text-white";
      case "expired":
        return "bg-mid-gray text-white";
      case "selectChild":
        return "bg-info text-white";
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
