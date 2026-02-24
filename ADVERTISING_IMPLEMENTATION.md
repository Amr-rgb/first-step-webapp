# Advertising Implementation Guide

## Overview
The new establishments page includes advertising spaces at the top and bottom of the page, replacing the coupon slider that was previously shown.

## Implementation Details

### 1. Advertisement Component
**Location**: `src/components/general/Advertisment.tsx`

The component uses a carousel to display advertisement slides fetched from the API.

```typescript
<Advertisment slides={adSlides} />
```

### 2. Data Source
**API Endpoint**: `/sliders`
**Service**: `websiteService.getAdSlides(locale)`
**Type**: `AdSlide[]`

```typescript
interface AdSlide {
  id: number;
  title: string;
  image: string;
  created_at: string;
  published_at: string;
}
```

### 3. Page Structure

```typescript
export default async function EstablishmentsPage() {
  // Fetch data
  const [nurseriesData, adsData, citiesData] = await Promise.all([
    nurseryService.getNurseries(locale),
    websiteService.getAdSlides(locale),  // ← Fetch ads
    getCitiesAction(),
  ]);

  return (
    <div>
      {/* Top Advertising Space */}
      {adSlides.length > 0 && <Advertisment slides={adSlides} />}
      
      {/* Main Content */}
      <Nurseries ... />
      
      {/* Bottom Advertising Space */}
      {adSlides.length > 0 && <Advertisment slides={adSlides} />}
      
      {/* Other sections */}
      <BlogsWrapper ... />
      <Contact />
    </div>
  );
}
```

## Key Changes from Old Pages

### Old Implementation (Nurseries/Centers)
```typescript
// Top of page
{coupons.length > 0 && <CouponSlider coupons={coupons} />}

// Main content
<Nurseries ... />

// No bottom advertising
```

### New Implementation (Establishments)
```typescript
// Top of page
{adSlides.length > 0 && <Advertisment slides={adSlides} />}

// Main content
<Nurseries ... />

// Bottom of page
{adSlides.length > 0 && <Advertisment slides={adSlides} />}
```

## Visual Layout

```
┌─────────────────────────────────────┐
│                                     │
│     TOP ADVERTISING CAROUSEL        │
│     (Auto-rotating ad slides)       │
│                                     │
├─────────────────────────────────────┤
│                                     │
│     ESTABLISHMENTS GRID             │
│     - Search bar                    │
│     - Filter sidebar                │
│     - Establishment cards           │
│                                     │
├─────────────────────────────────────┤
│                                     │
│     BOTTOM ADVERTISING CAROUSEL     │
│     (Auto-rotating ad slides)       │
│                                     │
├─────────────────────────────────────┤
│     BLOG SECTION (4 posts)          │
├─────────────────────────────────────┤
│     CONTACT FORM                    │
└─────────────────────────────────────┘
```

## Carousel Features

The `Advertisment` component uses the `Carousel` component which includes:
- Auto-play functionality
- Navigation arrows
- Dot indicators
- Responsive design
- RTL support for Arabic

## Benefits

1. **Monetization**: Two advertising spaces for revenue generation
2. **User Experience**: Removed redundant coupon slider
3. **Consistency**: Same ad content shown twice for better visibility
4. **Flexibility**: Easy to manage ads through the API
5. **Performance**: Ads are fetched once and reused

## Managing Advertisements

Advertisements are managed through:
- **Admin Dashboard**: `/dashboard/admin/advertisements`
- **API**: Backend endpoint for CRUD operations
- **Format**: Images with titles
- **Caching**: 24-hour revalidation (86400 seconds)

## Future Enhancements

Consider these improvements:
- Different ads for top vs bottom positions
- A/B testing for ad effectiveness
- Click tracking and analytics
- Conditional display based on user type
- Sponsored establishment listings
