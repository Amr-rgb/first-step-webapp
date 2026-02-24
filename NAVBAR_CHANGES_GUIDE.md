# Navbar Changes Guide

## Before (Old Structure)

### Arabic Navbar
```
الرئيسية | خدماتنا | منشآت ▼ | العروض والخصومات | الاستشارات | من نحن ▼
                      │
                      ├─ المراكز
                      └─ الحضانات
```

### Routes
- `/nurseries` - Showed all nurseries
- `/centers` - Showed only center with ID 68

---

## After (New Structure)

### Arabic Navbar
```
الرئيسية | خدماتنا | منشآت | العروض والخصومات | الاستشارات | من نحن ▼
```

### Routes
- `/establishments` - Shows ALL establishments (nurseries + centers combined)

---

## Key Differences

| Aspect | Before | After |
|--------|--------|-------|
| **Navbar Item** | Dropdown with 2 options | Single direct link |
| **Label (AR)** | منشآت (with dropdown) | منشآت (direct link) |
| **Label (EN)** | Establishments (with dropdown) | Establishments (direct link) |
| **Pages** | 2 separate pages | 1 unified page |
| **Coupons** | Shown at top | Removed |
| **Advertising** | Not shown | Top + Bottom |
| **Data Shown** | Filtered by type/ID | All establishments |

---

## Page Layout Comparison

### Old Nurseries Page
```
┌─────────────────────────┐
│   Coupon Slider         │
├─────────────────────────┤
│   Nurseries List        │
│   (All establishments)  │
├─────────────────────────┤
│   Blog Section          │
├─────────────────────────┤
│   Contact Form          │
└─────────────────────────┘
```

### Old Centers Page
```
┌─────────────────────────┐
│   Coupon Slider         │
├─────────────────────────┤
│   Centers List          │
│   (Only ID 68)          │
├─────────────────────────┤
│   Blog Section          │
├─────────────────────────┤
│   Contact Form          │
└─────────────────────────┘
```

### New Establishments Page
```
┌─────────────────────────┐
│   Ad Space (Top)        │ ← NEW
├─────────────────────────┤
│   Establishments List   │
│   (All combined)        │
│   + City Filtering      │
├─────────────────────────┤
│   Ad Space (Bottom)     │ ← NEW
├─────────────────────────┤
│   Blog Section          │
├─────────────────────────┤
│   Contact Form          │
└─────────────────────────┘
```

---

## Translation Keys Changed

### Navbar (src/messages/ar.json & en.json)
```json
// REMOVED
"nurseries": { "title": "منشآت", "path": "/nurseries" }
"centers-item": { "title": "المراكز", "path": "/centers" }
"nurseries-item": { "title": "الحضانات", "path": "/nurseries" }

// ADDED
"establishments": { "title": "منشآت", "path": "/establishments" }
```

### Footer (src/messages/ar.json & en.json)
```json
// REMOVED
"nurseries": { "title": "الحضانات", "path": "/nurseries" }
"centers": { "title": "المراكز", "path": "/centers" }

// ADDED
"establishments": { "title": "المنشآت", "path": "/establishments" }
```
