# Advertisement Placeholders Implementation

## Overview
Custom advertisement placeholder components have been created for the establishments page with specific dimensions and layouts as per design specifications.

## Components Created

### 1. AdPlaceholder Component
**File**: `src/components/general/establishments/AdPlaceholder.tsx`

A reusable component that renders different ad placeholder variants with specific styling.

#### Variants:
- `top-left`: 642px × 200px, light gray background
- `top-right`: 642px × 200px, light gray background
- `bottom-small`: 534px × 180px, blue background
- `bottom-medium`: 534px × 376px, blue background
- `bottom-large`: 762px × 376px, blue background

#### Features:
- Responsive design (full width on mobile, fixed width on desktop)
- Custom colors based on variant
- Arabic text support with Tajawal font
- Rounded corners (16px border-radius)

### 2. TopAdSection Component
**File**: `src/components/general/establishments/TopAdSection.tsx`

Displays two horizontal ad placeholders at the top of the page.

#### Layout:
```
┌─────────────────────────────────────────────────┐
│  [Ad 642×200]    [Gap 36px]    [Ad 642×200]    │
└─────────────────────────────────────────────────┘
Total width: 1320px
```

#### Responsive:
- **Desktop**: Two ads side by side
- **Mobile**: Stacked vertically

### 3. BottomAdSection Component
**File**: `src/components/general/establishments/BottomAdSection.tsx`

Displays three ad placeholders in a custom layout at the bottom.

#### Layout:
```
┌─────────────────────────────────────────────────┐
│  [Small Ad 534×180]                             │
├─────────────────────────────────────────────────┤
│  [Medium Ad 534×376]  [Gap]  [Large Ad 762×376] │
└─────────────────────────────────────────────────┘
Total width: 1320px
Gap: 24px
```

#### Responsive:
- **Desktop**: Custom layout as shown
- **Mobile**: All ads stacked vertically

## Design Specifications

### Top Ads
- **Dimensions**: 642px × 200px each
- **Gap**: 36px between ads
- **Background**: #FBFBFB (light gray)
- **Border Radius**: 16px
- **Padding**: 16px
- **Text**: "استغل المساحة الإعلانية الآن"
- **Text Color**: #8E8E8E (mid gray)
- **Font**: Tajawal, 24px, Regular

### Bottom Ads

#### Small Ad
- **Dimensions**: 534px × 180px
- **Background**: #2B3990 (primary blue)
- **Text**: "مساحة إعلانية"
- **Text Color**: White
- **Font**: Tajawal, 24px, Bold

#### Medium Ad
- **Dimensions**: 534px × 376px
- **Background**: #2B3990 (primary blue)
- **Text**: "مساحة إعلانية"
- **Text Color**: White
- **Font**: Tajawal, 24px, Bold

#### Large Ad
- **Dimensions**: 762px × 376px
- **Background**: #2B3990 (primary blue)
- **Text**: "مساحة إعلانية"
- **Text Color**: White
- **Font**: Tajawal, 24px, Bold

## Page Integration

### Updated File
`src/app/[locale]/(website)/establishments/page.tsx`

### Structure:
```tsx
<div>
  <TopAdSection />           {/* 2 horizontal ads */}
  <Nurseries ... />          {/* Main content */}
  <BottomAdSection />        {/* 3 ads in custom layout */}
  <BlogsWrapper ... />       {/* Blog section */}
  <Contact />                {/* Contact form */}
</div>
```

## Visual Layout

### Desktop View (1320px container)
```
┌──────────────────────────────────────────────────────┐
│                    Top Ad Section                     │
│  ┌──────────────┐        ┌──────────────┐           │
│  │  استغل       │  36px  │  استغل       │           │
│  │  المساحة     │        │  المساحة     │           │
│  │  الإعلانية   │        │  الإعلانية   │           │
│  │  الآن        │        │  الآن        │           │
│  │  642×200     │        │  642×200     │           │
│  │  #FBFBFB     │        │  #FBFBFB     │           │
│  └──────────────┘        └──────────────┘           │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│              Main Establishments Content              │
│  (Search, Filters, Establishment Cards)              │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│                  Bottom Ad Section                    │
│  ┌──────────────┐                                    │
│  │  مساحة       │                                    │
│  │  إعلانية     │                                    │
│  │  534×180     │                                    │
│  │  #2B3990     │                                    │
│  └──────────────┘                                    │
│                                                       │
│  ┌──────────────┐        ┌─────────────────┐        │
│  │  مساحة       │  24px  │  مساحة          │        │
│  │  إعلانية     │        │  إعلانية        │        │
│  │              │        │                 │        │
│  │  534×376     │        │  762×376        │        │
│  │  #2B3990     │        │  #2B3990        │        │
│  └──────────────┘        └─────────────────┘        │
└──────────────────────────────────────────────────────┘
```

