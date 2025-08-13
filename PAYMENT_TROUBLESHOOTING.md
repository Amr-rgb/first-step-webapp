# Payment Initiation Troubleshooting Guide

## Issue Description
Users are experiencing "Payment initiation failed. Please check your connection and try again." error when trying to subscribe to plans in production.

## Recent Debug Findings

### Current Status (Development Environment):
- ✅ **Environment Variables**: All properly configured
- ✅ **Authentication**: User logged in as "center" role with valid token  
- ✅ **Payment Endpoint**: Returns 200 OK - API is accessible
- ⚠️ **API Health Check**: Returns 404 - `/health` endpoint doesn't exist (not critical)
- 🔍 **Response Format**: Need to verify what the payment endpoint actually returns

### Next Debug Steps:
1. **Test Payment Service**: Use the "Test Payment" button to see actual response format
2. **Check Response Structure**: Verify if response contains `success` and `payment_url` fields
3. **Compare Direct vs Service**: See if there's a difference between direct fetch and payment service

## Potential Causes and Solutions

### 1. Authentication Issues
**Symptoms:** 401 Unauthorized errors in console
**Solutions:**
- Ensure user is logged in before attempting payment
- Check if authentication token is valid and not expired
- Verify token is being sent in Authorization header

### 2. API Configuration Issues
**Symptoms:** Network errors, 404/500 responses
**Solutions:**
- Verify `NEXT_PUBLIC_API_BASE_URL` is correctly set to `https://back.firststep-app.com/api`
- Check if `X-Authorization` and `X-Authorization-Secret` headers are properly configured
- Ensure API endpoint `/payment/subscribe` exists and is accessible

### 3. CORS Issues
**Symptoms:** CORS errors in browser console
**Solutions:**
- Check if backend allows requests from your frontend domain
- Verify CORS headers are properly configured on the server

### 4. Network/Connectivity Issues
**Symptoms:** Network timeout errors, connection refused
**Solutions:**
- Check if the backend server is running and accessible
- Verify DNS resolution for `back.firststep-app.com`
- Check firewall settings

### 5. Request Format Issues
**Symptoms:** 422 Validation errors
**Solutions:**
- Ensure `plan_id` is being sent as a number
- Verify request body format matches API expectations
- Check if all required fields are included

### 6. Response Format Issues
**Symptoms:** 200 OK response but payment still fails
**Solutions:**
- Check if response contains expected `success` and `payment_url` fields
- Verify response structure matches frontend expectations
- Ensure response is valid JSON and properly formatted

## Debugging Steps

### 1. Check Browser Console
Look for these specific error messages:
- Network errors (status 0)
- 401 Unauthorized
- 403 Forbidden
- 422 Validation errors
- 500 Server errors

### 2. Verify Environment Variables
Check if these are properly set in production:
```bash
NEXT_PUBLIC_API_BASE_URL=https://back.firststep-app.com/api
NEXT_PUBLIC_X_AUTHORIZATION=bJPJemOddVQ2nmRP9EdKeoumMXgpq9Zlzd3cbCH6obeGKI1m7vxE2q0vAYQvtH8J
NEXT_PUBLIC_X_AUTHORIZATION_SECRET=zTEr5qWx4QeeHrH1DSN8WoAkIlCdFzhULX7Eqm4VCXX9KgObn1oHgPPvDTTpkMMd
```

### 3. Test API Endpoint Directly
Use curl or Postman to test the payment endpoint:
```bash
curl -X POST https://back.firststep-app.com/api/payment/subscribe \
  -H "Content-Type: application/json" \
  -H "X-Authorization: bJPJemOddVQ2nmRP9EdKeoumMXgpq9Zlzd3cbCH6obeGKI1m7vxE2q0vAYQvtH8J" \
  -H "X-Authorization-Secret: zTEr5qWx4QeeHrH1DSN8WoAkIlCdFzhULX7Eqm4VCXX9KgObn1oHgPPvDTTpkMMd" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"plan_id": 1}'
```

### 4. Check Authentication State
Verify that users are properly authenticated:
- Check if token exists in localStorage/cookies
- Verify token hasn't expired
- Ensure user role has permission to make payments

## Recent Improvements Made

### 1. Enhanced Error Handling
- Added specific error messages for different HTTP status codes
- Improved error logging with detailed information
- Added authentication check before payment attempt

### 2. Better Debugging
- Added console logging for payment requests and responses
- Created PaymentDebugger component for development testing
- Enhanced API client interceptors with better logging

### 3. Authentication Validation
- Added check to ensure user is logged in before payment
- Improved token validation and error handling

## Monitoring and Alerts

### 1. Console Logging
The improved code now logs:
- Payment initiation attempts
- API request details (without sensitive data)
- Response status and data
- Detailed error information

### 2. Error Tracking
Monitor these specific error patterns:
- Authentication failures (401)
- Permission denied (403)
- Validation errors (422)
- Server errors (500)
- Network timeouts

## Next Steps

1. **Deploy the improved code** with better error handling
2. **Monitor console logs** in production to identify specific error patterns
3. **Test the payment flow** with the debug component in development
4. **Check backend logs** for any server-side issues
5. **Verify API endpoint** is working correctly

## Contact Information
If issues persist, check:
- Backend server status
- API documentation for payment endpoint
- Server logs for detailed error information
