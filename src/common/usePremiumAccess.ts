import { useEffect, useState } from "react";

export function usePremiumAccess(a3_phone_number?: string, iapId?: string) {
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (!a3_phone_number || !iapId) return;
    const checkAccess = async () => {
      try {
        const res = await fetch("/api/check-premium", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobileNumber: a3_phone_number,
            course_iap_id: iapId,
          }),
        });

        const result = await res.json();
        if (result.success) {
          setHasAccess(result.hasAccess);
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkAccess();
  }, [a3_phone_number, iapId]);

  return {
    hasAccess,
  };
}
