# Establishments Page Merge - Summary

## Changes Made

### 1. Created New Unified Establishments Page
- **File**: `src/app/[locale]/(website)/establishments/page.tsx`
- **Features**:
  - Combines both nurseries and centers into one page
  - Shows all establishments (no filtering by ID)
  - Removed coupon slider from the top
  - Added advertising spaces at both top and bottom
  - Includes city filtering support
  - Maintains blog section and contact form at the bottom

### 2. Updated Navigation (Navbar)
- **File**: `src/components/layout/Navbar.tsx`
- **Changes**:
  - Removed dropdown menu for "منشآت" (Establishments)
  - Changed from dropdown with "المراكز" and "الحضانات" to single link
  - Now shows "منشآت" as a direct link to `/establishments`

### 3. Updated Translation Files
- **Files**: 
  - `src/messages/ar.json`
  - `src/messages/en.json`
- **Changes**:
  - Navbar: Changed "nurseries" key to "establishments"
  - Removed "centers-item" and "nurseries-item" dropdown entries
  - Footer: Merged "nurseries" and "centers" into single "establishments" link
  - Arabic: "منشآت" → `/establishments`
  - English: "Establishments" → `/establishments`

### 4. Updated Footer Component
- **File**: `src/components/layout/Footer.tsx`
- **Changes**:
  - Removed separate "nurseries" and "centers" links
  - Added single "establishments" link

## Page Structure

The new establishments page includes:

1. **Top Advertising Space** - Carousel with ad slides
2. **Main Content** - All establishments (nurseries + centers combined)
   - Search functionality
   - City filtering
   - Category filtering
3. **Bottom Advertising Space** - Carousel with ad slides
4. **Blog Section** - Shows 4 latest blog posts
5. **Contact Section** - Contact form

## Old Pages Status

The old pages still exist but are no longer linked in navigation:
- `/nurseries` - Still functional but not in navbar
- `/centers` - Still functional but not in navbar

You may want to:
- Keep them for backward compatibility (redirects)
- Delete them if no longer needed
- Set up redirects from old URLs to new `/establishments` page

## Testing Checklist

- [ ] Verify navbar shows "منشآت" without dropdown
- [ ] Click "منشآت" navigates to `/establishments`
- [ ] Advertising spaces appear at top and bottom
- [ ] No coupon slider at the top
- [ ] All establishments are displayed (not filtered)
- [ ] City filtering works correctly
- [ ] Footer link points to `/establishments`
- [ ] Both Arabic and English translations work
- [ ] Mobile menu shows correct structure
