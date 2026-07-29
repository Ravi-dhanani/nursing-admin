import { useEffect, useState } from "react";

export interface UsePaymentStatusReturn {
  isPaid: boolean;
  isLoading: boolean;
  error: string | null;
}

export function usePaymentStatus(
  a3_phone_number?: string,
): UsePaymentStatusReturn {
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!a3_phone_number) {
      setIsPaid(false);
      setIsLoading(false);
      return;
    }

    const checkStatus = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch("/api/free-users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobileNumber: a3_phone_number,
          }),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();

        if (result.success) {
          // Checks for either result.isPaid or falls back to result.hasAccess
          setIsPaid(Boolean(result.isPaid ?? result.hasAccess));
        } else {
          setIsPaid(false);
          setError(result.error || "Failed to verify payment status");
        }
      } catch (err: any) {
        console.error("Payment Status Hook Error:", err);
        setError(err.message || "Failed to check payment status");
        setIsPaid(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, [a3_phone_number]);

  return {
    isPaid,
    isLoading,
    error,
  };
}
