"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/promocodeService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import ExternalOfferCard from "./ExternalOfferCard";
import ExternalOfferForm from "./ExternalOfferForm";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { FilterButtons } from "@/components/common/FilterButtons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Define missing Dialog subcomponents locally if they don't exist in the main Dialog export
// Usually Shadcn Dialog exports DialogContent, DialogHeader, etc.
// If DialogDescription/Footer are missing, we can just use divs.
// I will verify standard shadcn structure usually has them.
// If not, I will use divs.

export default function ExternalOffers() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "deleted">("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isPermanentDelete, setIsPermanentDelete] = useState(false);

  const { data: offersData, isLoading } = useQuery({
    queryKey: ["external-offers"],
    queryFn: adminService.getExternalOffers,
  });

  const offers = useMemo(() => {
    const data = Array.isArray(offersData)
      ? offersData
      : offersData?.data || [];
    return data;
  }, [offersData]);

  const archiveMutation = useMutation({
    mutationFn: adminService.archiveExternalOffer,
    onSuccess: () => {
      toast.success("تم أرشفة العرض بنجاح");
      queryClient.invalidateQueries({ queryKey: ["external-offers"] });
      setDeleteId(null);
      setIsPermanentDelete(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء الأرشفة");
      setDeleteId(null);
      setIsPermanentDelete(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminService.deleteExternalOffer,
    onSuccess: () => {
      toast.success("تم حذف العرض نهائياً");
      queryClient.invalidateQueries({ queryKey: ["external-offers"] });
      setDeleteId(null);
      setIsPermanentDelete(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء الحذف");
      setDeleteId(null);
      setIsPermanentDelete(false);
    },
  });

  const confirmDelete = () => {
    if (deleteId) {
      if (isPermanentDelete) {
        deleteMutation.mutate(deleteId);
      } else {
        archiveMutation.mutate(deleteId);
      }
    }
  };

  const filteredOffers = useMemo(() => {
    return offers.filter((offer: any) => {
      const matchesSearch =
        offer.center_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.descriptions?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "active" && offer.status !== "archived") ||
        (filter === "deleted" && offer.status === "archived");

      return matchesSearch && matchesFilter;
    });
  }, [offers, searchQuery, filter]);

  const handleEdit = (offer: any) => {
    setEditingOffer(offer);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingOffer(null);
  };

  const filters = [
    { value: "all" as const, label: "الكل" },
    { value: "active" as const, label: "نشط" },
    { value: "deleted" as const, label: "محذوف" },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-12 w-full" />
        <div className="grid gap-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex justify-between items-center">
        <FilterButtons
          filters={filters}
          activeFilter={filter}
          onFilterChange={setFilter}
        />
      </div>

      {/* Search and Add */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <Button size="sm" variant="default" onClick={() => setIsFormOpen(true)}>
          <Plus className="w-5 h-5" />
          <span>إضافة عرض خارجي</span>
        </Button>

        <div className="relative w-full sm:w-96">
          <Input
            placeholder="ابحث عن كوبون خصم..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 text-right"
            dir="rtl"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredOffers.length > 0 ? (
          filteredOffers.map((offer: any) => (
            <ExternalOfferCard
              key={offer.id}
              offer={offer}
              onDelete={setDeleteId}
              onEdit={handleEdit}
            />
          ))
        ) : (
          <div className="text-center py-10 text-gray-500 col-span-full">
            لا توجد عروض مطابقة
          </div>
        )}
      </div>

      {/* Form Dialog */}
      <ExternalOfferForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        offer={editingOffer}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteId}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setDeleteId(null);
            setIsPermanentDelete(false);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-right">تأكيد الحذف</DialogTitle>
            <div className="text-right text-gray-500 mt-2">
              هل أنت متأكد من أنك تريد حذف هذا العرض؟
            </div>
          </DialogHeader>

          <div className="space-y-3 my-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="deleteType"
                checked={!isPermanentDelete}
                onChange={() => setIsPermanentDelete(false)}
                className="w-4 h-4"
              />
              <span className="text-sm">
                أرشفة العرض (يمكن استرجاعه لاحقاً)
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="deleteType"
                checked={isPermanentDelete}
                onChange={() => setIsPermanentDelete(true)}
                className="w-4 h-4"
              />
              <span className="text-sm text-red-600">
                حذف نهائي (لا يمكن استرجاعه)
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteId(null);
                setIsPermanentDelete(false);
              }}
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={archiveMutation.isPending || deleteMutation.isPending}
            >
              {archiveMutation.isPending || deleteMutation.isPending
                ? "جاري المعالجة..."
                : isPermanentDelete
                ? "حذف نهائي"
                : "أرشفة"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
