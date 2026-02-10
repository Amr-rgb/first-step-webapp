# Advertisement Sections - Unified Design

## Final Implementation

All advertisement placeholders (top and bottom) now have the **same consistent design**.

## Design Specifications

### All Ad Placeholders
- **Background**: #FBFBFB (light gray)
- **Text Color**: #8E8E8E (mid gray)
- **Font**: Tajawal
- **Font Size**: 20px (mobile), 24px (desktop)
- **Font Weight**: 400 (Regular)
- **Line Height**: 100%
- **Border Radius**: 16px
- **Padding**: 16px
- **Border**: None

### Text Content
- **Top Ads**: Uses `t("adSection.topPlaceholder")`
- **Bottom Ads**: Uses `t("adSection.bottomPlaceholder")`

## Layout Structure

### Top Section
```
┌─────────────────────────────────────────────────┐
│  ┌──────────────────────┐  ┌──────────────────┐│
│  │                      │  │                  ││
│  │  استغل المساحة      │  │  استغل المساحة  ││
│  │  الإعلانية الآن     │  │  الإعلانية الآن ││
│  │                      │  │                  ││
│  │  50% width           │  │  50% width       ││
│  │  200px height        │  │  200px height    ││
│  │  #FBFBFB bg          │  │  #FBFBFB bg      ││
│  │  #8E8E8E text        │  │  #8E8E8E text    ││
│  │                      │  │                  ││
│  └──────────────────────┘  └──────────────────┘│
│            ↑ 36px gap ↑                         │
└─────────────────────────────────────────────────┘
```

### Bottom Section
```
┌─────────────────────────────────────────────────┐
│  │ مساحة إعلانية (Title with border pipe)      │
├─────────────────────────────────────────────────┤
│  ┌──────────────────────┐  ┌──────────────────┐│
│  │                      │  │                  ││
│  │  استغل المساحة      │  │  استغل المساحة  ││
│  │  الإعلانية الآن     │  │  الإعلانية الآن ││
│  │                      │  │                  ││
│  │  50% width           │  │  50% width       ││
│  │  Full height         │  │  50% height      ││
│  │  #FBFBFB bg          │  ├──────────────────┤│
│  │  #8E8E8E text        │  │                  ││
│  │                      │  │  استغل المساحة  ││
│  │                      │  │  الإعلانية الآن ││
│  │                      │  │                  ││
│  │                      │  │  50% width       ││
│  │                      │  │  50% height      ││
│  │                      │  │  #FBFBFB bg      ││
│  │                      │  │  #8E8E8E text    ││
│  │                      │  │                  ││
│  └──────────────────────┘  └──────────────────┘│
│   Right (RTL)              Left (RTL)          │
│            ↑ 24px gaps ↑                        │
└─────────────────────────────────────────────────┘
```

## Complete Page Structure

```
┌─────────────────────────────────────────────────┐
│                   NAVBAR                         │
└─────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────┐
│              TOP AD SECTION                      │
│  ┌──────────────┐      ┌──────────────┐        │
│  │ استغل       │ 36px │ استغل        │        │
│  │ المساحة     │      │ المساحة      │        │
│  │ الإعلانية   │      │ الإعلانية    │        │
│  │ الآن        │      │ الآن         │        │
│  │ #FBFBFB     │      │ #FBFBFB      │        │
│  └──────────────┘      └──────────────┘        │
└─────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────┐
│           MAIN ESTABLISHMENTS CONTENT            │
│  (Search, Filters, Establishment Cards)         │
└─────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────┐
│            BOTTOM AD SECTION                     │
│  │ مساحة إعلانية                                │
│  ┌──────────────┐      ┌──────────────┐        │
│  │              │      │ استغل        │        │
│  │ استغل       │      │ المساحة      │        │
│  │ المساحة     │      │ الإعلانية    │        │
│  │ الإعلانية   │      │ الآن         │        │
│  │ الآن        │      │ #FBFBFB      │        │
│  │              │      ├──────────────┤        │
│  │ #FBFBFB     │      │ استغل        │        │
│  │              │      │ المساحة      │        │
│  │              │      │ الإعلانية    │        │
│  │              │      │ الآن         │        │
│  │              │      │ #FBFBFB      │        │
│  └──────────────┘      └──────────────┘        │
└─────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────┐
│              BLOG SECTION                        │
└─────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────┐
│            CONTACT SECTION                       │
└─────────────────────────────────────────────────┘
```

## Component Code

