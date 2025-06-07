# KYB Assessment SSE Implementation

This document describes the implementation of Server-Sent Events (SSE) for real-time KYB assessment updates, replacing the previous polling mechanism.

## Changes Made

### Backend (workflows-service)

1. **New SSE Endpoint**: Added a new endpoint in `assessments.controller.external.ts`:
   - `GET /api/v1/external/assessments/kyb_and_ownership/:id/sse`
   - Streams real-time updates for a specific KYB assessment
   - Sends updates every 2 seconds (can be optimized to only send on actual changes)
   - Handles authentication via Bearer token

### Frontend (backoffice-v2)

1. **New SSE Hook**: Created `useKybAndOwnershipAssessmentSSE` hook:
   - Establishes SSE connection with authentication headers
   - Automatically updates React Query cache when new data arrives
   - Handles reconnection on connection loss (5-second retry)
   - Provides connection status and error information

2. **Updated Query Hook**: Modified `useKybAndOwnershipAssessmentQuery`:
   - Removed `refetchInterval: 10000` (10-second polling)
   - Added SSE integration
   - Only refetches on window focus if SSE is disconnected
   - Increased stale time to 5 minutes since SSE handles updates

## Benefits

1. **Real-time Updates**: Assessment status changes are reflected immediately
2. **Reduced Server Load**: No more polling every 10 seconds
3. **Better User Experience**: Instant updates without manual refresh
4. **Efficient**: Only sends data when there are actual changes (once optimized)

## Usage

The SSE connection is automatically established when using the `useKybAndOwnershipAssessmentQuery` hook. The hook now returns additional properties:

```typescript
const { 
  data, 
  isLoading, 
  error,
  sseConnected,  // true if SSE connection is active
  sseError       // SSE connection error if any
} = useKybAndOwnershipAssessmentQuery({ id: assessmentId });
```

## Future Improvements

1. **Optimize Backend**: Only send SSE events when assessment data actually changes
2. **Add Event Types**: Send different event types for different changes (status, data, etc.)
3. **Implement for Other Entities**: Apply same pattern to workflows, alerts, etc.
4. **Add Metrics**: Track SSE connection health and performance

## Testing

To test the SSE implementation:

1. Open a KYB assessment detail page
2. Check browser DevTools Network tab for the SSE connection
3. Update the assessment status via API or another tab
4. Observe real-time updates without page refresh