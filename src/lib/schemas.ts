import { z } from "zod";
import { getErrorMessage, getImageDimensions } from "./utils";

// Sign In Form
export const createSignInSchema = (locale: "ar" | "en" = "ar") =>
  z.object({
    email: z.string().email({
      message: getErrorMessage("invalid-email", locale),
    }),
    password: z.string().min(8, {
      message: getErrorMessage("password-min", locale, { min: 8 }),
    }),
  });

export type SignInFormData = z.infer<ReturnType<typeof createSignInSchema>>;

// Forgot Password Form
export const createForgotPasswordSchema = (locale: "ar" | "en" = "ar") =>
  z.object({
    email: z.string().email({
      message: getErrorMessage("invalid-email", locale),
    }),
  });

export type ForgotPasswordFormData = z.infer<
  ReturnType<typeof createForgotPasswordSchema>
>;

// OTP Verification Form
export const createOTPVerificationSchema = (locale: "ar" | "en" = "ar") =>
  z.object({
    otp: z.string().min(4, {
      message: getErrorMessage("invalid-otp", locale, { min: 4 }),
    }),
  });

export type OTPVerificationFormData = z.infer<
  ReturnType<typeof createOTPVerificationSchema>
>;

// Reset Password Form
export const createResetPasswordSchema = (locale: "ar" | "en" = "ar") =>
  z
    .object({
      password: z.string().min(8, {
        message: getErrorMessage("password-min", locale, { min: 8 }),
      }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: getErrorMessage("password-match", locale),
      path: ["confirmPassword"],
    });

export type ResetPasswordFormData = z.infer<
  ReturnType<typeof createResetPasswordSchema>
>;

// Contact Us Form
export const createContactSchema = (locale: "ar" | "en" = "ar") =>
  z.object({
    name: z.string().min(2, {
      message: getErrorMessage("general-field-required", locale),
    }),
    email: z.string().email({
      message: getErrorMessage("invalid-email", locale),
    }),
    phone: z
      .string()
      .regex(/^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/, {
        message: getErrorMessage("invalid-phone", locale),
      }),
    subject: z.string().min(1, {
      message: getErrorMessage("invalid-subject", locale),
    }),
    message: z.string().min(10, {
      message: getErrorMessage("message-min", locale, { min: 10 }),
    }),
  });

export type ContactFormData = z.infer<ReturnType<typeof createContactSchema>>;

// --Just-- Sign Up For Parents Form Schema
const createParentSchema = (locale: "ar" | "en" = "ar") =>
  z.object({
    name: z
      .string()
      .min(1, { message: getErrorMessage("general-field-required", locale) }),
    phone: z
      .string()
      .regex(/^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/, {
        message: getErrorMessage("invalid-phone", locale),
      }),
    email: z.string().email({
      message: getErrorMessage("invalid-email", locale),
    }),
    national_number: z.string().length(10, {
      message: getErrorMessage("general-field-required", locale),
    }),
    address: z
      .string()
      .min(1, { message: getErrorMessage("general-field-required", locale) }),
    password: z.string().min(8, {
      message: getErrorMessage("password-min", locale, { min: 8 }),
    }),
    confirmPassword: z.string(),
  });

export type JustSignUpParentFormData = z.infer<
  ReturnType<typeof createParentSchema>
>;

// Add Child Step 1
const createChildStep1Schema = (locale: "ar" | "en" = "ar") =>
  z.object({
    // Step 1: Child Information
    childName: z
      .string()
      .min(2, { message: getErrorMessage("general-field-required", locale) }),
    birthDate: z.date({
      required_error: getErrorMessage("general-field-required", locale),
    }),
    fatherName: z
      .string()
      .min(2, { message: getErrorMessage("general-field-required", locale) }),
    motherName: z
      .string()
      .min(2, { message: getErrorMessage("general-field-required", locale) }),
    gender: z.enum(["male", "female"], {
      required_error: getErrorMessage("general-answer-required", locale),
    }),
    kinship: z.string().optional(),
  });

export type ChildStep1FormData = z.infer<
  ReturnType<typeof createChildStep1Schema>
>;

// Add Child Step 2
const createChildStep2Schema = (locale: "ar" | "en" = "ar") =>
  z.object({
    // Step 2: Chronic Diseases and Allergies
    chronicDiseases: z
      .object({
        hasDiseases: z.enum(["yes", "no"], {
          required_error: getErrorMessage("general-field-required", locale),
        }),
        diseases: z
          .array(
            z.object({
              name: z.string().trim().optional(),
              medication: z.string().trim().optional(),
              procedures: z.string().trim().optional(),
            })
          )
          .optional(),
      })
      .superRefine((data, ctx) => {
        if (data.hasDiseases === "yes") {
          if (!data.diseases || data.diseases.length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: getErrorMessage("disease-one-required", locale),
              path: ["diseases"],
            });
          } else {
            data.diseases.forEach((disease, index) => {
              if (!disease.name || disease.name.trim() === "") {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: getErrorMessage("general-field-required", locale),
                  path: [`diseases.${index}.name`],
                });
              }
              if (!disease.medication || disease.medication.trim() === "") {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: getErrorMessage("general-field-required", locale),
                  path: [`diseases.${index}.medication`],
                });
              }
              if (!disease.procedures || disease.procedures.trim() === "") {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: getErrorMessage("general-field-required", locale),
                  path: [`diseases.${index}.procedures`],
                });
              }
            });
          }
        }
      }),

    allergies: z
      .object({
        hasAllergies: z.enum(["yes", "no"], {
          required_error: getErrorMessage("general-answer-required", locale),
        }),
        allergies: z
          .array(
            z.object({
              allergyTypes: z.string().trim().optional(),
              allergyFoods: z.string().trim().optional(),
              allergyProcedures: z.string().trim().optional(),
            })
          )
          .optional(),
      })
      .superRefine((data, ctx) => {
        if (data.hasAllergies === "yes") {
          if (!data.allergies || data.allergies.length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: getErrorMessage("allergy-one-required", locale),
              path: ["allergies"],
            });
          } else {
            data.allergies.forEach((allergy, index) => {
              if (!allergy.allergyTypes || allergy.allergyTypes.trim() === "") {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: getErrorMessage("general-field-required", locale),
                  path: [`allergies.${index}.allergyTypes`],
                });
              }
              if (!allergy.allergyFoods || allergy.allergyFoods.trim() === "") {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: getErrorMessage("general-field-required", locale),
                  path: [`allergies.${index}.allergyFoods`],
                });
              }
              if (
                !allergy.allergyProcedures ||
                allergy.allergyProcedures.trim() === ""
              ) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: getErrorMessage("general-field-required", locale),
                  path: [`allergies.${index}.allergyProcedures`],
                });
              }
            });
          }
        }
      }),
  });

