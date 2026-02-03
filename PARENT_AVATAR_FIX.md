# Parent Avatar Fix - Show Actual Name Initial

## Problem
Parent avatars were showing "U" instead of the actual first letter of the parent's name because the `senderName` was being set to "You" for current user messages.

## Root Cause
1. The `updateSenderNames` function in `chatService.ts` was setting generic names like "You", "Admin", "Center", "Parent"
2. The `sendMessage` function's mock message fallback was using generic "Parent" name
3. The `mapApiMessageToMessage` function wasn't using actual user names

## Solution

### 1. Updated `updateSenderNames` Function
- Added `contactName` and `currentUserName` parameters
- Now uses actual names instead of generic "You", "Parent", etc.
- Falls back to generic names only when actual names aren't available

```typescript
const updateSenderNames = (
  messages: Message[], 
  currentUserId: string, 
  currentUserType: "center" | "parent" | "admin", 
  contactName?: string, 
  currentUserName?: string
) => {
  messages.forEach(message => {
    if (message.senderId === currentUserId) {
      // Use actual user name instead of "You"
      if (currentUserType === "admin") {
        message.senderName = "Admin";
      } else if (currentUserName) {
        message.senderName = currentUserName; // ✅ Actual parent/center name
      } else {
        message.senderName = currentUserType === "center" ? "Center" : "Parent";
      }
    } else {
      // Use contact name if available
      if (message.senderType === "admin") {
        message.senderName = "Admin";
      } else if (contactName) {
        message.senderName = contactName; // ✅ Actual contact name
      } else if (message.senderType === "center") {
        message.senderName = "Center";
      } else {
        message.senderName = "Parent";
      }
    }
  });
};
```

### 2. Updated `getMessages` Function
- Added `contactName` and `currentUserName` parameters
- Passes these to `updateSenderNames` for proper name resolution

### 3. Updated `sendMessage` Function
- Added `currentUserName` parameter
- Uses actual user name in mock message fallback instead of generic "Parent"

### 4. Updated `mapApiMessageToMessage` Function
- Added `currentUserName` parameter
- Sets proper sender name for current user messages

### 5. Updated Chat Pages
- **Parent Chat Page**: Passes `currentUser.name` and contact name to `getMessages` and `sendMessage`
- **Center Chat Page**: Passes `currentUser.name` and contact name to `getMessages` and `sendMessage`
- Updated dependency arrays to include `currentUser.name` and `chats`

## Files Modified
1. `src/services/chatService.ts`
   - Updated `updateSenderNames` function
   - Updated `getMessages` function signature and implementation
   - Updated `sendMessage` function signature and implementation
   - Updated `mapApiMessageToMessage` function
   - Updated calls to `getMessages` in `markChatAsRead` and `markRecentMessagesAsRead`

2. `src/app/[locale]/dashboard/parent/chat/page.tsx`
   - Updated `fetchMessages` to pass contact name and current user name
   - Updated `handleSendMessage` to pass current user name
   - Updated dependency array for `fetchMessages`

3. `src/app/[locale]/dashboard/center/chat/page.tsx`
   - Updated `fetchMessages` to pass contact name and current user name
   - Updated `handleSendMessage` to pass current user name
   - Updated dependency array for `fetchMessages`

## Result
✅ Parent avatars now show the actual first letter of the parent's name (e.g., "M" for "Mohammed") instead of "U"
✅ Center avatars show the actual first letter of the center's name
✅ All message sender names use actual names when available
✅ Fallback to generic names only when actual names aren't provided

## Testing
The Avatar component correctly uses `message.senderName`, so when a parent named "Mohammed" sends a message, the avatar will show "M" with a green background.

## Admin Chat
Admin chat pages use `getAdminConversationMessages` which handles sender names differently and doesn't need these updates.