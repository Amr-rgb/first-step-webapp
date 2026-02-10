# Bottom Advertisement Section Layout Guide

## New Layout Structure

### RTL (Arabic) Layout - Desktop
```
┌─────────────────────────────────────────────────────────────┐
│  مساحة إعلانية (Title)                                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────┐  ┌──────────────────────────┐│
│  │                          │  │                          ││
│  │  RIGHT COLUMN (RTL)      │  │  LEFT COLUMN (RTL)       ││
│  │                          │  │                          ││
│  │  ┌────────────────────┐  │  │  ┌────────────────────┐ ││
│  │  │                    │  │  │  │                    │ ││
│  │  │  مساحة إعلانية     │  │  │  │  مساحة إعلانية     │ ││
│  │  │                    │  │  │  │                    │ ││
│  │  │  Large Ad          │  │  │  │  Medium Ad         │ ││
│  │  │  (50% width)       │  │  │  │  (50% width)       │ ││
│  │  │  Full height       │  │  │  │  50% height        │ ││
│  │  │                    │  │  │  └────────────────────┘ ││
│  │  │                    │  │  │                          ││
│  │  │                    │  │  │  ↓ 24px gap ↓            ││
│  │  │                    │  │  │                          ││
│  │  │                    │  │  │  ┌────────────────────┐ ││
│  │  │                    │  │  │  │                    │ ││
│  │  │                    │  │  │  │  مساحة إعلانية     │ ││
│  │  │                    │  │  │  │                    │ ││
│  │  │                    │  │  │  │  Small Ad          │ ││
│  │  │                    │  │  │  │  (50% width)       │ ││
│  │  │                    │  │  │  │  50% height        │ ││
│  │  │                    │  │  │  │                    │ ││
│  │  └────────────────────┘  │  │  └────────────────────┘ ││
│  │                          │  │                          ││
│  └──────────────────────────┘  └──────────────────────────┘│
│              ↑ 24px gap ↑                                    │
└─────────────────────────────────────────────────────────────┘
```

### LTR (English) Layout - Desktop
```
┌─────────────────────────────────────────────────────────────┐
│                                      Advertising Space (Title)│
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────┐  ┌──────────────────────────┐│
│  │                          │  │                          ││
│  │  LEFT COLUMN (LTR)       │  │  RIGHT COLUMN (LTR)      ││
│  │                          │  │                          ││
│  │  ┌────────────────────┐  │  │  ┌────────────────────┐ ││
│  │  │                    │  │  │  │                    │ ││
│  │  │  Advertising Space │  │  │  │  Advertising Space │ ││
│  │  │                    │  │  │  │                    │ ││
│  │  │  Large Ad          │  │  │  │  Medium Ad         │ ││
│  │  │  (50% width)       │  │  │  │  (50% width)       │ ││
│  │  │  Full height       │  │  │  │  50% height        │ ││
│  │  │                    │  │  │  └────────────────────┘ ││
│  │  │                    │  │  │                          ││
│  │  │                    │  │  │  ↓ 24px gap ↓            ││
│  │  │                    │  │  │                          ││
│  │  │                    │  │  │  ┌────────────────────┐ ││
│  │  │                    │  │  │  │                    │ ││
│  │  │                    │  │  │  │  Advertising Space │ ││
│  │  │                    │  │  │  │                    │ ││
│  │  │                    │  │  │  │  Small Ad          │ ││
│  │  │                    │  │  │  │  (50% width)       │ ││
│  │  │                    │  │  │  │  50% height        │ ││
│  │  │                    │  │  │  │                    │ ││
│  │  └────────────────────┘  │  │  └────────────────────┘ ││
│  │                          │  │                          ││
│  └──────────────────────────┘  └──────────────────────────┘│
│              ↑ 24px gap ↑                                    │
└─────────────────────────────────────────────────────────────┘
```

### Mobile Layout (< 1024px)
```
┌──────────────────────────────────┐
│  مساحة إعلانية (Title)           │
├──────────────────────────────────┤
│                                  │
│  ┌────────────────────────────┐  │
│  │                            │  │
│  │  مساحة إعلانية             │  │
│  │                            │  │
│  │  Large Ad                  │  │
│  │  (100% width)              │  │
│  │  min-height: 400px         │  │
│  │                            │  │
│  │                            │  │
│  └────────────────────────────┘  │
│                                  │
│         ↓ 24px gap ↓             │
│                                  │
│  ┌────────────────────────────┐  │
│  │                            │  │
│  │  مساحة إعلانية             │  │
│  │                            │  │
│  │  Medium Ad                 │  │
│  │  (100% width)              │  │
│  │  min-height: 200px         │  │
│  │                            │  │
│  └────────────────────────────┘  │
│                                  │
│         ↓ 24px gap ↓             │
│                                  │
│  ┌────────────────────────────┐  │
│  │                            │  │
│  │  مساحة إعلانية             │  │
│  │                            │  │
│  │  Small Ad                  │  │
│  │  (100% width)              │  │
│  │  min-height: 180px         │  │
│  │                            │  │
│  └────────────────────────────┘  │
│                                  │
└──────────────────────────────────┘
```