export type ChildStep2FormData = z.infer<
  ReturnType<typeof createChildStep2Schema>
>;

// Add Child Step 3
const createChildStep3Schema = (locale: "ar" | "en" = "ar") =>
  z.object({
    // Step 3: Recommendations
    childDescription: z
      .string()
      .min(2, { message: getErrorMessage("general-field-required", locale) }),
    favoriteThings: z
      .string()
      .min(2, { message: getErrorMessage("general-field-required", locale) }),
    recommendations: z.string().optional(),
  });

export type ChildStep3FormData = z.infer<
  ReturnType<typeof createChildStep3Schema>
>;

// Add Child Step 4
const createChildStep4Schema = (locale: "ar" | "en" = "ar") =>
  z.object({
    // Step 4: Authorized Persons
    authorizedPersons: z
      .array(
        z.object({
          name: z.string().min(2, {
            message: getErrorMessage("general-field-required", locale),
          }),
          idNumber: z.string().length(10, {
            message: getErrorMessage("general-field-required", locale),
          }),
        })
      )
      .min(1, { message: getErrorMessage("general-field-required", locale) }),

    comments: z
      .string()
      .min(2, getErrorMessage("general-field-required", locale)),
  });

export type ChildStep4FormData = z.infer<
  ReturnType<typeof createChildStep4Schema>
>;

// Add Child Schema
export const createAddChildSchema = (locale: "ar" | "en" = "ar") => {
  const step1Schema = createChildStep1Schema(locale);
  const step2Schema = createChildStep2Schema(locale);
  const step3Schema = createChildStep3Schema(locale);
  const step4Schema = createChildStep4Schema(locale);

  return step1Schema.merge(step2Schema).merge(step3Schema).merge(step4Schema);
};

export type AddChildFormData = z.infer<ReturnType<typeof createAddChildSchema>>;

// Sign Up For Parents w/ Add Child Form Schema
export const createSignUpParentSchema = (locale: "ar" | "en" = "ar") => {
  const parentSchema = createParentSchema(locale);
  const addChildSchema = createAddChildSchema(locale);

  return parentSchema
    .merge(addChildSchema)
    .refine((data) => data.password === data.confirmPassword, {
      message: getErrorMessage("password-match", locale),
      path: ["confirmPassword"],
    });
};

