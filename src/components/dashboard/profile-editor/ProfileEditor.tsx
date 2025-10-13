"use client";

import { ProfileSection } from "@/types";
import { Fragment, useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash, CheckSquare, Square, Upload, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { centerService, getBranchPricing } from "@/services/dashboardApi";
import { useQuery } from "@tanstack/react-query";

// Custom hooks for fetching data
const useBranches = () => {
  return useQuery({
    queryKey: ["branches"],
    queryFn: async () => {
      try {
        const response = await centerService.getBranches();
        return response || [];
      } catch (error) {
        console.error("❌ Error fetching branches:", error);
        toast.error("Failed to fetch branches");
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

const useAllBranchPricing = (branches: any[]) => {
  return useQuery({
    queryKey: ["allBranchPricing", branches.map((b) => b.id)],
    queryFn: async () => {
      try {
        const pricingPromises = branches.map(async (branch: any) => {
          try {
            const response = await getBranchPricing(branch.id.toString());
            return {
              branch_id: branch.id,
              pricing: response.data || [],
            };
          } catch (error) {
            console.error(
              `Error fetching pricing for branch ${branch.id}:`,
              error
            );
            return {
              branch_id: branch.id,
              pricing: [],
            };
          }
        });

        const results = await Promise.all(pricingPromises);
        return results;
      } catch (error) {
        console.error("❌ Error fetching all pricing:", error);
        return [];
      }
    },
    enabled: branches.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

interface ImageUploaderProps {
  value: string | File | null;
  onChange: (file: File | null) => void;
  placeholder?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  placeholder = "Upload image",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if the file is an image
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (JPEG, PNG, etc.)");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      // Store the actual file object
      onChange(file);
      setIsUploading(false);
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error("Failed to process image");
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Get display URL for preview
  const getDisplayUrl = () => {
    if (value instanceof File) {
      return URL.createObjectURL(value);
    }

    // Handle case where value might be a character array or malformed string
    if (Array.isArray(value)) {
      console.log("🖼️ Converting character array to string:", value);
      // Convert character array to string
      return value.join("");
    }

    // Handle case where value is an object with numeric keys (character array as object)
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      const keys = Object.keys(value)
        .filter((key) => !isNaN(Number(key)))
        .sort((a, b) => Number(a) - Number(b));
      if (keys.length > 0) {
        console.log("🖼️ Converting object character array to string:", value);
        return keys.map((key) => value[key]).join("");
      }
    }

    // Ensure value is a string
    if (typeof value === "string" && value.trim()) {
      return value;
    }

    console.log("🖼️ Invalid image value:", value, "Type:", typeof value);
    return undefined;
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (value instanceof File) {
        URL.revokeObjectURL(URL.createObjectURL(value));
      }
    };
  }, [value]);

  return (
    <div className="space-y-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={isUploading}
      />
      <div
        onClick={handleClick}
        className={`border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${
          isUploading ? "bg-gray-50" : "hover:bg-gray-50"
        }`}
        aria-disabled={isUploading}
      >
        {value ? (
          <div className="relative w-full">
            <div className="relative w-full h-32 overflow-hidden rounded-md border border-gray-200 bg-white">
              <img
                src={getDisplayUrl()}
                alt="Preview"
                className="w-full h-full object-contain p-1"
                onError={(e) => {
                  console.error("Failed to load image:", value);
                  e.currentTarget.src =
                    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+CiAgPHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNmOWY5ZjkiLz4KICA8dGV4dCB4PSIzNSIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzk5OSI+SW1hZ2Ugbm90IGZvdW5kPC90ZXh0Pgo8L3N2Zz4=";
                }}
              />
              {isUploading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>
            {!isUploading && (
              <div className="absolute inset-0 bg-white/0 hover:bg-white/50 flex items-center justify-center transition-all">
                <span className="text-gray-700 bg-white/90 px-3 py-1 rounded-full text-sm border border-gray-200 shadow-sm">
                  Change Image
                </span>
              </div>
            )}
          </div>
        ) : (
          <>
            <Upload className="w-6 h-6 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 text-center">
              {isUploading ? "Uploading..." : "Click to upload an image"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              PNG, JPG, JPEG up to 5MB
            </p>
          </>
        )}
      </div>
      {value && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => onChange(null)}
          disabled={isUploading}
        >
          Remove Image
        </Button>
      )}
    </div>
  );
};

interface ProfileEditorProps {
  sections: ProfileSection[];
  onSectionUpdate: (sectionId: string, data: any) => void;
  onSectionToggle: (sectionId: string, enabled: boolean) => void;
  onSectionDelete: (sectionId: string) => void;
}

const ProfileEditor = ({
  sections,
  onSectionUpdate,
  onSectionToggle,
  onSectionDelete,
}: ProfileEditorProps) => {
  const t = useTranslations("dashboard.profileEditor");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );
  const [hasProcessedPricing, setHasProcessedPricing] = useState(false);

  // Use React Query hooks
  const { data: branches = [], isLoading: loadingBranches } = useBranches();
  const { data: allPricingData = [], isLoading: loadingPricing } =
    useAllBranchPricing(branches);

  // Process pricing data when all queries are loaded
  useEffect(() => {
    if (
      !loadingPricing &&
      !loadingBranches &&
      branches.length > 0 &&
      allPricingData.length > 0 &&
      !hasProcessedPricing
    ) {
      // Update plans section with existing pricing data
      const plansSection = sections.find((section) => section.type === "plans");

      if (plansSection) {
        console.log("🔍 All pricing data:", allPricingData);
        const allPlans = allPricingData.flatMap((result: any) => {
          console.log("🔍 Processing result:", result);
          if (result && result.pricing && Array.isArray(result.pricing)) {
            return result.pricing.map((price: any) => {
              console.log("🔍 Processing price:", price);
              return {
                branch_id: result.branch_id,
                title: price.title || "",
                enrollment_type: price.enrollment_type || "month",
                age_start: price.start_age || 1,
                age_end: price.end_age || 12,
                count: price.count || 1,
                price_amount: price.price_amount || 100,
              };
            });
          }
          return [];
        });

        console.log("🔍 All plans processed:", allPlans);
        if (allPlans.length > 0) {
          console.log("🔍 Updating plans section with:", allPlans);
          onSectionUpdate(plansSection.id, { plans: allPlans });
          // Enable the plans section if there's existing data
          onSectionToggle(plansSection.id, true);
        }
        setHasProcessedPricing(true);
      }
    }
  }, [
    allPricingData,
    branches,
    loadingPricing,
    loadingBranches,
    hasProcessedPricing,
  ]);

  // Reset the flag when branches change (indicating a new center)
  useEffect(() => {
    setHasProcessedPricing(false);
  }, [branches]);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const addListItem = (
    sectionId: string,
    listKey: string,
    defaultItem: any
  ) => {
    const section = sections.find((s) => s.id === sectionId);
    if (section) {
      const currentList = section.data[listKey] || [];
      onSectionUpdate(sectionId, {
        [listKey]: [...currentList, defaultItem],
      });
    }
  };

  const updateListItem = (
    sectionId: string,
    listKey: string,
    index: number,
    updatedItem: any
  ) => {
    const section = sections.find((s) => s.id === sectionId);
    if (section) {
      const currentList = [...(section.data[listKey] || [])];
      currentList[index] = { ...currentList[index], ...updatedItem };
      onSectionUpdate(sectionId, {
        [listKey]: currentList,
      });
    }
  };

  const removeListItem = (
    sectionId: string,
    listKey: string,
    index: number
  ) => {
    const section = sections.find((s) => s.id === sectionId);
    if (section) {
      const currentList = [...(section.data[listKey] || [])];
      currentList.splice(index, 1);
      onSectionUpdate(sectionId, {
        [listKey]: currentList,
      });
    }
  };

  const renderSectionFields = (section: ProfileSection) => {
    switch (section.type) {
      case "hero":
        return (
          <div className="space-y-4">
            <div>
              <Label>Nursery Name</Label>
              <Input
                placeholder="Enter nursery name"
                value={section.data.title || ""}
                onChange={(e) =>
                  onSectionUpdate(section.id, { title: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Slogan</Label>
              <Input
                placeholder="Enter slogan"
                value={section.data.subtitle || ""}
                onChange={(e) =>
                  onSectionUpdate(section.id, { subtitle: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Enter hero description"
                value={section.data.description || ""}
                onChange={(e) =>
                  onSectionUpdate(section.id, { description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div>
              <Label>Background Image</Label>
              <ImageUploader
                value={section.data.image || ""}
                onChange={(url) => onSectionUpdate(section.id, { image: url })}
              />
            </div>
            <div>
              <Label>Call-to-Action button</Label>
              <Input
                placeholder="Get Started"
                value={section.data.ctaText || ""}
                onChange={(e) =>
                  onSectionUpdate(section.id, { ctaText: e.target.value })
                }
              />
            </div>
            <input type="hidden" value="#programs" />
          </div>
        );

      case "about":
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                placeholder="About Our Nursery"
                value={section.data.title || ""}
                onChange={(e) =>
                  onSectionUpdate(section.id, { title: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Tell your story..."
                value={section.data.description || ""}
                onChange={(e) =>
                  onSectionUpdate(section.id, { description: e.target.value })
                }
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Mission</Label>
                <Textarea
                  placeholder="Our mission..."
                  value={section.data.mission || ""}
                  onChange={(e) =>
                    onSectionUpdate(section.id, { mission: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div>
                <Label>Vision</Label>
                <Textarea
                  placeholder="Our vision..."
                  value={section.data.vision || ""}
                  onChange={(e) =>
                    onSectionUpdate(section.id, { vision: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Gallery Images</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    addListItem(section.id, "images", { url: "", caption: "" })
                  }
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Image
                </Button>
              </div>
              {(section.data.images || []).map((image: any, index: number) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="w-full">
                    <Label>Gallery Image</Label>
                    <ImageUploader
                      value={image.url || ""}
                      onChange={(url) =>
                        updateListItem(section.id, "images", index, { url })
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Caption (optional)"
                      value={image.caption || ""}
                      onChange={(e) =>
                        updateListItem(section.id, "images", index, {
                          caption: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeListItem(section.id, "images", index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );

      case "services":
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input
                placeholder="Our Services"
                value={section.data.title || ""}
                onChange={(e) =>
                  onSectionUpdate(section.id, { title: e.target.value })
                }
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Services</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    addListItem(section.id, "services", {
                      title: "",
                      description: "",
                      image: "",
                    })
                  }
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Service
                </Button>
              </div>
              {(section.data.services || []).map(
                (service: any, index: number) => (
                  <Card
                    key={index}
                    className="p-4 border-2 border-dashed border-gray-200"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Service {index + 1}</h4>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            removeListItem(section.id, "services", index)
                          }
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                      <Input
                        placeholder="Service title"
                        value={service.title || ""}
                        onChange={(e) =>
                          updateListItem(section.id, "services", index, {
                            title: e.target.value,
                          })
                        }
                      />
                      <Textarea
                        placeholder="Service description"
                        value={service.description || ""}
                        onChange={(e) =>
                          updateListItem(section.id, "services", index, {
                            description: e.target.value,
                          })
                        }
                        rows={2}
                      />
                      <div>
                        <Label>Service Image</Label>
                        <ImageUploader
                          value={service.image_service || service.image || null}
                          onChange={(file) =>
                            updateListItem(section.id, "services", index, {
                              image_service: file,
                            })
                          }
                        />
                      </div>
                    </div>
                  </Card>
                )
              )}
            </div>
          </div>
        );

      case "plans":
        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-base font-semibold text-gray-900">
                  {t("sections.plans.educationalPrograms")}
                </Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    addListItem(section.id, "plans", {
                      branch_id: "",
                      title: "",
                      enrollment_type: "month",
                      age_start: 1,
                      age_end: 12, // Minimum required by API
                      count: 1,
                      price_amount: 100,
                    })
                  }
                >
                  <Plus className="w-4 h-4 mr-2" />{" "}
                  {t("sections.plans.addProgram")}
                </Button>
              </div>
              {(section.data.plans || []).map((plan: any, index: number) => (
                <Card
                  key={index}
                  className="p-6 border-2 border-dashed border-gray-200 mb-6"
                >
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-lg text-gray-900">
                        {t("sections.plans.program")} {index + 1}
                      </h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          removeListItem(section.id, "plans", index)
                        }
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Branch Selection */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        {t("sections.plans.branch")}
                      </Label>
                      <Select
                        value={plan.branch_id || ""}
                        onValueChange={(value) =>
                          updateListItem(section.id, "plans", index, {
                            branch_id: value,
                          })
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue
                            placeholder={t("sections.plans.selectBranch")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingBranches ? (
                            <SelectItem value="" disabled>
                              {t("sections.plans.loadingBranches")}
                            </SelectItem>
                          ) : (
                            branches.map((branch: any) => (
                              <SelectItem
                                key={branch.id}
                                value={branch.id.toString()}
                              >
                                {branch.nursery_name_branch || branch.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Program Title */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        {t("sections.plans.programName")}
                      </Label>
                      <Input
                        placeholder={t("sections.plans.programNamePlaceholder")}
                        value={plan.title || ""}
                        onChange={(e) =>
                          updateListItem(section.id, "plans", index, {
                            title: e.target.value,
                          })
                        }
                        className="h-10"
                      />
                    </div>

                    {/* Age Group */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700">
                        {t("sections.plans.ageGroup")}
                      </Label>

                      {/* Range Slider */}
                      <div className="space-y-4">
                        <div className="relative h-6 flex items-center">
                          <input
                            type="range"
                            min="1"
                            max="50"
                            step="1"
                            value={plan.age_start || 1}
                            onChange={(e) => {
                              const start = parseInt(e.target.value);
                              const end = plan.age_end || start;
                              updateListItem(section.id, "plans", index, {
                                age_start: Math.max(1, start),
                                age_end: Math.max(start, end),
                                age_group: `${Math.max(1, start)}-${Math.max(
                                  start,
                                  end
                                )}`,
                              });
                            }}
                            className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-track]:bg-gradient-to-r [&::-webkit-slider-track]:from-blue-400 [&::-webkit-slider-track]:to-gray-200 [&::-webkit-slider-track]:bg-[length:var(--range-progress,0%)_100%] [&::-webkit-slider-track]:bg-no-repeat [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-blue-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-3 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-track]:bg-gradient-to-r [&::-moz-range-track]:from-blue-400 [&::-moz-range-track]:to-gray-200 [&::-moz-range-track]:bg-[length:var(--range-progress,0%)_100%] [&::-moz-range-track]:bg-no-repeat [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:bg-blue-400 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-3 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-pointer z-20"
                            style={
                              {
                                "--range-progress": `${
                                  ((plan.age_start || 0) / 50) * 100
                                }%`,
                              } as React.CSSProperties
                            }
                          />
                          <input
                            type="range"
                            min="12"
                            max="50"
                            step="1"
                            value={plan.age_end || 12}
                            onChange={(e) => {
                              const end = parseInt(e.target.value);
                              const start = plan.age_start || 1;
                              updateListItem(section.id, "plans", index, {
                                age_start: Math.min(start, end),
                                age_end: Math.max(12, end), // Minimum 12 for API
                                age_group: `${Math.min(start, end)}-${Math.max(
                                  12,
                                  end
                                )}`,
                              });
                            }}
                            className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-track]:bg-gradient-to-r [&::-webkit-slider-track]:from-blue-400 [&::-webkit-slider-track]:to-gray-200 [&::-webkit-slider-track]:bg-[length:var(--range-progress,0%)_100%] [&::-webkit-slider-track]:bg-no-repeat [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-track]:rounded-full [&::-webkit-slider-thumb]:border-3 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-track]:bg-gradient-to-r [&::-moz-range-track]:from-blue-400 [&::-moz-range-track]:to-gray-200 [&::-moz-range-track]:bg-[length:var(--range-progress,0%)_100%] [&::-moz-range-track]:bg-no-repeat [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-3 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-pointer z-20"
                            style={
                              {
                                "--range-progress": `${
                                  ((plan.age_end || 0) / 50) * 100
                                }%`,
                              } as React.CSSProperties
                            }
                          />
                        </div>
                      </div>

                      {/* Manual Input Fields */}
                      <div className="space-y-2">
                        <div className="text-xs text-gray-600 font-medium">
                          {t("sections.plans.setAgeRangeManually")}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs text-gray-600">
                              {t("sections.plans.fromAge")}
                            </Label>
                            <Input
                              type="number"
                              min="1"
                              max="50"
                              placeholder={t(
                                "sections.plans.ageGroups.fromAge"
                              )}
                              value={plan.age_start || ""}
                              onChange={(e) => {
                                const start = parseInt(e.target.value) || 1;
                                const end = plan.age_end || start;
                                updateListItem(section.id, "plans", index, {
                                  age_start: Math.max(1, start),
                                  age_end: Math.max(start, end),
                                  age_group: `${Math.max(1, start)}-${Math.max(
                                    start,
                                    end
                                  )}`,
                                });
                              }}
                              className="h-10 text-center"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-gray-600">
                              {t("sections.plans.toAge")}
                            </Label>
                            <Input
                              type="number"
                              min="12"
                              max="50"
                              placeholder={t("sections.plans.ageGroups.toAge")}
                              value={plan.age_end || ""}
                              onChange={(e) => {
                                const end = parseInt(e.target.value) || 12;
                                const start = plan.age_start || 1;
                                updateListItem(section.id, "plans", index, {
                                  age_start: Math.min(start, end),
                                  age_end: Math.max(12, end), // Minimum 12 for API
                                  age_group: `${Math.min(
                                    start,
                                    end
                                  )}-${Math.max(12, end)}`,
                                });
                              }}
                              className="h-10 text-center"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enrollment Type */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Enrollment Type
                      </Label>
                      <Select
                        value={plan.enrollment_type || "month"}
                        onValueChange={(value) =>
                          updateListItem(section.id, "plans", index, {
                            enrollment_type: value,
                          })
                        }
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select enrollment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hour">Hour</SelectItem>
                          <SelectItem value="day">Day</SelectItem>
                          <SelectItem value="month">Month</SelectItem>
                          <SelectItem value="year">Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Duration */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Duration
                      </Label>
                      <Input
                        type="number"
                        placeholder="2"
                        value={plan.count || ""}
                        onChange={(e) =>
                          updateListItem(section.id, "plans", index, {
                            count: parseInt(e.target.value) || 0,
                          })
                        }
                        className="h-10"
                      />
                      <p className="text-xs text-gray-500">
                        {plan.enrollment_type === "hour" && "hours"}
                        {plan.enrollment_type === "day" && "days"}
                        {plan.enrollment_type === "month" && "months"}
                        {plan.enrollment_type === "year" && "years"}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Price Amount
                      </Label>
                      <Input
                        type="number"
                        placeholder="800"
                        value={plan.price_amount || ""}
                        onChange={(e) =>
                          updateListItem(section.id, "plans", index, {
                            price_amount: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="h-10"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case "philosophy":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium mb-2">Our Philosophy</h4>
                <input
                  type="hidden"
                  value="Our Philosophy"
                  onChange={() => {}}
                />
              </div>
              <div>
                <h4 className="font-medium mb-2">Our Methodology</h4>
                <input
                  type="hidden"
                  value="Our Methodology"
                  onChange={() => {}}
                />
              </div>
              <div>
                <h4 className="font-medium mb-2">Our Goal</h4>
                <input type="hidden" value="Our Goal" onChange={() => {}} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Philosophy Content</Label>
                <Textarea
                  placeholder="Our philosophy..."
                  value={section.data.philosophy || ""}
                  onChange={(e) =>
                    onSectionUpdate(section.id, { philosophy: e.target.value })
                  }
                  rows={4}
                />
              </div>
              <div>
                <Label>Methodology Content</Label>
                <Textarea
                  placeholder="Our methodology..."
                  value={section.data.methodology || ""}
                  onChange={(e) =>
                    onSectionUpdate(section.id, { methodology: e.target.value })
                  }
                  rows={4}
                />
              </div>
              <div>
                <Label>Goal Content</Label>
                <Textarea
                  placeholder="Our goal..."
                  value={section.data.goal || ""}
                  onChange={(e) =>
                    onSectionUpdate(section.id, { goal: e.target.value })
                  }
                  rows={4}
                />
              </div>
            </div>
          </div>
        );

      case "branches":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Our Branches</h3>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Branches</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    addListItem(section.id, "branches", { name: "" })
                  }
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Branch
                </Button>
              </div>
              {(section.data.branches || []).map(
                (branch: any, index: number) => (
                  <div key={index} className="flex gap-2 items-end">
                    <Input
                      placeholder="Branch name"
                      value={branch.name || ""}
                      onChange={(e) =>
                        updateListItem(section.id, "branches", index, {
                          name: e.target.value,
                        })
                      }
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        removeListItem(section.id, "branches", index)
                      }
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )
              )}
            </div>
          </div>
        );

      case "stats":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Area (sqm)</Label>
                <Input
                  placeholder="2000"
                  value={section.data.area || ""}
                  onChange={(e) =>
                    onSectionUpdate(section.id, { area: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Classrooms</Label>
                <Input
                  type="number"
                  min="1"
                  placeholder="10"
                  value={section.data.classrooms || ""}
                  onChange={(e) => {
                    const value = Math.max(1, parseInt(e.target.value) || 1);
                    onSectionUpdate(section.id, {
                      classrooms: value.toString(),
                    });
                  }}
                />
              </div>
              <div>
                <Label>Team Members</Label>
                <Input
                  type="number"
                  min="1"
                  placeholder="25"
                  value={section.data.teamMembers || ""}
                  onChange={(e) => {
                    const value = Math.max(1, parseInt(e.target.value) || 1);
                    onSectionUpdate(section.id, {
                      teamMembers: value.toString(),
                    });
                  }}
                />
              </div>
            </div>
          </div>
        );

      case "team":
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input
                placeholder="Meet Our Team"
                value={section.data.title || ""}
                onChange={(e) =>
                  onSectionUpdate(section.id, { title: e.target.value })
                }
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Team Members</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    addListItem(section.id, "members", {
                      name: "",
                      role: "",
                      image: "",
                      bio: "",
                    })
                  }
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Member
                </Button>
              </div>
              {(section.data.members || []).map(
                (member: any, index: number) => (
                  <Card
                    key={index}
                    className="p-4 border-2 border-dashed border-gray-200"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Team Member {index + 1}</h4>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            removeListItem(section.id, "members", index)
                          }
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Full name"
                          value={member.name || ""}
                          onChange={(e) =>
                            updateListItem(section.id, "members", index, {
                              name: e.target.value,
                            })
                          }
                        />
                        <Input
                          placeholder="Role/Position"
                          value={member.role || ""}
                          onChange={(e) =>
                            updateListItem(section.id, "members", index, {
                              role: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Profile Image</Label>
                        <ImageUploader
                          value={member.image || null}
                          onChange={(file) =>
                            updateListItem(section.id, "members", index, {
                              image: file,
                            })
                          }
                        />
                      </div>
                      <Textarea
                        placeholder="Bio (optional)"
                        value={member.bio || ""}
                        onChange={(e) =>
                          updateListItem(section.id, "members", index, {
                            bio: e.target.value,
                          })
                        }
                        rows={2}
                      />
                    </div>
                  </Card>
                )
              )}
            </div>
          </div>
        );

      case "activities":
        return (
          <div className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input
                placeholder="Our Activities"
                value={section.data.title || ""}
                onChange={(e) =>
                  onSectionUpdate(section.id, { title: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                placeholder="Discover what we do"
                value={section.data.subtitle || ""}
                onChange={(e) =>
                  onSectionUpdate(section.id, { subtitle: e.target.value })
                }
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Activity Images</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    addListItem(section.id, "images", { url: "", caption: "" })
                  }
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Image
                </Button>
              </div>
              {(section.data.images || []).map((image: any, index: number) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="w-full">
                    <Label>Activity Image</Label>
                    <ImageUploader
                      value={image.url || image || null}
                      onChange={(file) =>
                        updateListItem(section.id, "images", index, {
                          url: file,
                        })
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Caption (optional)"
                      value={image.caption || ""}
                      onChange={(e) =>
                        updateListItem(section.id, "images", index, {
                          caption: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeListItem(section.id, "images", index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );

      case "contact":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Address</Label>
                <Textarea
                  placeholder="Full address"
                  value={section.data.address || ""}
                  onChange={(e) =>
                    onSectionUpdate(section.id, { address: e.target.value })
                  }
                  rows={2}
                />
              </div>
              <div>
                <Label>Working Hours</Label>
                <Textarea
                  placeholder="Mon-Fri: 8AM-6PM"
                  value={section.data.workingHours || ""}
                  onChange={(e) =>
                    onSectionUpdate(section.id, {
                      workingHours: e.target.value,
                    })
                  }
                  rows={2}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Phone Number</Label>
                <Input
                  placeholder="+1 (555) 123-4567"
                  value={section.data.phone || ""}
                  onChange={(e) =>
                    onSectionUpdate(section.id, { phone: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Email Address</Label>
                <Input
                  type="email"
                  placeholder="info@nursery.com"
                  value={section.data.email || ""}
                  onChange={(e) => {
                    const email = e.target.value;
                    // Basic email validation
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (email && !emailRegex.test(email)) {
                      toast.error("Please enter a valid email address");
                    }
                    onSectionUpdate(section.id, { email });
                  }}
                />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mt-4">
                Social media links have been removed as per requirements.
              </p>
              <input
                type="hidden"
                value={JSON.stringify({})}
                onChange={() => {}}
              />
            </div>
          </div>
        );
        return (
          <div className="space-y-4">
            <div>
              <Label>Hero Title</Label>
              <Input
                placeholder="Welcome to our nursery"
                value={section.data.title || ""}
                onChange={(e) =>
                  onSectionUpdate(section.id, { title: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Hero Subtitle</Label>
              <Input
                placeholder="We provide a safe and nurturing environment for your child"
                value={section.data.subtitle || ""}
                onChange={(e) =>
                  onSectionUpdate(section.id, { subtitle: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Hero Image</Label>
              <ImageUploader
                value={section.data.image || ""}
                onChange={(url) => onSectionUpdate(section.id, { image: url })}
              />
            </div>
          </div>
        );

      case "philosophy":
        return (
          <div className="space-y-4">
            <div>
              <Label>Philosophy Title</Label>
              <Input
                placeholder="Our Philosophy"
                value={section.data.title || ""}
                onChange={(e) =>
                  onSectionUpdate(section.id, { title: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Philosophy Text</Label>
              <Textarea
                placeholder="Our philosophy is to provide a safe and nurturing environment for your child"
                value={section.data.text || ""}
                onChange={(e) =>
                  onSectionUpdate(section.id, { text: e.target.value })
                }
                rows={4}
              />
            </div>
          </div>
        );

      case "branches":
        return (
          <div className="space-y-4">
            <div>
              <Label>Branches Title</Label>
              <Input
                placeholder="Our Branches"
                value={section.data.title || ""}
                onChange={(e) =>
                  onSectionUpdate(section.id, { title: e.target.value })
                }
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Branches</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    addListItem(section.id, "branches", {
                      name: "",
                      address: "",
                      phone: "",
                      email: "",
                    })
                  }
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Branch
                </Button>
              </div>
              {(section.data.branches || []).map(
                (branch: any, index: number) => (
                  <Card
                    key={index}
                    className="p-4 border-2 border-dashed border-gray-200"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Branch {index + 1}</h4>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            removeListItem(section.id, "branches", index)
                          }
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Branch name"
                          value={branch.name || ""}
                          onChange={(e) =>
                            updateListItem(section.id, "branches", index, {
                              name: e.target.value,
                            })
                          }
                        />
                        <Input
                          placeholder="Branch address"
                          value={branch.address || ""}
                          onChange={(e) =>
                            updateListItem(section.id, "branches", index, {
                              address: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Branch phone"
                          value={branch.phone || ""}
                          onChange={(e) =>
                            updateListItem(section.id, "branches", index, {
                              phone: e.target.value,
                            })
                          }
                        />
                        <Input
                          placeholder="Branch email"
                          value={branch.email || ""}
                          onChange={(e) =>
                            updateListItem(section.id, "branches", index, {
                              email: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </Card>
                )
              )}
            </div>
          </div>
        );

      case "plans":

      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <div className="w-12 h-12 mx-auto mb-2 opacity-50 flex items-center justify-center">
              <Plus className="w-8 h-8" />
            </div>
            <p>Section type not implemented yet</p>
          </div>
        );
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Available Sections
        </h2>
        <p className="text-gray-600">
          Toggle sections on/off and customize their content. Changes will be
          reflected in the preview instantly.
        </p>
      </div>

      {sections.map((section) => (
        <Card
          key={section.id}
          className={`border-2 transition-all duration-200 ${
            section.enabled
              ? "border-primary/20 bg-primary/5 shadow-md"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <div className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    section.enabled ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
                <h3
                  className={`text-lg font-semibold ${
                    section.enabled ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {section.name}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {section.enabled && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSectionDelete(section.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant={section.enabled ? "default" : "outline"}
                  onClick={() => onSectionToggle(section.id, !section.enabled)}
                  className={
                    section.enabled ? "bg-primary hover:bg-primary/90" : ""
                  }
                >
                  {section.enabled ? (
                    <>
                      <CheckSquare className="w-4 h-4 mr-2" />
                      Enabled
                    </>
                  ) : (
                    <>
                      <Square className="w-4 h-4 mr-2" />
                      Enable
                    </>
                  )}
                </Button>
              </div>
            </div>

            {section.enabled && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                {renderSectionFields(section)}
              </div>
            )}
          </div>
        </Card>
      ))}

      <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
        <div className="p-8 text-center">
          <div className="text-gray-400 mb-4">
            <Plus className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            More sections coming soon!
          </h3>
          <p className="text-gray-500">
            We're working on adding more customizable sections to help you
            create the perfect nursery profile.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ProfileEditor;
