"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
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
import {
  createParentAccountsSchema,
  ParentAccountsFormData,
} from "@/lib/schemas";
import { z } from "zod";

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

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Compute validity for enabling actions without requiring blur
  const isFormValidForActions = useMemo(() => {
    try {
      const schema = createParentAccountsSchema(locale as "ar" | "en");
      const formData = {
        parent,
        children: children.filter(
          (child) =>
            child.name || child.birthDate || child.relationship || child.gender
        ),
      } as ParentAccountsFormData;
      const result = schema.safeParse(formData);
      return result.success;
    } catch {
      return false;
    }
  }, [parent, children, locale]);

  // Allow submit if at least one saved family is complete
  const hasValidSavedFamily = useMemo(() => {
    return parentFamilies.some(
      (family) =>
        family.parent.name &&
        family.parent.email &&
        family.parent.mobile &&
        family.children.some(
          (child) =>
            child.name && child.birthDate && child.relationship && child.gender
        )
    );
  }, [parentFamilies]);

  //====================================REFS FOR FOCUS====================================
  const parentNameRef = useRef<HTMLInputElement | null>(null);
  const parentEmailRef = useRef<HTMLInputElement | null>(null);
  const parentMobileRef = useRef<HTMLInputElement | null>(null);
  const childNameRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const childRelationshipRefs = useRef<Record<number, HTMLInputElement | null>>(
    {}
  );
  const childBirthButtonRefs = useRef<Record<number, HTMLButtonElement | null>>(
    {}
  );
  const childGenderGirlRefs = useRef<Record<number, HTMLButtonElement | null>>(
    {}
  );

  //====================================VALIDATION====================================

  const validateForm = () => {
    try {
      const schema = createParentAccountsSchema(locale as "ar" | "en");
      const formData = {
        parent,
        children: children.filter(
          (child) =>
            child.name || child.birthDate || child.relationship || child.gender
        ),
      };

      schema.parse(formData);
      setErrors({});
      setIsFormValid(true);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join(".");
          // Only show errors for fields that have been touched
          if (touchedFields.has(path)) {
            fieldErrors[path] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      setIsFormValid(false);
      return false;
    }
  };

  const validateField = (fieldPath: string, value: any) => {
    // Only validate if field has been touched
    if (!touchedFields.has(fieldPath)) {
      return;
    }

    try {
      const schema = createParentAccountsSchema(locale as "ar" | "en");
      const formData = {
        parent,
        children: children.filter(
          (child) =>
            child.name || child.birthDate || child.relationship || child.gender
        ),
      } as ParentAccountsFormData;

      // Update the specific field
      const pathParts = fieldPath.split(".");
      if (pathParts[0] === "parent") {
        formData.parent[pathParts[1] as keyof typeof formData.parent] = value;
      } else if (pathParts[0] === "children") {
        const childIndex = parseInt(pathParts[1]);
        const childField = pathParts[2] as keyof Child;
        if (formData.children[childIndex]) {
          formData.children[childIndex][childField] = value;
        }
      }

      schema.parse(formData);

      // Clear error for this field
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldPath];
        return newErrors;
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find(
          (err) => err.path.join(".") === fieldPath
        );
        if (fieldError) {
          setErrors((prev) => ({
            ...prev,
            [fieldPath]: fieldError.message,
          }));
        }
      }
    }
  };

  const handleFieldBlur = (fieldPath: string) => {
    setTouchedFields((prev) => new Set(prev).add(fieldPath));
    // Trigger validation for this field after marking it as touched
    setTimeout(() => validateForm(), 0);
  };

  // Validate form whenever data changes (but only for touched fields)
  useEffect(() => {
    if (touchedFields.size > 0) {
      validateForm();
    }
  }, [parent, children, locale, touchedFields]);

  //====================================EVENT HANDLERS====================================

  const resetFormStates = () => {
    setCurrentStep(0);
    setIsSuccess(false);
    setIsLoading(false);
    setExpandedSection(null);
    setShowCalendar({});
    setParent({ name: "", email: "", mobile: "" });
    setChildren([
      { name: "", birthDate: undefined, relationship: "", gender: "" },
    ]);
    setParentFamilies([]);
    setErrors({});
    setIsFormValid(false);
    setTouchedFields(new Set());
  };

  const handleCreateAccount = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async () => {
    // Mark all fields as touched to show validation errors
    const allFieldPaths = [
      "parent.name",
      "parent.email",
      "parent.mobile",
      ...children.flatMap((_, index) => [
        `children.${index}.name`,
        `children.${index}.birthDate`,
        `children.${index}.relationship`,
        `children.${index}.gender`,
      ]),
    ];

    setTouchedFields(new Set(allFieldPaths));

    // Wait for state update then validate and focus first invalid
    setTimeout(() => {
      const schema = createParentAccountsSchema(locale as "ar" | "en");
      const formData = {
        parent,
        children: children
          .filter(
            (child) =>
              child.name ||
              child.birthDate ||
              child.relationship ||
              child.gender
          )
          .map((child) => ({
            ...child,
            birthDate: child.birthDate || new Date(),
            gender: child.gender || ("male" as "male" | "female"),
          })),
      } as ParentAccountsFormData;

      const result = schema.safeParse(formData);
      if (!result.success) {
        // Build errors map and focus first invalid field by order
        const issues = result.error.issues;
        const issuePaths = issues.map((iss) => iss.path.join("."));
        const firstPath = allFieldPaths.find((p) => issuePaths.includes(p));
        if (firstPath) {
          focusField(firstPath);
        }
        toastError(t("pleaseFillRequiredFields"));
        validateForm();
        return;
      }
      submitForm();
    }, 0);
  };

  const submitForm = async () => {
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

  const focusField = (fieldPath: string) => {
    // Map known paths to refs
    if (fieldPath === "parent.name") {
      parentNameRef.current?.focus();
      return;
    }
    if (fieldPath === "parent.email") {
      parentEmailRef.current?.focus();
      return;
    }
    if (fieldPath === "parent.mobile") {
      parentMobileRef.current?.focus();
      return;
    }
    if (fieldPath.startsWith("children.")) {
      const [, idxStr, field] = fieldPath.split(".");
      const index = parseInt(idxStr);
      if (field === "name") {
        childNameRefs.current[index]?.focus();
        return;
      }
      if (field === "relationship") {
        childRelationshipRefs.current[index]?.focus();
        return;
      }
      if (field === "birthDate") {
        childBirthButtonRefs.current[index]?.focus();
        return;
      }
      if (field === "gender") {
        // Focus girl's button by default
        childGenderGirlRefs.current[index]?.focus();
        return;
      }
    }
  };

  const handleSuccessClose = () => {
    resetFormStates();
    onClose();
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
    // Validate current parent + children using schema
    const schema = createParentAccountsSchema(locale as "ar" | "en");
    const formData = {
      parent,
      children: children.filter(
        (child) =>
          child.name || child.birthDate || child.relationship || child.gender
      ),
    } as ParentAccountsFormData;

    const allFieldPaths = [
      "parent.name",
      "parent.email",
      "parent.mobile",
      ...children.flatMap((_, index) => [
        `children.${index}.name`,
        `children.${index}.birthDate`,
        `children.${index}.relationship`,
        `children.${index}.gender`,
      ]),
    ];

    const result = schema.safeParse(formData);
    if (!result.success) {
      // mark all fields touched so errors show
      setTouchedFields(new Set(allFieldPaths));
      validateForm();

      // focus first invalid
      const issuePaths = result.error.issues.map((i) => i.path.join("."));
      const firstPath = allFieldPaths.find((p) => issuePaths.includes(p));
      if (firstPath) focusField(firstPath);
      toastError(t("pleaseFillRequiredFields"));
      return;
    }

    // Push current family and reset for next parent
    setParentFamilies([...parentFamilies, { parent, children }]);
    setParent({ name: "", email: "", mobile: "" });
    setChildren([
      { name: "", birthDate: undefined, relationship: "", gender: "" },
    ]);
    setExpandedSection(null);
    setErrors({});
    setTouchedFields(new Set());
    setIsFormValid(false);
    setShowCalendar({});
  };

  const updateParent = (field: keyof Parent, value: string) => {
    setParent((prev) => ({ ...prev, [field]: value }));
    validateField(`parent.${field}`, value);
  };

  const updateChild = (childIndex: number, field: keyof Child, value: any) => {
    setChildren((prev) => {
      const updated = [...prev];
      updated[childIndex] = { ...updated[childIndex], [field]: value };
      return updated;
    });
    validateField(`children.${childIndex}.${field}`, value);
  };

  //====================================MAIN RENDER====================================

  return (
    <>
      {/* Main Dialog */}
      <Dialog
        open={isOpen && !isSuccess}
        onOpenChange={(open) => {
          if (!open) {
            resetFormStates();
            onClose();
          }
        }}
      >
        <DialogContent
          className={cn(
            "max-w-md overflow-hidden rounded-[40px] p-0",
            isRTL ? "text-right" : "text-left"
          )}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <DialogTitle className="sr-only">
            {t("createParentAccounts")}
          </DialogTitle>

          {/* Step 1: Welcome Screen */}
          {currentStep === 0 && (
            <div className="flex flex-col items-center space-y-6 py-8 px-6">
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
            <ScrollArea
              className="rounded-[40px] px-6 py-4"
              style={{ height: "80vh", maxHeight: "600px" }}
            >
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
                        <Label htmlFor="parent-name">
                          <span className="text-red-500">*</span> {t("name")}
                        </Label>
                        <Input
                          id="parent-name"
                          value={parent.name}
                          onChange={(e) => updateParent("name", e.target.value)}
                          onBlur={() => handleFieldBlur("parent.name")}
                          ref={parentNameRef}
                          placeholder={t("fullNamePlaceholder")}
                          className={cn(
                            errors["parent.name"] &&
                              "border-red-500 focus:border-red-500"
                          )}
                        />
                        {errors["parent.name"] && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors["parent.name"]}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="parent-email">
                          <span className="text-red-500">*</span> {t("email")}
                        </Label>
                        <Input
                          id="parent-email"
                          type="email"
                          value={parent.email}
                          onChange={(e) =>
                            updateParent("email", e.target.value)
                          }
                          onBlur={() => handleFieldBlur("parent.email")}
                          ref={parentEmailRef}
                          placeholder={t("emailPlaceholder")}
                          className={cn(
                            errors["parent.email"] &&
                              "border-red-500 focus:border-red-500"
                          )}
                        />
                        {errors["parent.email"] && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors["parent.email"]}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="parent-mobile">
                          <span className="text-red-500">*</span>{" "}
                          {t("mobileNumber")}
                        </Label>
                        <Input
                          id="parent-mobile"
                          value={parent.mobile}
                          onChange={(e) =>
                            updateParent("mobile", e.target.value)
                          }
                          onBlur={() => handleFieldBlur("parent.mobile")}
                          ref={parentMobileRef}
                          placeholder={t("mobilePlaceholder")}
                          className={cn(
                            errors["parent.mobile"] &&
                              "border-red-500 focus:border-red-500"
                          )}
                        />
                        {errors["parent.mobile"] && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors["parent.mobile"]}
                          </p>
                        )}
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
                              <span className="text-red-500">*</span>{" "}
                              {t("childName")}
                            </Label>
                            <Input
                              id={`child-name-${childIndex}`}
                              value={child.name}
                              onChange={(e) =>
                                updateChild(childIndex, "name", e.target.value)
                              }
                              onBlur={() =>
                                handleFieldBlur(`children.${childIndex}.name`)
                              }
                              ref={(el) => {
                                childNameRefs.current[childIndex] = el;
                              }}
                              placeholder={t("childNamePlaceholder")}
                              className={cn(
                                errors[`children.${childIndex}.name`] &&
                                  "border-red-500 focus:border-red-500"
                              )}
                            />
                            {errors[`children.${childIndex}.name`] && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors[`children.${childIndex}.name`]}
                              </p>
                            )}
                          </div>

                          {/* Date of Birth */}
                          <div>
                            <Label htmlFor={`child-birth-${childIndex}`}>
                              <span className="text-red-500">*</span>{" "}
                              {t("dateOfBirth")}
                            </Label>
                            <div className="relative">
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !child.birthDate && "text-muted-foreground",
                                  errors[`children.${childIndex}.birthDate`] &&
                                    "border-red-500 focus:border-red-500"
                                )}
                                onClick={() =>
                                  setShowCalendar((prev) => ({
                                    ...prev,
                                    [`child-${childIndex}`]:
                                      !prev[`child-${childIndex}`],
                                  }))
                                }
                                onBlur={() =>
                                  handleFieldBlur(
                                    `children.${childIndex}.birthDate`
                                  )
                                }
                                ref={(el) => {
                                  childBirthButtonRefs.current[childIndex] = el;
                                }}
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
                                      handleFieldBlur(
                                        `children.${childIndex}.birthDate`
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
                            {errors[`children.${childIndex}.birthDate`] && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors[`children.${childIndex}.birthDate`]}
                              </p>
                            )}
                          </div>

                          {/* Relationship */}
                          <div>
                            <Label htmlFor={`child-relationship-${childIndex}`}>
                              <span className="text-red-500">*</span>{" "}
                              {t("relationship")}
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
                              onBlur={() =>
                                handleFieldBlur(
                                  `children.${childIndex}.relationship`
                                )
                              }
                              ref={(el) => {
                                childRelationshipRefs.current[childIndex] = el;
                              }}
                              placeholder={t("relationshipPlaceholder")}
                              className={cn(
                                errors[`children.${childIndex}.relationship`] &&
                                  "border-red-500 focus:border-red-500"
                              )}
                            />
                            {errors[`children.${childIndex}.relationship`] && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors[`children.${childIndex}.relationship`]}
                              </p>
                            )}
                          </div>

                          {/* Gender Selection */}
                          <div>
                            <Label className="text-center block mb-4">
                              <span className="text-red-500">*</span>{" "}
                              {t("childGender")}
                            </Label>
                            <div className="flex justify-center space-x-4">
                              <Button
                                variant={
                                  child.gender === "female"
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() => {
                                  updateChild(childIndex, "gender", "female");
                                  handleFieldBlur(
                                    `children.${childIndex}.gender`
                                  );
                                }}
                                className={cn(
                                  "flex flex-col items-center space-y-2 p-4 h-auto",
                                  errors[`children.${childIndex}.gender`] &&
                                    "border-red-500"
                                )}
                                ref={(el) => {
                                  childGenderGirlRefs.current[childIndex] = el;
                                }}
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
                                onClick={() => {
                                  updateChild(childIndex, "gender", "male");
                                  handleFieldBlur(
                                    `children.${childIndex}.gender`
                                  );
                                }}
                                className={cn(
                                  "flex flex-col items-center space-y-2 p-4 h-auto",
                                  errors[`children.${childIndex}.gender`] &&
                                    "border-red-500"
                                )}
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
                            {errors[`children.${childIndex}.gender`] && (
                              <p className="text-red-500 text-sm mt-1 text-center">
                                {errors[`children.${childIndex}.gender`]}
                              </p>
                            )}
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
                    <Button
                      variant="outline"
                      onClick={addParent}
                      disabled={!isFormValidForActions}
                    >
                      {t("addAnotherParent")}
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={
                        isLoading ||
                        (!isFormValidForActions && !hasValidSavedFamily)
                      }
                      className="blue-gradient text-white"
                    >
                      {isLoading
                        ? t("creatingAccounts")
                        : t("confirmAccountCreation")}
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
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
