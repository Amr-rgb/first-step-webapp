# Toast System Migration Guide

## Overview

Your Sonner toasts now have consistent styling that matches your notification components. All toasts will have:

- White background with colored left border
- Consistent typography and spacing
- Proper icons for each type
- Shadow and border styling matching your design system

## New Toast Functions

### Basic Usage

```typescript
import { toastSuccess, toastError, toastWarning, toastInfo } from "@/lib/toast";

// Instead of: toast.success("Saved!")
toastSuccess("Profile Saved", "Your changes have been saved successfully");

// Instead of: toast.error("Failed!")
toastError("Save Failed", "Please check your connection and try again");

// Instead of: toast.warning("Warning!")
toastWarning("Validation Error", "Please fill in all required fields");

// Instead of: toast.info("Info")
toastInfo("New Feature", "Check out our latest updates");
```

### Notification-Style Toasts

```typescript
import {
  toastDailyReport,
  toastMeeting,
  toastReminder,
  toastEnrollment,
  toastAdmin,
} from "@/lib/toast";

toastDailyReport("Daily Report Ready", "Your report for today is available");
toastMeeting("Meeting Reminder", "Team meeting starts in 15 minutes");
toastReminder("Task Due", "Don't forget to submit your timesheet");
toastEnrollment("New Enrollment", "Student John Doe has enrolled");
toastAdmin("System Update", "Maintenance scheduled for tonight");
```

### Advanced Usage with Actions

```typescript
import { showToast } from "@/lib/toast";

showToast({
  title: "Confirm Action",
  description: "Are you sure you want to delete this item?",
  type: "warning",
  duration: 10000,
  action: {
    label: "Delete",
    onClick: () => handleDelete(),
  },
  cancel: {
    label: "Cancel",
    onClick: () => console.log("Cancelled"),
  },
});
```

### Simple Toast (Backward Compatible)

```typescript
import { showSimpleToast } from "@/lib/notification-toast";

showSimpleToast("Success", "Operation completed", "success");
```

## Migration Steps

### 1. Update Imports

Replace:

```typescript
import { toast } from "sonner";
```

With:

```typescript
import { toastSuccess, toastError, toastWarning, toastInfo } from "@/lib/toast";
```

### 2. Update Toast Calls

Replace:

```typescript
toast.success("Success!");
toastError("Error!");
toast.warning("Warning!");
toast.info("Info!");
```

With:

```typescript
toastSuccess("Success Title", "Optional description");
toastError("Error Title", "Error details");
toastWarning("Warning Title", "Warning message");
toastInfo("Info Title", "Information details");
```

### 3. Enhanced Notifications

For notification-style toasts, use the specific functions:

```typescript
toastDailyReport("Daily Report", "Report is ready");
toastEnrollment("New Student", "John Doe enrolled");
```

## Styling Features

### Automatic Border Colors

- Success: Green left border (#10b981)
- Error: Red left border (#ef4444)
- Warning: Yellow left border (#f59e0b)
- Info: Blue left border (#3b82f6)
- Notification types: Appropriate colors based on type

### Consistent Typography

- Title: 14px, font-weight 600
- Description: 14px, font-weight 400, gray color
- Icons: 20px, colored to match border

### Action Buttons

- Styled to match your UI components
- Hover effects and proper spacing
- Cancel buttons with subtle styling

## Benefits

1. **Consistent Experience**: All toasts match your notification design
2. **Better UX**: Clear visual hierarchy with titles and descriptions
3. **Accessibility**: Proper contrast and readable typography
4. **Flexibility**: Support for actions, custom durations, and different types
5. **Maintainability**: Centralized styling that's easy to update

## Examples in Your Codebase

### Before:

```typescript
toastError(res.message);
toast.success(t("success.saved"));
```

### After:

```typescript
toastError("Authentication Failed", res.message);
toastSuccess(t("success.saved"), "Your profile has been updated successfully");
```

The new system provides better context and consistent visual styling throughout your application.