## Layout Specifications

### Desktop (≥ 1024px)

#### Container
- Max width: 1320px
- Padding: 16px (container padding)
- Gap between columns: 24px

#### Title
- Text: "مساحة إعلانية"
- Font size: 24px (lg: 32px)
- Font weight: Bold (700)
- Color: Primary
- Alignment: Right (RTL)
- Margin bottom: 24px

#### Right Column (RTL) / Left Column (LTR)
- Width: 50% (flex: 1)
- Contains: 1 large ad
- Ad fills full height of container

#### Left Column (RTL) / Right Column (LTR)
- Width: 50% (flex: 1)
- Contains: 2 stacked ads
- Gap between ads: 24px
- Each ad takes 50% height (flex: 1)

### Mobile (< 1024px)

#### Layout
- All ads stack vertically
- Each ad takes full width
- Gap between ads: 24px

#### Ad Heights
- Large: min-height 400px
- Medium: min-height 200px
- Small: min-height 180px

## Component Structure

```tsx
<BottomAdSection>
  <Container>
    <Title>مساحة إعلانية</Title>
    
    <Grid>
      {/* Right Column (RTL) */}
      <Column width="50%">
        <AdPlaceholder variant="bottom-large" />
      </Column>
      
      {/* Left Column (RTL) */}
      <Column width="50%">
        <AdPlaceholder variant="bottom-medium" />
        <AdPlaceholder variant="bottom-small" />
      </Column>
    </Grid>
  </Container>
</BottomAdSection>
```

## CSS Classes Used

### Container
```css
.container mx-auto px-4
.max-w-[1320px]
```

### Title
```css
.text-2xl lg:text-3xl
.font-bold
.text-primary
.mb-6
.text-right
```

### Grid
```css
.flex flex-col lg:flex-row
.items-stretch
.gap-6
```

### Columns
```css
.w-full lg:w-1/2
.flex flex-col
.gap-6
```

### Ad Placeholders
```css
.w-full
.h-full (large ad)
.flex-1 (medium & small ads)
```

## Flexbox Behavior

### Desktop Layout
```
Container (flex-row)
├── Column 1 (w-1/2)
│   └── Large Ad (h-full)
│
└── Column 2 (w-1/2, flex-col)
    ├── Medium Ad (flex-1)
    └── Small Ad (flex-1)
```

### Mobile Layout
```
Container (flex-col)
├── Large Ad (w-full)
├── Medium Ad (w-full)
└── Small Ad (w-full)
```

## Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| < 1024px | Vertical stack, full width |
| ≥ 1024px | Two columns, 50% each |

## RTL/LTR Support

The layout automatically adapts to text direction:

### RTL (Arabic)
- Title aligned right
- Large ad on the right
- Two stacked ads on the left

### LTR (English)
- Title aligned left (if changed)
- Large ad on the left
- Two stacked ads on the right

## Benefits

### User Experience
- ✅ Clear section title
- ✅ Balanced layout
- ✅ Equal visual weight
- ✅ Responsive design

### Business
- ✅ 3 ad spaces
- ✅ Different sizes for variety
- ✅ Prominent placement
- ✅ Good visibility

### Technical
- ✅ Flexbox-based
- ✅ Responsive
- ✅ RTL/LTR support
- ✅ Clean code

## Comparison: Old vs New

### Old Layout
```
┌─────────────────────────┐
│  Small Ad (534×180)     │
├─────────────────────────┤
│  Medium (534×376)       │
│  Large (762×376)        │
└─────────────────────────┘
```

### New Layout
```
┌─────────────────────────┐
│  Title: مساحة إعلانية   │
├─────────────────────────┤
│  Large    │  Medium     │
│  (50%)    │  (50%)      │
│           ├─────────────┤
│           │  Small      │
│           │  (50%)      │
└─────────────────────────┘
```

## Testing Checklist

- [ ] Title displays correctly
- [ ] Large ad fills right column (RTL)
- [ ] Two ads stack in left column (RTL)
- [ ] 24px gap between columns
- [ ] 24px gap between stacked ads
- [ ] All ads equal height on desktop
- [ ] Mobile: all ads stack vertically
- [ ] RTL layout works
- [ ] LTR layout works (if applicable)
- [ ] Responsive at all breakpoints

---

**Layout Type**: Two-column grid with nested stack  
**Responsive**: Yes  
**RTL Support**: Yes  
**Total Ads**: 3  
**Status**: ✅ Implemented