export type SignUpParentFormData = z.infer<
  ReturnType<typeof createSignUpParentSchema>
>;

const createBranchStep1Schema = (locale: "ar" | "en" = "ar") =>
  z.object({
    // Step 1: Basic Information
    nursery_name_ar: z
      .string()
      .min(2, { message: getErrorMessage("general-field-required", locale) }),
    nursery_name_en: z
      .string()
      .min(2, { message: getErrorMessage("general-field-required", locale) }),
    email: z
      .string()
      .email({ message: getErrorMessage("invalid-email", locale) }),
    phone: z
      .string()
      .regex(/^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/, {
        message: getErrorMessage("invalid-phone", locale),
      }),
    city: z
      .string()
      .min(1, { message: getErrorMessage("general-field-required", locale) })
      .refine(
        (value) => {
          // Check if it's a valid number (city ID)
          const cityId = parseInt(value);
          return !isNaN(cityId) && cityId > 0;
        },
        {
          message: getErrorMessage("general-field-required", locale),
        }
      ),
    neighborhood: z
      .string()
      .min(2, { message: getErrorMessage("general-field-required", locale) }),
    address: z
      .string()
      .min(2, { message: getErrorMessage("general-field-required", locale) }),
    location: z
      .string()
      .url({ message: getErrorMessage("invalid-url", locale) }),
    nursery_type: z
      .array(z.string())
      .min(1, { message: getErrorMessage("general-field-required", locale) }),
    services: z
      .array(z.string())
      .min(1, { message: getErrorMessage("services-one-required", locale) }),
    additional_service: z.string().optional(),
  });

export type BranchStep1FormData = z.infer<
  ReturnType<typeof createBranchStep1Schema>
>;

// Sign Up For Centers Step 1
const createCenterStep1Schema = (locale: "ar" | "en" = "ar") =>
  z.object({
    // Step 1: Basic Information
    nursery_name_ar: z
      .string()
      .min(2, { message: getErrorMessage("general-field-required", locale) }),
    nursery_name_en: z
      .string()
      .min(2, { message: getErrorMessage("general-field-required", locale) }),
    email: z
      .string()
      .email({ message: getErrorMessage("invalid-email", locale) }),
    phone: z
      .string()
      .regex(/^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/, {
        message: getErrorMessage("invalid-phone", locale),
      }),
    password: z.string().min(8, {
      message: getErrorMessage("password-min", locale, { min: 8 }),
    }),
    confirmPassword: z.string(),
    city: z
      .string()
      .min(1, { message: getErrorMessage("general-field-required", locale) })
      .refine(
        (value) => {
          // Check if it's a valid number (city ID)
          const cityId = parseInt(value);
          return !isNaN(cityId) && cityId > 0;
        },
        {
          message: getErrorMessage("general-field-required", locale),
        }
      ),
    neighborhood: z
      .string()
      .min(2, { message: getErrorMessage("general-field-required", locale) }),
    address: z
      .string()
      .min(2, { message: getErrorMessage("general-field-required", locale) }),
    location: z
      .string()
      .url({ message: getErrorMessage("invalid-url", locale) }),
    nursery_type: z
      .array(z.string())
      .min(1, { message: getErrorMessage("general-field-required", locale) }),
    services: z
      .array(z.string())
      .min(1, { message: getErrorMessage("services-one-required", locale) }),
    additional_service: z.string().optional(),
  });

export type CenterStep1FormData = z.infer<
  ReturnType<typeof createCenterStep1Schema>
>;

// Sign Up For Centers Step 2
const createCenterStep2Schema = (
  locale: "ar" | "en" = "ar"
): z.ZodObject<{
  accepted_ages: z.ZodArray<z.ZodString>;
  work_days_from: z.ZodString;
  work_days_to: z.ZodString;
  work_hours_from: z.ZodString;
  work_hours_to: z.ZodString;
}> =>
  z.object({
    // Step 2: Ages and Hours
    accepted_ages: z
      .array(z.string())
      .min(1, { message: getErrorMessage("age-groups-one-required", locale) }),
    work_days_from: z
      .string({
        message: getErrorMessage("invalid-date", locale),
      })
      .min(1, { message: getErrorMessage("general-field-required", locale) }),
    work_days_to: z
      .string({
        message: getErrorMessage("invalid-date", locale),
      })
      .min(1, { message: getErrorMessage("general-field-required", locale) }),
    work_hours_from: z
      .string({
        message: getErrorMessage("invalid-time", locale),
      })
      .min(1, { message: getErrorMessage("general-field-required", locale) }),
    work_hours_to: z
      .string({
        message: getErrorMessage("invalid-time", locale),
      })
      .min(1, { message: getErrorMessage("general-field-required", locale) }),
  });

