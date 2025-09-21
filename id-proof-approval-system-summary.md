# ID Proof Upload & Superadmin Approval System

## Features Implemented:

### 1. **New Booking Flow with ID Proof Requirement**
✅ **Updated Booking Model**: Added ID proof, approval status, and rejection reason fields
✅ **New Booking Statuses**: 
- `pending` - Initial status, requires ID proof upload
- `approved` - Superadmin approved the booking
- `rejected` - Superadmin rejected with reason
- `cancelled` - User cancelled the booking

### 2. **ID Proof Upload System**
✅ **File Upload**: Users can upload ID proof (PDF, JPG, PNG)
✅ **Upload Validation**: Only pending bookings can upload ID proof
✅ **File Storage**: ID proofs stored in `uploads/idproofs/` directory
✅ **User Interface**: File picker with upload button in event details

### 3. **Superadmin Approval System**
✅ **View All Bookings**: Superadmin can see all booking requests
✅ **ID Proof Viewer**: Click to view uploaded ID proofs
✅ **Approve/Reject Actions**: One-click approval or rejection with reason
✅ **Status Tracking**: See who approved/rejected and when

### 4. **Updated User Experience**
✅ **Booking Status Display**: Clear status indicators with colors
✅ **Progress Tracking**: Users see their booking status in real-time
✅ **Rejection Reasons**: Users see why their booking was rejected
✅ **Time Limits**: 2-minute countdown for ID proof upload

## Backend APIs Created:

### 1. **Upload ID Proof** (`POST /bookings/:id/upload-idproof`)
- Uploads ID proof file for a booking
- Only works for pending bookings
- Returns updated booking with file path

### 2. **Approve Booking** (`PUT /bookings/:id/approve`)
- Superadmin only
- Changes status from pending to approved
- Records approval timestamp and approver

### 3. **Reject Booking** (`PUT /bookings/:id/reject`)
- Superadmin only
- Changes status from pending to rejected
- Records rejection reason and timestamp

## Frontend Components Updated:

### 1. **Event Details Component**
- Shows booking status with appropriate UI
- File upload interface for ID proof
- Status-specific messaging and actions

### 2. **Admin Bookings Component**
- View all bookings with ID proof links
- Approve/Reject buttons for pending bookings
- Status indicators and rejection reasons

### 3. **Analytics Dashboard**
- Updated to show new booking statuses
- Charts reflect approved/pending/rejected/cancelled

## New Booking Flow:

1. **User clicks "Reserve Seat"** → Booking created with "pending" status
2. **User uploads ID proof** → File stored, booking remains "pending"
3. **Superadmin reviews** → Views ID proof and booking details
4. **Superadmin decides** → Approves or rejects with reason
5. **User sees result** → Final status displayed to user

## Security Features:

✅ **Role-based Access**: Only superadmin can approve/reject
✅ **File Validation**: Only specific file types accepted
✅ **Status Validation**: Only pending bookings can be modified
✅ **Audit Trail**: Records who approved/rejected and when

## File Structure:

```
uploads/
├── banners/          # Event banners
└── idproofs/         # User ID proofs
```

## How to Test:

### 1. **User Flow**:
1. Login as regular user
2. Go to event details
3. Click "Reserve Seat"
4. Upload ID proof file
5. See "Under review" status

### 2. **Superadmin Flow**:
1. Login as superadmin (`superadmin@gmail.com`)
2. Go to `/admin/bookings`
3. See all pending bookings
4. Click "View ID Proof" to see uploaded files
5. Click "Approve" or "Reject" with reason

### 3. **Status Updates**:
- Users see real-time status updates
- Rejected bookings show rejection reason
- Approved bookings show confirmation

The ID proof upload and superadmin approval system is now fully functional! 🎉