### Mobile View (< 1024px)
```
┌─────────────────────┐
│   Top Ad Section    │
│  ┌───────────────┐  │
│  │  استغل        │  │
│  │  المساحة      │  │
│  │  الإعلانية    │  │
│  │  الآن         │  │
│  │  Full Width   │  │
│  └───────────────┘  │
│                     │
│  ┌───────────────┐  │
│  │  استغل        │  │
│  │  المساحة      │  │
│  │  الإعلانية    │  │
│  │  الآن         │  │
│  │  Full Width   │  │
│  └───────────────┘  │
└─────────────────────┘

┌─────────────────────┐
│   Main Content      │
└─────────────────────┘

┌─────────────────────┐
│  Bottom Ad Section  │
│  ┌───────────────┐  │
│  │  مساحة        │  │
│  │  إعلانية      │  │
│  │  Full Width   │  │
│  └───────────────┘  │
│                     │
│  ┌───────────────┐  │
│  │  مساحة        │  │
│  │  إعلانية      │  │
│  │  Full Width   │  │
│  └───────────────┘  │
│                     │
│  ┌───────────────┐  │
│  │  مساحة        │  │
│  │  إعلانية      │  │
│  │  Full Width   │  │
│  └───────────────┘  │
└─────────────────────┘
```

## Color Palette

| Element | Color | Hex Code |
|---------|-------|----------|
| Top Ads Background | Light Gray | #FBFBFB |
| Top Ads Text | Mid Gray | #8E8E8E |
| Bottom Ads Background | Primary Blue | #2B3990 |
| Bottom Ads Text | White | #FFFFFF |

## Typography

| Element | Font | Weight | Size | Line Height |
|---------|------|--------|------|-------------|
| Top Ads | Tajawal | 400 (Regular) | 24px (desktop), 20px (mobile) | 100% |
| Bottom Ads | Tajawal | 700 (Bold) | 24px (desktop), 20px (mobile) | 100% |

## Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| < 1024px (Mobile/Tablet) | All ads stack vertically, full width |
| ≥ 1024px (Desktop) | Fixed widths, custom layouts |

## Implementation Details

### CSS Classes Used
```css
/* Container */
.container mx-auto px-4

/* Layout */
.flex flex-col lg:flex-row
.gap-9 (top section)
.gap-6 (bottom section)

/* Sizing */
.lg:w-[642px] (top ads)
.lg:w-[534px] (bottom small/medium)
.lg:w-[762px] (bottom large)
.h-[200px] (top ads)
.h-[180px] (bottom small)
.h-[376px] (bottom medium/large)

/* Styling */
.rounded-2xl (16px border-radius)
.bg-[#FBFBFB] (top ads)
.bg-[#2B3990] (bottom ads)
.p-4 (16px padding)

/* Typography */
.font-tajawal
.text-xl lg:text-2xl
.font-normal (top)
.font-bold (bottom)
.text-[#8E8E8E] (top)
.text-white (bottom)
```

## Benefits

### User Experience
- Clear visual separation between content and ads
- Consistent styling across all ad spaces
- Responsive design for all devices
- Professional appearance

### Business
- 5 total ad spaces (2 top + 3 bottom)
- Strategic placement (top and bottom of content)
- Different sizes for different ad types
- Easy to replace with real ads later

### Technical
- Reusable component architecture
- Type-safe with TypeScript
- Responsive by default
- Easy to maintain and update

## Future Enhancements

### Phase 1: Real Ads Integration
- [ ] Connect to ad management system
- [ ] Add click tracking
- [ ] Implement impression tracking
- [ ] Add A/B testing capability

### Phase 2: Dynamic Content
- [ ] Fetch ads from API
- [ ] Support multiple ad formats (image, video, HTML)
- [ ] Add rotation/scheduling
- [ ] Implement targeting rules

### Phase 3: Analytics
- [ ] Track ad performance
- [ ] Monitor click-through rates
- [ ] Generate revenue reports
- [ ] Optimize placement based on data

## Testing Checklist

### Visual Testing
- [ ] Top ads display correctly on desktop
- [ ] Top ads stack on mobile
- [ ] Bottom ads layout correctly on desktop
- [ ] Bottom ads stack on mobile
- [ ] Colors match specifications
- [ ] Text is readable and properly aligned
- [ ] Border radius is correct
- [ ] Spacing/gaps are accurate

### Responsive Testing
- [ ] Test at 1920px (large desktop)
- [ ] Test at 1366px (laptop)
- [ ] Test at 1024px (tablet landscape)
- [ ] Test at 768px (tablet portrait)
- [ ] Test at 375px (mobile)

### Browser Testing
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

### RTL Testing
- [ ] Arabic text displays correctly
- [ ] Layout works in RTL mode
- [ ] Spacing is consistent

## Maintenance

### Updating Ad Text
Edit the `variants` object in `AdPlaceholder.tsx`:
```tsx
const variants = {
  "top-left": {
    text: "Your new text here",
  },
  // ...
};
```

### Changing Colors
Update the background colors in `AdPlaceholder.tsx`:
```tsx
isTopVariant ? "bg-[#FBFBFB]" : "bg-[#2B3990]"
```

### Adjusting Sizes
Modify the width/height in the `variants` object:
```tsx
const variants = {
  "top-left": {
    width: "lg:w-[YOUR_WIDTH]",
    height: "h-[YOUR_HEIGHT]",
  },
};
```

---

**Status**: ✅ Complete  
**Components**: 3 new files  
**No Errors**: All diagnostics passed  
**Responsive**: Yes  
**RTL Support**: Yes
