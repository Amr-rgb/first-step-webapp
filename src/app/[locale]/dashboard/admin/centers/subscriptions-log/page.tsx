"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { format } from "date-fns";
import { arSA, enUS } from "date-fns/locale";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Dummy data
const centers = [
  {
    id: 1,
    name: "اسم المركز",
    address: "السعودية، المدينة، الحي، الشارع، رقم البناية",
    subscriptionType: "ربع سنوي",
    status: "منتهي",
    startDate: "2025-05-20",
    endDate: "2025-08-20",
    logo: "https://images.unsplash.com/photo-1755845711249-32cfcdcabfeb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    name: "اسم المركز",
    address: "السعودية، المدينة، الحي، الشارع، رقم البناية",
    subscriptionType: "ربع سنوي",
    status: "ساري",
    startDate: "2025-05-20",
    endDate: "2025-08-20",
    logo: "https://images.unsplash.com/photo-1755845711249-32cfcdcabfeb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    name: "اسم المركز",
    address: "السعودية، المدينة، الحي، الشارع، رقم البناية",
    subscriptionType: "ربع سنوي",
    status: "ساري",
    startDate: "2025-05-20",
    endDate: "2025-08-20",
    logo: "https://images.unsplash.com/photo-1755845711249-32cfcdcabfeb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default function CentersSubscriptionsLog() {
  return (
    <div className="container mx-auto px-4 space-y-6">
      {centers.map((center) => (
        <CenterSubscriptionCard key={center.id} center={center} />
      ))}
    </div>
  );
}

interface Center {
  id: number;
  name: string;
  address: string;
  subscriptionType: string;
  status: string;
  startDate: string;
  endDate: string;
  logo: string;
}

function CenterSubscriptionCard({ center }: { center: Center }) {
  const locale = useLocale();
  const isActive = center.status === "ساري";

  return (
    <Card className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4">
      <CardHeader className="flex-1 flex flex-col justify-between gap-4">
        <div className="flex flex-row items-center gap-4">
          <Image
            className="size-20 object-center object-cover rounded-full bg-primary-blue/20"
            src={center.logo || "/assets/logos/instagram-logo.png"}
            width={81.66}
            height={80}
            alt="Nursery Logo"
          />

          <div>
            <CardTitle className="text-primary text-lg">
              {center.name}
            </CardTitle>
            <p className="text-gray text-sm">العنوان: {center.address}</p>
          </div>
        </div>

        {isActive ? (
          <Button
            size="long"
            variant="outline"
            className="mt-4 !border-destructive !text-destructive w-full md:w-auto"
          >
            إلغاء اشتراك المركز
          </Button>
        ) : (
          <Button size="long" className="mt-4 w-full md:w-auto">
            ارسال تنبيه بالدفع
          </Button>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-6">
        <div className="flex gap-2 items-center">
          <span className="font-bold text-primary">نوع الاشتراك:</span>
          <span>{center.subscriptionType}</span>
        </div>

        <div className="flex gap-2 items-center">
          <span className="font-bold text-primary">حالة الاشتراك:</span>
          <Badge
            className={
              isActive ? "bg-success text-white" : "bg-destructive text-white"
            }
          >
            {center.status}
          </Badge>
        </div>

        <div className="flex gap-2 text-mid-gray">
          <span className="font-bold text-primary">البداية:</span>
          <span>
            {format(new Date(center.startDate), "EEEE - yyyy/M/d", {
              locale: locale === "ar" ? arSA : enUS,
            })}
          </span>
        </div>
        <div className="flex gap-2 text-mid-gray">
          <span className="font-bold text-primary">النهاية:</span>
          <span>
            {format(new Date(center.endDate), "EEEE - yyyy/M/d", {
              locale: locale === "ar" ? arSA : enUS,
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
