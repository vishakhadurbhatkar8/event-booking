# Testing Your Booking System

## Setup Instructions

1. **Create the .env file** in `event-booking-backend/`:
   ```
   MONGO_URI=mongodb://localhost:27017/event-booking
   PORT=4000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

2. **Start MongoDB** (if not running):
   ```bash
   mongod
   ```

3. **Start the backend**:
   ```bash
   cd event-booking-backend
   npm start
   ```

4. **Start the frontend**:
   ```bash
   ng serve
   ```

## Testing the Booking Flow

1. **Login**:
   - Go to `http://localhost:4200/login`
   - Enter any email (e.g., `test@example.com`)
   - Click "Request OTP"
   - Check the console for the OTP (it's logged for testing)
   - Enter the OTP and login

2. **Reserve a Seat**:
   - Go to `http://localhost:4200/events`
   - Click on any event to view details
   - Click "Reserve Seat" button
   - You should see "Seat reserved successfully!" message
   - A 2-minute countdown should start

3. **Confirm Booking**:
   - While the countdown is running, click "Confirm Booking"
   - You should see "Booking confirmed!" message
   - You'll be redirected to the bookings page

4. **View Bookings**:
   - Go to `http://localhost:4200/bookings`
   - You should see your confirmed booking

## What Was Fixed

✅ **Backend Issues**:
- Fixed user ID reference (`req.user.id` → `req.user._id`)
- Added proper event-specific booking route (`/events/:id/book`)
- Added confirm booking endpoint
- Fixed authentication middleware

✅ **Frontend Issues**:
- Fixed API endpoint calls to match backend
- Added proper authorization headers
- Fixed response handling
- Added proper error messages

✅ **API Endpoints**:
- `POST /events/:id/book` - Reserve a seat for an event
- `PUT /bookings/:id/confirm` - Confirm a booking
- `GET /bookings/me` - Get user's bookings
- `PUT /bookings/:id/cancel` - Cancel a booking

The booking system should now work properly!
