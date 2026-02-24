# Filter Sidebar Scrolling - Visual Guide

## Overview
Each filter section now has a maximum height of 241px with automatic scrolling when content exceeds this height.

## Visual Examples

### Short Section (No Scroll Needed)
```
┌─────────────────────────────────┐
│  Categories                 ▼   │
├─────────────────────────────────┤
│  ☑ All                          │
│  ☐ Nursery                      │
│  ☐ Center                       │
│  ☐ Rehabilitation               │
│  ☐ Kindergarten                 │
│  ☐ Entertainment                │
│                                 │
│  (Height: ~180px)               │
│  (No scrollbar needed)          │
└─────────────────────────────────┘
```

### Long Section (Scroll Appears)
```
┌─────────────────────────────────┐
│  Cities                     ▼   │
├─────────────────────────────────┤
│  ☑ All                      ▲   │
│  ☐ Riyadh                   │   │
│  ☐ Jeddah                   │   │
│  ☐ Dammam                   │   │
│  ☐ Mecca                    │   │
│  ☐ Medina                   │   │
│  ☐ Khobar                   │   │
│  ☐ Tabuk                    │   │
│  ☐ Abha                     │   │
│  ☐ Taif                     │   │
│  ☐ Buraidah                 │   │
│  ... (more cities)          ▼   │
│                                 │
│  (Height: 241px - MAX)          │
│  (Scrollbar visible)            │
└─────────────────────────────────┘
```

## Scrollbar Styling

### Desktop View
```
┌─────────────────────────────────┐
│  Section Title              ▼   │
├─────────────────────────────────┤
│  ☑ All                      ▲   │ ← Scroll up
│  ☐ Option 1                 │   │
│  ☐ Option 2                 █   │ ← Thumb (draggable)
│  ☐ Option 3                 │   │
│  ☐ Option 4                 │   │
│  ☐ Option 5                 │   │
│  ☐ Option 6                 │   │
│  ☐ Option 7                 │   │
│  ☐ Option 8                 │   │
│  ☐ Option 9                 │   │
│  ☐ Option 10                ▼   │ ← Scroll down
└─────────────────────────────────┘
     Content Area          Scrollbar
                           (6px wide)
```

### Scrollbar Colors
```
Track:  #f7f8fa (Light gray background)
Thumb:  #4d5edb (Primary blue)
Hover:  #22336c (Darker blue)
Width:  6px
```

## Interaction States

### 1. Initial State (Top)
```
┌─────────────────────────────────┐
│  Cities                     ▼   │
├─────────────────────────────────┤
│  ☑ All                      ▲   │ ← At top
│  ☐ Riyadh                   █   │
│  ☐ Jeddah                   │   │
│  ☐ Dammam                   │   │
│  ☐ Mecca                    │   │
│  ☐ Medina                   │   │
│  ☐ Khobar                   │   │
│  ☐ Tabuk                    │   │
│  ☐ Abha                     │   │
│  ☐ Taif                     │   │
│  ☐ Buraidah                 ▼   │
└─────────────────────────────────┘
```

### 2. Middle State (Scrolled)
```
┌─────────────────────────────────┐
│  Cities                     ▼   │
├─────────────────────────────────┤
│  ☐ Dammam                   ▲   │
│  ☐ Mecca                    │   │
│  ☐ Medina                   │   │
│  ☐ Khobar                   █   │ ← Scrolled middle
│  ☐ Tabuk                    │   │
│  ☐ Abha                     │   │
│  ☐ Taif                     │   │
│  ☐ Buraidah                 │   │
│  ☐ Hail                     │   │
│  ☐ Najran                   │   │
│  ☐ Jizan                    ▼   │
└─────────────────────────────────┘
```

### 3. Bottom State (End)
```
┌─────────────────────────────────┐
│  Cities                     ▼   │
├─────────────────────────────────┤
│  ☐ Hail                     ▲   │
│  ☐ Najran                   │   │
│  ☐ Jizan                    │   │
│  ☐ Arar                     │   │
│  ☐ Sakaka                   │   │
│  ☐ Qatif                    │   │
│  ☐ Yanbu                    │   │
│  ☐ Jubail                   │   │
│  ☐ Dhahran                  │   │
│  ☐ Al-Ahsa                  █   │ ← At bottom
│  ☐ Bisha                    ▼   │
└─────────────────────────────────┘
```

## Mobile View

### Mobile Sheet with Scrolling
```
┌─────────────────────────────────┐
│  ✕  التصفية                     │ ← Header
├─────────────────────────────────┤
│                                 │
│  Categories                 ▼   │
│  ☑ All                          │
│  ☐ Nursery                      │
│  ☐ Center                       │
│  ...                            │
│                                 │
│  Cities                     ▼   │
│  ☑ All                      ▲   │
│  ☐ Riyadh                   │   │
│  ☐ Jeddah                   █   │ ← Scrollable
│  ☐ Dammam                   │   │
│  ☐ Mecca                    │   │
│  ☐ Medina                   │   │
│  ... (more)                 ▼   │
│                                 │
│  Ages                       ▼   │
│  ☑ All                          │
│  ...                            │
│                                 │
└─────────────────────────────────┘
```

