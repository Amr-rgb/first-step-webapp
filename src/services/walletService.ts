import { ApiErrorHandler } from "@/lib/error-handling";
import { apiClient } from "./api";

export const walletService = {
  getDailyBalance: async ({ from, to }: { from: string; to: string }) => {
    try {
      const response = await apiClient.get("/center/wallet/daily-income", {
        params: { from, to },
      });
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  //   {
  //     "status": true,
  //     "message": "Success",
  //     "data": {
  //         "from": "2025-12-01",
  //         "to": "2025-12-16",
  //         "total": 18950,
  //         "days": [
  //             {
  //                 "date": "2025-12-01",
  //                 "total_income": 0
  //             },
  //             {
  //                 "date": "2025-12-02",
  //                 "total_income": 3950
  //             },
  //             {
  //                 "date": "2025-12-03",
  //                 "total_income": 0
  //             },
  //             {
  //                 "date": "2025-12-04",
  //                 "total_income": 0
  //             },
  //             {
  //                 "date": "2025-12-05",
  //                 "total_income": 0
  //             },
  //             {
  //                 "date": "2025-12-06",
  //                 "total_income": 0
  //             },
  //             {
  //                 "date": "2025-12-07",
  //                 "total_income": 6000
  //             },
  //             {
  //                 "date": "2025-12-08",
  //                 "total_income": 1500
  //             },
  //             {
  //                 "date": "2025-12-09",
  //                 "total_income": 0
  //             },
  //             {
  //                 "date": "2025-12-10",
  //                 "total_income": 3500
  //             },
  //             {
  //                 "date": "2025-12-11",
  //                 "total_income": 0
  //             },
  //             {
  //                 "date": "2025-12-12",
  //                 "total_income": 0
  //             },
  //             {
  //                 "date": "2025-12-13",
  //                 "total_income": 0
  //             },
  //             {
  //                 "date": "2025-12-14",
  //                 "total_income": 4000
  //             },
  //             {
  //                 "date": "2025-12-15",
  //                 "total_income": 0
  //             },
  //             {
  //                 "date": "2025-12-16",
  //                 "total_income": 0
  //             }
  //         ]
  //     }
  // }

  getAvailableBalance: async () => {
    try {
      const response = await apiClient.get("/center/wallet/balance");
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  //   {
  //     "total_paid": 50211,
  //     "total_withdrawn": 50211,
  //     "available_balance": 0
  // }

  getBalanceHistory: async () => {
    try {
      const response = await apiClient.get(
        "/center/wallet/enrollments-with-payments"
      );
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  //   {
  //     "data": [
  //         {
  //             "enrollment_id": 10,
  //             "status": "accepted",
  //             "enrollment_type": null,
  //             "price_amount": 120,
  //             "enrollment_date": "2025-05-29",
  //             "parent_name": null,
  //             "branch_name": "محمود حسنين",
  //             "branch_id": 13,
  //             "branch_price_id": null,
  //             "count": null,
  //             "starting_time": null,
  //             "ending_time": null,
  //             "starting_date": null,
  //             "ending_date": null,
  //             "day_string": null,
  //             "pricing": {
  //                 "original_amount": 120,
  //                 "discount": 0,
  //                 "final_amount": 120,
  //                 "discount_type": null
  //             },
  //             "balance_before": 0,
  //             "balance_after": 480,
  //             "children": [],
  //             "reservation": null,
  //             "payments": [
  //                 {
  //                     "order_id": 15,
  //                     "amount": "120.00",
  //                     "payment_status": "paid",
  //                     "paid_at": "2025-07-17T03:38:09.000000Z"
  //                 },
  //                 {
  //                     "order_id": 17,
  //                     "amount": "120.00",
  //                     "payment_status": "paid",
  //                     "paid_at": "2025-07-17T03:42:44.000000Z"
  //                 },
  //                 {
  //                     "order_id": 19,
  //                     "amount": "120.00",
  //                     "payment_status": "paid",
  //                     "paid_at": "2025-07-17T03:54:46.000000Z"
  //                 },
  //                 {
  //                     "order_id": 20,
  //                     "amount": "120.00",
  //                     "payment_status": "paid",
  //                     "paid_at": "2025-07-17T04:20:14.000000Z"
  //                 }
  //             ]
  //         },
  //         {
  //             "enrollment_id": 26,
  //             "status": "paid",
  //             "enrollment_type": null,
  //             "price_amount": 6500,
  //             "enrollment_date": "2025-07-07",
  //             "parent_name": "Mo'menn",
  //             "branch_name": "شحتة",
  //             "branch_id": 12,
  //             "branch_price_id": null,
  //             "count": null,
  //             "starting_time": null,
  //             "ending_time": null,
  //             "starting_date": null,
  //             "ending_date": null,
  //             "day_string": null,
  //             "pricing": {
  //                 "original_amount": 6500,
  //                 "discount": 0,
  //                 "final_amount": 6500,
  //                 "discount_type": null
  //             },
  //             "balance_before": 480,
  //             "balance_after": 6980,
  //             "children": [],
  //             "reservation": null,
  //             "payments": [
  //                 {
  //                     "order_id": 24,
  //                     "amount": "6500.00",
  //                     "payment_status": "paid",
  //                     "paid_at": "2025-07-21T06:30:50.000000Z"
  //                 }
  //             ]
  //         },
  //         {
  //             "enrollment_id": 36,
  //             "status": "paid",
  //             "enrollment_type": null,
  //             "price_amount": 5997,
  //             "enrollment_date": "2025-07-21",
  //             "parent_name": "Mo'menn",
  //             "branch_name": "fefseffefewfwe",
  //             "branch_id": 10,
  //             "branch_price_id": null,
  //             "count": null,
  //             "starting_time": null,
  //             "ending_time": null,
  //             "starting_date": null,
  //             "ending_date": null,
  //             "day_string": null,
  //             "pricing": {
  //                 "original_amount": 5997,
  //                 "discount": 0,
  //                 "final_amount": 5997,
  //                 "discount_type": null
  //             },
  //             "balance_before": 6980,
  //             "balance_after": 12977,
  //             "children": [],
  //             "reservation": null,
  //             "payments": [
  //                 {
  //                     "order_id": 23,
  //                     "amount": "5997.00",
  //                     "payment_status": "paid",
  //                     "paid_at": "2025-07-21T06:25:07.000000Z"
  //                 }
  //             ]
  //         },
  //     ]
  // }

  getRequestRecords: async () => {
    try {
      const response = await apiClient.get(
        "/center/wallet/request-for-withdraw"
      );
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  //   {
  //     "status": true,
  //     "message": "all withdraw requests",
  //     "data": [
  //         {
  //             "id": 1,
  //             "center_id": 1,
  //             "amount": "50211.00",
  //             "status": "accepted",
  //             "center_name": "center",
  //             "time_of_accepted": "2025-12-16T11:39:07.000000Z"
  //         }
  //     ]
  // }

  sendWithdrawRequest: async () => {
    try {
      const response = await apiClient.post("/center/wallet/withdraw/request");
      return response.data;
    } catch (error) {
      throw ApiErrorHandler.handle(error);
    }
  },

  //   422 {
  //     "message": "No available balance to withdraw"
  //    }
};
