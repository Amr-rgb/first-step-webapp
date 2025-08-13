"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { paymentService } from "@/services/api";
import { useAuthStore } from "@/store/authStore";

const PaymentDebugger = () => {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runDebugTest = async () => {
    setIsLoading(true);
    const info: any = {};

    try {
      // Check environment variables
      info.environment = {
        apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
        hasXAuth: !!process.env.NEXT_PUBLIC_X_AUTHORIZATION,
        hasXAuthSecret: !!process.env.NEXT_PUBLIC_X_AUTHORIZATION_SECRET,
        nodeEnv: process.env.NODE_ENV,
      };

      // Check authentication state
      const authState = useAuthStore.getState();
      info.authentication = {
        hasToken: !!authState.token,
        hasUser: !!authState.user,
        userRole: authState.user?.role,
        isAuthenticated: authState.isAuthenticated(),
      };

      // Test API connection
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/health`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "X-Authorization": process.env.NEXT_PUBLIC_X_AUTHORIZATION || "",
              "X-Authorization-Secret":
                process.env.NEXT_PUBLIC_X_AUTHORIZATION_SECRET || "",
            },
          }
        );

        info.apiConnection = {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
        };
      } catch (apiError: any) {
        info.apiConnection = {
          error: apiError.message,
          type: "Network Error",
        };
      }

      // Test payment endpoint (without actually making payment)
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/payment/subscribe`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Authorization": process.env.NEXT_PUBLIC_X_AUTHORIZATION || "",
              "X-Authorization-Secret":
                process.env.NEXT_PUBLIC_X_AUTHORIZATION_SECRET || "",
              Authorization: authState.token ? `Bearer ${authState.token}` : "",
            },
            body: JSON.stringify({ plan_id: 1 }),
          }
        );

        info.paymentEndpoint = {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
        };

        if (response.ok) {
          try {
            const responseData = await response.json();
            info.paymentEndpoint.responseData = responseData;
            info.paymentEndpoint.hasSuccess = !!responseData.success;
            info.paymentEndpoint.hasPaymentUrl = !!responseData.payment_url;
            info.paymentEndpoint.responseKeys = Object.keys(responseData);
          } catch (jsonError) {
            info.paymentEndpoint.jsonError = "Failed to parse JSON response";
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          info.paymentEndpoint.error = errorData;
        }
      } catch (paymentError: any) {
        info.paymentEndpoint = {
          error: paymentError.message,
          type: "Network Error",
        };
      }
    } catch (error: any) {
      info.generalError = error.message;
    }

    setDebugInfo(info);
    setIsLoading(false);
  };

  const testPaymentService = async () => {
    setIsLoading(true);
    const info: any = {};

    try {
      console.log("Testing payment service directly...");
      const result = await paymentService.centerSubscribe(1);
      info.paymentServiceResult = {
        success: true,
        data: result,
        hasSuccess: !!result.success,
        hasPaymentUrl: !!result.payment_url,
        responseKeys: Object.keys(result),
      };
    } catch (error: any) {
      info.paymentServiceResult = {
        success: false,
        error: error.message,
        status: error.status,
        data: error.data,
      };
    }

    setDebugInfo(info);
    setIsLoading(false);
  };

  if (!process.env.NODE_ENV || process.env.NODE_ENV === "production") {
    return null; // Don't show in production unless explicitly enabled
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-md z-50">
      <h3 className="font-bold text-sm mb-2">Payment Debugger</h3>
      <div className="flex gap-2 mb-2">
        <Button onClick={runDebugTest} disabled={isLoading} size="sm">
          {isLoading ? "Testing..." : "Test Setup"}
        </Button>
        <Button
          onClick={testPaymentService}
          disabled={isLoading}
          size="sm"
          variant="outline"
        >
          {isLoading ? "Testing..." : "Test Payment"}
        </Button>
      </div>

      {debugInfo && (
        <div className="text-xs">
          <pre className="whitespace-pre-wrap overflow-auto max-h-64">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default PaymentDebugger;