export type CenterStep2FormData = z.infer<
  ReturnType<typeof createCenterStep2Schema>
>;

// Sign Up For Centers Step 3
const createCenterStep3Schema = (locale: "ar" | "en" = "ar") =>
  z.object({
    // Step 3: Communication and Food
    emergency_contact: z.enum(["yes", "no"], {
      required_error: getErrorMessage("general-answer-required", locale),
    }),
    communication_methods: z
      .array(z.string())
      .min(1, { message: getErrorMessage("general-field-required", locale) }),
    meals_and_periods: z
      .object({
        provides_food: z.enum(["yes", "no"], {
          required_error: getErrorMessage("general-answer-required", locale),
        }),
        first_meals: z
          .array(
            z.object({
              meal_name: z.string().trim().optional(),
              juice: z.string().trim().optional(),
              components: z.string().trim().optional(),
            })
          )
          .optional(),
        second_meals: z
          .array(
            z.object({
              meal_name: z.string().trim().optional(),
              juice: z.string().trim().optional(),
              components: z.string().trim().optional(),
            })
          )
          .optional(),
        time_of_first_period: z.string().trim().optional(),
        time_of_second_period: z.string().trim().optional(),
      })
      .superRefine((data, ctx) => {
        if (data.provides_food === "yes") {
          if (!data.first_meals || data.first_meals.length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: getErrorMessage("general-field-required", locale),
              path: ["first_meals"],
            });
          } else {
            data.first_meals.forEach((meal, index) => {
              if (!meal.meal_name || meal.meal_name.trim() === "") {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: getErrorMessage("general-field-required", locale),
                  path: [`first_meals.${index}.meal_name`],
                });
              }
              if (!meal.juice || meal.juice.trim() === "") {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: getErrorMessage("general-field-required", locale),
                  path: [`first_meals.${index}.juice`],
                });
              }
              if (!meal.components || meal.components.trim() === "") {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: getErrorMessage("general-field-required", locale),
                  path: [`first_meals.${index}.components`],
                });
              }
            });
          }

          if (!data.second_meals || data.second_meals.length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: getErrorMessage("general-field-required", locale),
              path: ["second_meals"],
            });
          } else {
            data.second_meals.forEach((meal, index) => {
              if (!meal.meal_name || meal.meal_name.trim() === "") {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: getErrorMessage("general-field-required", locale),
                  path: [`second_meals.${index}.meal_name`],
                });
              }
              if (!meal.juice || meal.juice.trim() === "") {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: getErrorMessage("general-field-required", locale),
                  path: [`second_meals.${index}.juice`],
                });
              }
              if (!meal.components || meal.components.trim() === "") {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: getErrorMessage("general-field-required", locale),
                  path: [`second_meals.${index}.components`],
                });
              }
            });
          }

          if (
            !data.time_of_first_period ||
            data.time_of_first_period.trim() === ""
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: getErrorMessage("general-field-required", locale),
              path: ["time_of_first_period"],
            });
          }

          if (
            !data.time_of_second_period ||
            data.time_of_second_period.trim() === ""
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: getErrorMessage("general-field-required", locale),
              path: ["time_of_second_period"],
            });
          }
        }
      }),
  });

export type CenterStep3FormData = z.infer<
  ReturnType<typeof createCenterStep3Schema>
>;

const MAX_FILE_SIZE = 3 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ["application/pdf"];

