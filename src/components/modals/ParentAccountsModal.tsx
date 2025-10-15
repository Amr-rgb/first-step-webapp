"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarIcon, ChevronDown, ChevronRight } from "lucide-react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Image from "next/image";

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

const ParentAccountsModal: React.FC<ParentAccountsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const t = useTranslations("parentAccounts");
  const locale = useLocale();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [parentFamilies, setParentFamilies] = useState<ParentFamily[]>([]);
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

  const handleCreateAccount = () => {
    setCurrentStep(1);
  };

  const handlePrevious = () => {
    setCurrentStep(0);
  };

  const handleSubmit = () => {
    // Include current parent and children in the final submission
    const allFamilies = [...parentFamilies];
    if (parent.name || children.some((child) => child.name)) {
      allFamilies.push({ parent, children });
    }

    console.log("Creating parent accounts:", allFamilies);
    onClose();
  };

  const addChild = () => {
    const newChildIndex = children.length;
    setChildren([
      ...children,
      {
        name: "",
        birthDate: undefined,
        relationship: "",
        gender: "",
      },
    ]);
    // Automatically expand the new child section
    setExpandedSection(`child-${newChildIndex}`);
  };

  const addParent = () => {
    // Save current parent and children to the families list
    if (parent.name || children.some((child) => child.name)) {
      setParentFamilies((prev) => [...prev, { parent, children }]);
    }

    // Reset parent data for new parent
    setParent({
      name: "",
      email: "",
      mobile: "",
    });
    // Reset children to one empty child
    setChildren([
      {
        name: "",
        birthDate: undefined,
        relationship: "",
        gender: "",
      },
    ]);
    // Clear expanded section to show normal form (no collapsed navigation)
    setExpandedSection(null);
  };

  const updateParent = (field: keyof Parent, value: string) => {
    setParent({ ...parent, [field]: value });
  };

  const updateChild = (
    childIndex: number,
    field: keyof Child,
    value: string | Date | undefined | "male" | "female" | ""
  ) => {
    const updatedChildren = [...children];
    if (field === "birthDate") {
      updatedChildren[childIndex] = {
        ...updatedChildren[childIndex],
        birthDate: value as Date | undefined,
      };
    } else if (field === "gender") {
      updatedChildren[childIndex] = {
        ...updatedChildren[childIndex],
        gender: value as "male" | "female" | "",
      };
    } else {
      updatedChildren[childIndex] = {
        ...updatedChildren[childIndex],
        [field]: value as string,
      };
    }
    setChildren(updatedChildren);
  };

  const isRTL = locale === "ar";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "max-w-md max-h-[90vh] overflow-hidden rounded-[40px] p-0",
          isRTL ? "text-right" : "text-left"
        )}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <ScrollArea className="h-full rounded-[40px] px-6 py-4">
          {/* First Step Content */}
          {currentStep === 0 && (
            <div className="flex flex-col items-center space-y-6 py-8">
              {/* Add Users Icon */}
              <Image
                src="/assets/illustrations/add-users.png"
                alt="Add Users"
                width={120}
                height={120}
                className="w-[100px] h-[150px]"
              />

              {/* Title */}
              <h2 className="text-xl font-bold text-center text-primary-blue">
                {t("createParentAccounts")}
              </h2>

              {/* Create Account Button */}
              <Button
                onClick={handleCreateAccount}
                className="blue-gradient text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                {t("createParentAccount")}
              </Button>
            </div>
          )}

          {/* Second Step Content */}
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

              {/* Saved Parent Families List */}
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

              {/* Collapsible Navigation - Only show when there are multiple children */}
              {children.length > 1 && (
                <div className="border-t border-b border-light-gray py-2">
                  <div className="space-y-1">
                    {/* Parent Section */}
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
                        <span className="text-sm">
                          {expandedSection === "parent" ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Children Sections */}
                    {children.map((child, childIndex) => (
                      <div
                        key={childIndex}
                        className={`cursor-pointer p-2 rounded transition-colors ml-4 ${
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
                          <span className="text-sm">
                            {expandedSection === `child-${childIndex}` ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Parent Information Section */}
              {(expandedSection === null || expandedSection === "parent") && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary-blue">
                    {t("parentData")}
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label
                        htmlFor="parent-name"
                        className="text-sm font-medium"
                      >
                        {t("name")} *
                      </Label>
                      <Input
                        id="parent-name"
                        placeholder={t("fullNamePlaceholder")}
                        value={parent.name}
                        onChange={(e) => updateParent("name", e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="parent-email"
                        className="text-sm font-medium"
                      >
                        {t("email")} *
                      </Label>
                      <Input
                        id="parent-email"
                        type="email"
                        placeholder={t("emailPlaceholder")}
                        value={parent.email}
                        onChange={(e) => updateParent("email", e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="parent-mobile"
                        className="text-sm font-medium"
                      >
                        {t("mobileNumber")} *
                      </Label>
                      <Input
                        id="parent-mobile"
                        placeholder={t("mobilePlaceholder")}
                        value={parent.mobile}
                        onChange={(e) => updateParent("mobile", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Child Information Sections */}
              {children.map(
                (child, childIndex) =>
                  (expandedSection === null ||
                    expandedSection === `child-${childIndex}`) && (
                    <div key={childIndex} className="space-y-4">
                      <h3 className="text-lg font-semibold text-primary-blue">
                        {t("childData")} {childIndex + 1}
                      </h3>

                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label
                            htmlFor={`child-name-${childIndex}`}
                            className="text-sm font-medium"
                          >
                            {t("childName")} *
                          </Label>
                          <Input
                            id={`child-name-${childIndex}`}
                            placeholder={t("childNamePlaceholder")}
                            value={child.name}
                            onChange={(e) =>
                              updateChild(childIndex, "name", e.target.value)
                            }
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label
                            htmlFor={`child-birth-${childIndex}`}
                            className="text-sm font-medium"
                          >
                            {t("dateOfBirth")} *
                          </Label>
                          <div className="relative">
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal mt-1",
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
                                format(child.birthDate, "dd/MM/yyyy")
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
                                      date || undefined
                                    );
                                    // Close calendar after selection
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

                        <div>
                          <Label
                            htmlFor={`child-relationship-${childIndex}`}
                            className="text-sm font-medium"
                          >
                            {t("relationship")} *
                          </Label>
                          <Input
                            id={`child-relationship-${childIndex}`}
                            placeholder={t("relationshipPlaceholder")}
                            value={child.relationship}
                            onChange={(e) =>
                              updateChild(
                                childIndex,
                                "relationship",
                                e.target.value
                              )
                            }
                            className="mt-1"
                          />
                        </div>

                        {/* Gender Selection */}
                        <div className="text-center">
                          <Label className="text-sm font-medium block mb-2">
                            {t("childGender")}
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
                                width={84.74}
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
                                child.gender === "male" ? "default" : "outline"
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
                  )
              )}

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
                    className="blue-gradient text-white"
                  >
                    {t("confirmAccountCreation")}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ParentAccountsModal;
