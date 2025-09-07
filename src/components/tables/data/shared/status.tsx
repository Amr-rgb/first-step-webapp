import { useTranslations } from "next-intl";

export type ReservationStatus =
  | "confirmed"
  | "waitingForPayment"
  | "waitingForConfirmation"
  | "rejected"
  | "cancelled"
  | "paid"
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
        return "bg-success text-white";
      case "waitingForPayment":
        return "bg-warning text-white";
      case "waitingForConfirmation":
        return "bg-light-gray text-white";
      case "rejected":
        return "bg-danger text-white";
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