## Comparison: Before vs After

### Before (No Height Limit)
```
┌─────────────────────────────────┐
│  Filter Sidebar                 │
├─────────────────────────────────┤
│  Categories                 ▼   │
│  ☑ All                          │
│  ☐ Nursery                      │
│  ☐ Center                       │
│  ☐ Rehabilitation               │
│  ☐ Kindergarten                 │
│  ☐ Entertainment                │
│                                 │
│  Cities                     ▼   │
│  ☑ All                          │
│  ☐ Riyadh                       │
│  ☐ Jeddah                       │
│  ☐ Dammam                       │
│  ☐ Mecca                        │
│  ☐ Medina                       │
│  ☐ Khobar                       │
│  ☐ Tabuk                        │
│  ☐ Abha                         │
│  ☐ Taif                         │
│  ☐ Buraidah                     │
│  ☐ Hail                         │
│  ☐ Najran                       │
│  ☐ Jizan                        │
│  ☐ Arar                         │
│  ... (continues)                │
│  ... (very long)                │
│  ... (pushes content down)      │
│                                 │
│  Ages                       ▼   │
│  ... (far below)                │
└─────────────────────────────────┘
     ↓ User must scroll page ↓
```

### After (With 241px Limit)
```
┌─────────────────────────────────┐
│  Filter Sidebar                 │
├─────────────────────────────────┤
│  Categories                 ▼   │
│  ☑ All                          │
│  ☐ Nursery                      │
│  ☐ Center                       │
│  ☐ Rehabilitation               │
│  ☐ Kindergarten                 │
│  ☐ Entertainment                │
│                                 │
│  Cities                     ▼   │
│  ┌─────────────────────────┐   │
│  │ ☑ All                ▲  │   │
│  │ ☐ Riyadh             │  │   │
│  │ ☐ Jeddah             █  │   │
│  │ ☐ Dammam             │  │   │
│  │ ☐ Mecca              │  │   │
│  │ ☐ Medina             │  │   │
│  │ ☐ Khobar             │  │   │
│  │ ☐ Tabuk              │  │   │
│  │ ☐ Abha               │  │   │
│  │ ☐ Taif               │  │   │
│  │ ☐ Buraidah           ▼  │   │
│  └─────────────────────────┘   │
│     (Max 241px - scrollable)    │
│                                 │
│  Ages                       ▼   │
│  ☑ All                          │
│  ☐ Infant                       │
│  ... (visible immediately)      │
└─────────────────────────────────┘
     ↑ Compact & organized ↑
```

## Benefits Visualization

### Space Efficiency
```
Before:                    After:
┌──────────────┐          ┌──────────────┐
│              │          │              │
│  Filter 1    │          │  Filter 1    │
│  (100px)     │          │  (100px)     │
│              │          │              │
│  Filter 2    │          │  Filter 2    │
│  (800px!)    │          │  (241px)     │ ← Controlled
│              │          │              │
│  Filter 3    │          │  Filter 3    │
│  (150px)     │          │  (150px)     │
│              │          │              │
│  Filter 4    │          │  Filter 4    │
│  (200px)     │          │  (200px)     │
│              │          │              │
│              │          │              │
│ Total: 1250px│          │ Total: 691px │
└──────────────┘          └──────────────┘
   ↓ Too long               ↓ Optimized
```

## User Experience Flow

### Scenario: Finding a City
```
1. User opens filter sidebar
   ┌─────────────────────┐
   │  Cities         ▼   │
   └─────────────────────┘

2. Section expands
   ┌─────────────────────┐
   │  Cities         ▲   │
   │  ☑ All          │   │
   │  ☐ Riyadh       █   │
   │  ☐ Jeddah       │   │
   │  ... (more)     ▼   │
   └─────────────────────┘

3. User scrolls to find city
   ┌─────────────────────┐
   │  Cities         ▲   │
   │  ☐ Mecca        │   │
   │  ☐ Medina       █   │ ← Scrolling
   │  ☐ Khobar       │   │
   │  ... (more)     ▼   │
   └─────────────────────┘

4. User selects city
   ┌─────────────────────┐
   │  Cities         ▲   │
   │  ☐ Mecca        │   │
   │  ☑ Medina       █   │ ← Selected
   │  ☐ Khobar       │   │
   │  ... (more)     ▼   │
   └─────────────────────┘

5. Filter applied ✓
```

## Technical Implementation

### CSS Classes Applied
```css
.max-h-[241px]        /* Maximum height */
.overflow-y-auto      /* Vertical scroll */
.custom-scrollbar     /* Styled scrollbar */
```

### Responsive Behavior
```
Desktop (lg+):
- Fixed sidebar with scrolling sections
- Scrollbar always visible when needed

Mobile (< lg):
- Sheet/drawer with scrolling sections
- Touch-friendly scrolling
- Native mobile scrollbar
```

---

**Height**: 241px maximum per section  
**Scrollbar Width**: 6px  
**Scroll Type**: Smooth, styled  
**Browser Support**: All modern browsers