### AdPlaceholder.tsx (Simplified)
```tsx
const AdPlaceholder = ({ variant, className }) => {
  const t = useTranslations("adSection");
  
  const variants = {
    "top-left": { minHeight: "h-[200px]", textKey: "topPlaceholder" },
    "top-right": { minHeight: "h-[200px]", textKey: "topPlaceholder" },
    "bottom-small": { minHeight: "min-h-[180px]", textKey: "bottomPlaceholder" },
    "bottom-medium": { minHeight: "min-h-[200px]", textKey: "bottomPlaceholder" },
    "bottom-large": { minHeight: "min-h-[400px]", textKey: "bottomPlaceholder" },
  };

  return (
    <div className="rounded-2xl bg-[#FBFBFB] p-4 ...">
      <p className="font-tajawal text-xl lg:text-2xl font-normal text-[#8E8E8E]">
        {t(config.textKey)}
      </p>
    </div>
  );
};
```

### BottomAdSection.tsx
```tsx
const BottomAdSection = () => {
  const t = useTranslations("adSection");
  
  return (
    <section>
      {/* Title with border pipe */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-8 bg-primary rounded-full" />
        <h2>{t("title")}</h2>
      </div>
      
      {/* Grid Layout */}
      <div className="flex gap-6">
        <div className="w-1/2">
          <AdPlaceholder variant="bottom-large" />
        </div>
        <div className="w-1/2 flex flex-col gap-6">
          <AdPlaceholder variant="bottom-medium" />
          <AdPlaceholder variant="bottom-small" />
        </div>
      </div>
    </section>
  );
};
```

## Translations

### Arabic (ar.json)
```json
"adSection": {
  "title": "مساحة إعلانية",
  "topPlaceholder": "استغل المساحة الإعلانية الآن",
  "bottomPlaceholder": "استغل المساحة الإعلانية الآن"
}
```

### English (en.json)
```json
"adSection": {
  "title": "Advertising Space",
  "topPlaceholder": "Take advantage of the advertising space now",
  "bottomPlaceholder": "Take advantage of the advertising space now"
}
```

## Key Features

### Consistency
- ✅ All ads have the same visual style
- ✅ Unified color scheme
- ✅ Consistent typography
- ✅ Same border radius and padding

### Flexibility
- ✅ Different sizes for different placements
- ✅ Responsive layout
- ✅ Adapts to container size
- ✅ Works in RTL and LTR

### Maintainability
- ✅ Single source of styling
- ✅ Easy to update colors
- ✅ Centralized translations
- ✅ Type-safe TypeScript

## Responsive Behavior

### Desktop (≥ 1024px)
**Top Section**:
- Two ads side by side (50% each)
- 36px gap between

**Bottom Section**:
- Title with border pipe
- Two columns (50% each)
- Right: 1 large ad
- Left: 2 stacked ads
- 24px gaps

### Mobile (< 1024px)
**Top Section**:
- Ads stack vertically
- Full width
- 36px gap

**Bottom Section**:
- Title with border pipe
- All 3 ads stack vertically
- Full width
- 24px gaps

## Color Palette

| Element | Color | Hex Code | Usage |
|---------|-------|----------|-------|
| Background | Light Gray | #FBFBFB | All ad placeholders |
| Text | Mid Gray | #8E8E8E | All ad text |
| Title | Primary | - | Section title |
| Border Pipe | Primary | - | Title decoration |

## Typography

| Element | Font | Size (Mobile) | Size (Desktop) | Weight |
|---------|------|---------------|----------------|--------|
| Ad Text | Tajawal | 20px | 24px | 400 |
| Title | Tajawal | 24px | 24px | 700 |

## Benefits

### Visual Consistency
- All ads look cohesive
- Professional appearance
- Clear visual identity
- Easy to recognize as ad spaces

### User Experience
- Not distracting
- Clear placeholder indication
- Consistent expectations
- Clean design

### Development
- Simple to maintain
- Easy to update
- Consistent codebase
- Reusable component

## Summary

All advertisement placeholders now share:
- **Same background**: #FBFBFB
- **Same text color**: #8E8E8E
- **Same font**: Tajawal, 24px, Regular
- **Same styling**: Rounded corners, padding
- **Different sizes**: Based on placement
- **Translations**: Internationalized text

---

**Status**: ✅ Complete  
**Design**: ✅ Unified  
**Translations**: ✅ Implemented  
**TypeScript**: ✅ No errors  
**Ready for**: Production
