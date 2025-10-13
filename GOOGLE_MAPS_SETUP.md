# Google Maps API Setup

To enable Google Maps location autocomplete functionality, you need to:

## 1. Get a Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Places API**
   - **Maps JavaScript API**
4. Create credentials (API Key)
5. Restrict the API key to your domain for security

## 2. Add the API Key to Environment Variables

Add your Google Maps API key to the `.env` file:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

## 3. Features

### With Google Maps API Key:
- Real-time location suggestions from Google Places
- Accurate addresses and landmarks
- Support for establishments and geocoding
- Bilingual support (Arabic/English)

### Without Google Maps API Key (Fallback):
- Basic Saudi Arabian city suggestions
- Local fallback suggestions
- Still functional but with limited options

## 4. Phone Number Validation

Phone numbers now accept any format including:
- International: +966501234567, +1234567890
- National: 0501234567, 501234567
- With spaces: +966 50 123 4567
- With dashes: +966-50-123-4567
- Any format with numbers, spaces, dashes, parentheses, and + sign

## 5. Location Validation

Location field accepts:
- Valid URLs (with or without http/https)
- Address formats
- Any text that looks like a location or link