// Sign Up For Centers Step 4
const createCenterStep4Schema = (locale: "ar" | "en" = "ar") =>
  z.object({
    // Step 4: Permits
    license_path: z
      .instanceof(File, {
        message: getErrorMessage("general-field-required", locale),
      })
      .refine(
        (file) => file.size <= MAX_FILE_SIZE,
        getErrorMessage("file-size", locale)
      )
      .refine(
        (file) => ACCEPTED_FILE_TYPES.includes(file.type),
        getErrorMessage("file-size", locale)
      ),

    commercial_record_path: z
      .instanceof(File, {
        message: getErrorMessage("general-field-required", locale),
      })
      .refine(
        (file) => file.size <= MAX_FILE_SIZE,
        getErrorMessage("file-size", locale)
      )
      .refine(
        (file) => ACCEPTED_FILE_TYPES.includes(file.type),
        getErrorMessage("pdf-type", locale)
      ),

    logo: z
      .instanceof(File, {
        message: getErrorMessage("general-field-required", locale),
      })
      .refine(
        (file) => file.size <= MAX_FILE_SIZE,
        getErrorMessage("file-size", locale)
      )
      .refine(
        (file) =>
          ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"].includes(
            file.type
          ),
        {
          message: getErrorMessage("image-type", locale),
        }
      ),

    comments: z.string().optional(),
  });

export type CenterStep4FormData = z.infer<
  ReturnType<typeof createCenterStep4Schema>
>;

// Sign Up For Centers Schema
export const createSignUpCenterSchema = (locale: "ar" | "en" = "ar") => {
  const step1Schema = createCenterStep1Schema(locale);
  const step2Schema = createCenterStep2Schema(locale);
  const step3Schema = createCenterStep3Schema(locale);
  const step4Schema = createCenterStep4Schema(locale);

  return step1Schema
    .merge(step2Schema)
    .merge(step3Schema)
    .merge(step4Schema)
    .refine(
      (data) => {
        if (data.password && data.confirmPassword) {
          return data.password === data.confirmPassword;
        }
        return true;
      },
      {
        message: getErrorMessage("password-match", locale),
        path: ["confirmPassword"],
      }
    );
};

export type SignUpCenterFormData = z.infer<
  ReturnType<typeof createSignUpCenterSchema>
>;

// Create Center Branch
export const createBranchSchema = (locale: "ar" | "en" = "ar") => {
  const step1Schema = createBranchStep1Schema(locale);
  const step2Schema = createCenterStep2Schema(locale);
  const step3Schema = createCenterStep3Schema(locale);
  const step4Schema = createCenterStep4Schema(locale);

  return step1Schema.merge(step2Schema).merge(step3Schema).merge(step4Schema);
};

export type BranchFormData = z.infer<ReturnType<typeof createBranchSchema>>;

// Sign In Form
export const createAddBranchAdminSchema = (locale: "ar" | "en" = "ar") =>
  z
    .object({
      name: z
        .string()
        .min(1, { message: getErrorMessage("general-field-required", locale) }),
      email: z.string().email({
        message: getErrorMessage("invalid-email", locale),
      }),
      password: z.string().min(8, {
        message: getErrorMessage("password-min", locale, { min: 8 }),
      }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: getErrorMessage("password-match", locale),
      path: ["confirmPassword"],
    });

export type BranchAdminFormData = z.infer<
  ReturnType<typeof createAddBranchAdminSchema>
>;

export const createAdRequestSchema = (locale: "ar" | "en" = "ar") =>
  z
    .object({
      // Step 1: Basic Information
      title: z.object({
        ar: z
          .string()
          .min(5, { message: getErrorMessage("general-field-required", "ar") }),
        en: z
          .string()
          .min(5, { message: getErrorMessage("general-field-required", "en") }),
      }),
      description: z.object({
        ar: z.string().min(10, {
          message: getErrorMessage("general-field-required", "ar"),
        }),
        en: z.string().min(10, {
          message: getErrorMessage("general-field-required", "en"),
        }),
      }),
      start_date: z.date({
        required_error: getErrorMessage("general-field-required", locale),
      }),
      end_date: z.date({
        required_error: getErrorMessage("general-field-required", locale),
      }),
      image: z
        .union([
          z.string().url(), // Accept valid image URL
          z.any(), // Accept FileList (we'll validate this further)
        ])
        .superRefine(async (val, ctx) => {
          // Case 1: If it's a URL, skip file validation
          if (typeof val === "string") {
            return;
          }

          // Case 2: Handle FileList validation
          if (
            !val ||
            typeof val !== "object" ||
            !("length" in val) ||
            val.length === 0 ||
            !val[0].type.startsWith("image/")
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "يرجى رفع صورة صالحة",
            });
            return;
          }

          const image = await getImageDimensions(val[0]);
          if (image.width !== 1440 || image.height !== 680) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "يجب أن يكون مقاس الصورة 1440 × 680",
            });
          }
        }),
    })
    .superRefine((data, ctx) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (data.start_date && data.start_date <= today) {
        ctx.addIssue({
          path: ["start_date"],
          code: z.ZodIssueCode.custom,
          message: getErrorMessage("invalid-date", locale),
        });
      }

      if (
        data.start_date &&
        data.end_date &&
        data.end_date <= data.start_date
      ) {
        ctx.addIssue({
          path: ["end_date"],
          code: z.ZodIssueCode.custom,
          message: getErrorMessage("invalid-date", locale),
        });
      }
    });

