"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarIcon, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { parentService } from "@/services/api";
import { toastSuccess, toastError } from "@/lib/toast";

//====================================INTERFACES====================================

interface Child {
  name: string;
  birthDate: Date | undefined;
  relationship: string;
  gender: "male" | "female" | "";
}

interface Parent {
  name: string;
  email: string;
  mobile: string;
}

interface ParentFamily {
  parent: Parent;
  children: Child[];
}

interface ParentAccountsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

//====================================MAIN COMPONENT====================================

const ParentAccountsModal: React.FC<ParentAccountsModalProps> = ({
  isOpen,
  onClose,
}) => {
  //====================================HOOKS & TRANSLATIONS====================================

  const t = useTranslations("parentAccounts");
  const locale = useLocale();
  const isRTL = locale === "ar";

  //====================================STATE MANAGEMENT====================================

  const [currentStep, setCurrentStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState<Record<string, boolean>>({});

  const [parent, setParent] = useState<Parent>({
    name: "",
    email: "",
    mobile: "",
  });

  const [children, setChildren] = useState<Child[]>([
    {
      name: "",
      birthDate: undefined,
      relationship: "",
      gender: "",
    },
  ]);

  const [parentFamilies, setParentFamilies] = useState<ParentFamily[]>([]);

  //====================================EVENT HANDLERS====================================

  const handleCreateAccount = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Prepare all families data
      const allFamilies = [...parentFamilies];
      if (parent.name || children.some((child) => child.name)) {
        allFamilies.push({ parent, children });
      }

      // Validate that we have at least one family with complete data
      const validFamilies = allFamilies.filter(
        (family) =>
          family.parent.name &&
          family.parent.email &&
          family.parent.mobile &&
          family.children.some(
            (child) =>
              child.name &&
              child.birthDate &&
              child.relationship &&
              child.gender
          )
      );

      if (validFamilies.length === 0) {
        toastError(t("pleaseFillRequiredFields"));
        return;
      }

      // Transform data to match API format
      const apiPayload = {
        parents: validFamilies.map((family) => ({
          name: family.parent.name,
          email: family.parent.email,
          phone: family.parent.mobile, // API expects 'phone' not 'mobile'
          children: family.children
            .filter(
              (child) =>
                child.name &&
                child.birthDate &&
                child.relationship &&
                child.gender
            )
            .map((child) => ({
              child_name: child.name, // API expects 'child_name' not 'name'
              birthday_date: child.birthDate!.toISOString().split("T")[0], // API expects 'birthday_date' not 'birthDate'
              kinship: child.relationship, // API expects 'kinship' not 'relationship'
              gender: (child.gender === "male" ? "boy" : "girl") as
                | "boy"
                | "girl", // API expects 'boy'/'girl' not 'male'/'female'
            })),
        })),
      };

      console.log("Submitting parent accounts:", apiPayload);

      // Call the API
      const response = await parentService.registerParentByCenter(apiPayload);

      console.log("API Response:", response);

      // Show success message
      toastSuccess(response.message || t("accountsCreatedSuccessfully"));
      setIsSuccess(true);
    } catch (error: any) {
      console.error("Error creating parent accounts:", error);

      // Show error message
      const errorMessage = error.message || t("errorCreatingAccounts");
      toastError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setIsSuccess(false);
    setIsLoading(false);
    onClose();
    // Reset everything
    setParent({ name: "", email: "", mobile: "" });
    setChildren([
      { name: "", birthDate: undefined, relationship: "", gender: "" },
    ]);
    setParentFamilies([]);
    setExpandedSection(null);
    setCurrentStep(0);
    setShowCalendar({});
  };

  //====================================FORM ACTIONS====================================

  const addChild = () => {
    const newChildIndex = children.length;
    setChildren([
      ...children,
      { name: "", birthDate: undefined, relationship: "", gender: "" },
    ]);
    setExpandedSection(`child-${newChildIndex}`);
  };

  const addParent = () => {
    if (parent.name && parent.email && parent.mobile) {
      setParentFamilies([...parentFamilies, { parent, children }]);
    }
    setParent({ name: "", email: "", mobile: "" });
    setChildren([
      { name: "", birthDate: undefined, relationship: "", gender: "" },
    ]);
    setExpandedSection(null);
  };

  const updateParent = (field: keyof Parent, value: string) => {
    setParent((prev) => ({ ...prev, [field]: value }));
  };

  const updateChild = (childIndex: number, field: keyof Child, value: any) => {
    setChildren((prev) => {
      const updated = [...prev];
      updated[childIndex] = { ...updated[childIndex], [field]: value };
      return updated;
    });
  };

  //====================================MAIN RENDER====================================

  return (
    <>
      {/* Main Dialog */}
      <Dialog open={isOpen && !isSuccess} onOpenChange={onClose}>
        <DialogContent
          className={cn(
            "max-w-md max-h-[90vh] overflow-hidden rounded-[40px] p-0",
            isRTL ? "text-right" : "text-left"
          )}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <DialogTitle className="sr-only">
            {t("createParentAccounts")}
          </DialogTitle>
          <ScrollArea className="h-full rounded-[40px] px-6 py-4">
            {/* Step 1: Welcome Screen */}
            {currentStep === 0 && (
              <div className="flex flex-col items-center space-y-6 py-8">
                <Image
                  src="/assets/illustrations/add-users.png"
                  alt="Add Users"
                  width={120}
                  height={120}
                  className="w-[100px] h-[150px]"
                />
                <h2 className="text-xl font-bold text-center text-primary-blue">
                  {t("createParentAccounts")}
                </h2>
                <Button
                  onClick={handleCreateAccount}
                  className="blue-gradient text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  {t("createParentAccount")}
                </Button>
              </div>
            )}

            {/* Step 2: Form */}
            {currentStep === 1 && (
              <div className="space-y-6 py-6">
                {/* Header */}
                <div className="text-center">
                  <h2 className="text-xl font-bold text-primary-blue mb-2">
                    {t("createParentAccounts")}
                  </h2>
                  <p className="text-primary-blue/80 text-sm">
                    {t("parentAndChildrenData")}
                  </p>
                </div>

                {/* Saved Families */}
                {parentFamilies.length > 0 && (
                  <div className="border-t border-b border-light-gray py-2">
                    <h3 className="text-sm font-medium text-primary-blue mb-2">
                      {t("savedParents")} ({parentFamilies.length})
                    </h3>
                    <div className="space-y-1">
                      {parentFamilies.map((family, index) => (
                        <div
                          key={index}
                          className="text-sm text-primary-blue/70 p-2 bg-gray-50 rounded"
                        >
                          {family.parent.name} - {family.children.length}{" "}
                          {t("children")}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation */}
                {children.length > 1 && (
                  <div className="border-t border-b border-light-gray py-2">
                    <div className="space-y-1">
                      {/* Parent */}
                      <div
                        className={`cursor-pointer p-2 rounded transition-colors ${
                          expandedSection === "parent"
                            ? "bg-primary-blue/10 text-primary-blue"
                            : "text-primary-blue/70 hover:bg-gray-50"
                        }`}
                        onClick={() =>
                          setExpandedSection(
                            expandedSection === "parent" ? null : "parent"
                          )
                        }
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {parent.name || t("parentData")}
                          </span>
                          {expandedSection === "parent" ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </div>
                      </div>

                      {/* Children */}
                      {children.map((child, childIndex) => (
                        <div
                          key={childIndex}
                          className={`cursor-pointer p-2 rounded transition-colors ${
                            expandedSection === `child-${childIndex}`
                              ? "bg-primary-blue/10 text-primary-blue"
                              : "text-primary-blue/70 hover:bg-gray-50"
                          }`}
                          onClick={() =>
                            setExpandedSection(
                              expandedSection === `child-${childIndex}`
                                ? null
                                : `child-${childIndex}`
                            )
                          }
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">
                              {child.name ||
                                `${t("childData")} ${childIndex + 1}`}
                            </span>
                            {expandedSection === `child-${childIndex}` ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Parent Form */}
                {(expandedSection === null || expandedSection === "parent") && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-primary-blue">
                      {t("parentDetails")}
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="parent-name">{t("name")} *</Label>
                        <Input
                          id="parent-name"
                          value={parent.name}
                          onChange={(e) => updateParent("name", e.target.value)}
                          placeholder={t("fullNamePlaceholder")}
                        />
                      </div>
                      <div>
                        <Label htmlFor="parent-email">{t("email")} *</Label>
                        <Input
                          id="parent-email"
                          type="email"
                          value={parent.email}
                          onChange={(e) =>
                            updateParent("email", e.target.value)
                          }
                          placeholder={t("emailPlaceholder")}
                        />
                      </div>
                      <div>
                        <Label htmlFor="parent-mobile">
                          {t("mobileNumber")} *
                        </Label>
                        <Input
                          id="parent-mobile"
                          value={parent.mobile}
                          onChange={(e) =>
                            updateParent("mobile", e.target.value)
                          }
                          placeholder={t("mobilePlaceholder")}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Children Forms */}
                {children.map((child, childIndex) => (
                  <div key={childIndex}>
                    {(expandedSection === null ||
                      expandedSection === `child-${childIndex}`) && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-primary-blue">
                          {t("childData")} {childIndex + 1}
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                          {/* Child Name */}
                          <div>
                            <Label htmlFor={`child-name-${childIndex}`}>
                              {t("childName")} *
                            </Label>
                            <Input
                              id={`child-name-${childIndex}`}
                              value={child.name}
                              onChange={(e) =>
                                updateChild(childIndex, "name", e.target.value)
                              }
                              placeholder={t("childNamePlaceholder")}
                            />
                          </div>

                          {/* Date of Birth */}
                          <div>
                            <Label htmlFor={`child-birth-${childIndex}`}>
                              {t("dateOfBirth")} *
                            </Label>
                            <div className="relative">
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !child.birthDate && "text-muted-foreground"
                                )}
                                onClick={() =>
                                  setShowCalendar((prev) => ({
                                    ...prev,
                                    [`child-${childIndex}`]:
                                      !prev[`child-${childIndex}`],
                                  }))
                                }
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {child.birthDate ? (
                                  child.birthDate.toLocaleDateString()
                                ) : (
                                  <span>{t("datePlaceholder")}</span>
                                )}
                              </Button>

                              {showCalendar[`child-${childIndex}`] && (
                                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999]">
                                  <Calendar
                                    mode="single"
                                    selected={child.birthDate}
                                    onSelect={(date) => {
                                      updateChild(
                                        childIndex,
                                        "birthDate",
                                        date
                                      );
                                      setShowCalendar((prev) => ({
                                        ...prev,
                                        [`child-${childIndex}`]: false,
                                      }));
                                    }}
                                    initialFocus
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Relationship */}
                          <div>
                            <Label htmlFor={`child-relationship-${childIndex}`}>
                              {t("relationship")} *
                            </Label>
                            <Input
                              id={`child-relationship-${childIndex}`}
                              value={child.relationship}
                              onChange={(e) =>
                                updateChild(
                                  childIndex,
                                  "relationship",
                                  e.target.value
                                )
                              }
                              placeholder={t("relationshipPlaceholder")}
                            />
                          </div>

                          {/* Gender Selection */}
                          <div>
                            <Label className="text-center block mb-4">
                              {t("childGender")} *
                            </Label>
                            <div className="flex justify-center space-x-4">
                              <Button
                                variant={
                                  child.gender === "female"
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() =>
                                  updateChild(childIndex, "gender", "female")
                                }
                                className="flex flex-col items-center space-y-2 p-4 h-auto"
                              >
                                <Image
                                  src="/assets/illustrations/girl.png"
                                  alt="Girl"
                                  width={91.32}
                                  height={120}
                                  className={cn(
                                    "transition-all duration-300",
                                    child.gender === "female"
                                      ? "saturate-100 scale-110"
                                      : "saturate-0 brightness-80"
                                  )}
                                />
                                <span className="text-sm font-medium">
                                  {t("girl")}
                                </span>
                              </Button>
                              <Button
                                variant={
                                  child.gender === "male"
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() =>
                                  updateChild(childIndex, "gender", "male")
                                }
                                className="flex flex-col items-center space-y-2 p-4 h-auto"
                              >
                                <Image
                                  src="/assets/illustrations/boy.png"
                                  alt="Boy"
                                  width={91.32}
                                  height={120}
                                  className={cn(
                                    "transition-all duration-300",
                                    child.gender === "male"
                                      ? "saturate-100 scale-110"
                                      : "saturate-0 brightness-80"
                                  )}
                                />
                                <span className="text-sm font-medium">
                                  {t("boy")}
                                </span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Footer Buttons */}
                <div className="space-y-4 pt-6 border-t">
                  {/* Add Another Child Button - Centered */}
                  <div className="flex justify-center">
                    <Button variant="outline" onClick={addChild}>
                      + {t("addAnotherChild")}
                    </Button>
                  </div>

                  {/* Add Another Parent and Confirm Buttons - Left and Right */}
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={addParent}>
                      {t("addAnotherParent")}
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="blue-gradient text-white"
                    >
                      {isLoading
                        ? t("creatingAccounts")
                        : t("confirmAccountCreation")}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={isSuccess} onOpenChange={handleSuccessClose}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto rounded-[40px]">
          <DialogTitle className="sr-only">{t("accountsCreated")}</DialogTitle>
          <div className="flex flex-col items-center justify-center py-8 px-6 text-center">
            <div className="relative mb-6">
              <Image
                src="/assets/illustrations/success.png"
                alt="Success"
                width={80}
                height={80}
                className="mx-auto"
              />
            </div>
            <div className="space-y-2 mb-6">
              <h3 className="text-lg font-semibold text-primary-blue">
                {t("accountsCreated")}
              </h3>
              <p className="text-sm text-gray-600">{t("dataSentToParents")}</p>
              <p className="text-sm text-gray-600">
                {t("viaEmailAndWhatsApp")}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ParentAccountsModal;