export type AdRequestFormData = z.infer<
  ReturnType<typeof createAdRequestSchema>
>;

function createImageSchema(
  expectedWidth: number,
  expectedHeight: number,
  sizeMessage: string,
  locale: "ar" | "en"
) {
  return z.union([z.string().url(), z.any()]).superRefine(async (val, ctx) => {
    // Case 1: It's a URL string — skip dimension check (optional: validate image extension)
    if (typeof val === "string") {
      return;
    }

    // Case 2: It's a FileList — check it's a valid image
    if (!val?.[0] || !val[0].type?.startsWith("image/")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "يرجى رفع صورة صالحة",
      });
      return;
    }

    // Check dimensions of uploaded file
    const dimensions = await getImageDimensions(val[0]);
    if (
      dimensions.width !== expectedWidth ||
      dimensions.height !== expectedHeight
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: sizeMessage,
      });
    }
  });
}

export const createBlogRequestSchema = (locale: "ar" | "en" = "ar") =>
  z.object({
    // Step 1: Basic Information
    title: z
      .string()
      .min(5, { message: getErrorMessage("general-field-required", locale) }),
    description: z.string().min(10, {
      message: getErrorMessage("general-field-required", locale),
    }),
    content: z.string().min(30, "محتوى التدوينة مطلوب (نص MDX)"),
    mainImage: createImageSchema(
      1440,
      610,
      "يجب أن يكون مقاس الصورة 610",
      locale
    ),
    cardImage: createImageSchema(
      264,
      160,
      "يجب أن يكون مقاس الصورة 264 × 160",
      locale
    ),
  });

export type BlogRequestFormData = z.infer<
  ReturnType<typeof createBlogRequestSchema>
>;

export const createAdminBlogRequestSchema = (locale: "ar" | "en" = "ar") =>
  z.object({
    // Step 1: Basic Information
    title: z.object({
      ar: z
        .string()
        .min(5, { message: getErrorMessage("general-field-required", "ar") }),
      en: z
        .string()
        .min(5, { message: getErrorMessage("general-field-required", "en") }),
    }),
    description: z.object({
      ar: z
        .string()
        .min(10, { message: getErrorMessage("general-field-required", "ar") }),
      en: z
        .string()
        .min(10, { message: getErrorMessage("general-field-required", "en") }),
    }),
    content: z.object({
      ar: z.string().min(30, "محتوى التدوينة مطلوب (نص MDX)"),
      en: z.string().min(30, "Blog content is required (MDX text)"),
    }),
    mainImage: createImageSchema(
      1440,
      610,
      "يجب أن يكون مقاس الصورة 610",
      locale
    ),
    cardImage: createImageSchema(
      264,
      160,
      "يجب أن يكون مقاس الصورة 264 × 160",
      locale
    ),
  });

export type AdminBlogRequestFormData = z.infer<
  ReturnType<typeof createAdminBlogRequestSchema>
>;

export const createTeamMemberSchema = (locale: "ar" | "en" = "ar") =>
  z.object({
    // Step 1: Basic Information
    name: z
      .string()
      .min(3, { message: getErrorMessage("general-field-required", locale) }),
    branch: z.string().min(2, {
      message: getErrorMessage("general-field-required", locale),
    }),
    job: z.string().min(2, {
      message: getErrorMessage("general-field-required", locale),
    }),
    image: z.union([
      z.string().url(),
      z
        .any()
        .refine(
          (fileList) =>
            fileList &&
            typeof fileList === "object" &&
            "length" in fileList &&
            fileList.length > 0 &&
            fileList[0].type.startsWith("image/"),
          "يرجى رفع صورة صالحة"
        ),
    ]),
    // .refine(async (file) => {
    //   if (!file?.[0]) return false;
    //   const image = await getImageDimensions(file[0]);
    //   return image.width === 1440 && image.height === 680;
    // }, "يجب أن يكون مقاس الصورة 1440 × 680"),
  });

export type TeamMemberFormData = z.infer<
  ReturnType<typeof createTeamMemberSchema>
>;
