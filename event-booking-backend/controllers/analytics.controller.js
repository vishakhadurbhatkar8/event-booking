import Booking from "../models/booking.model.js";
import Event from "../models/event.model.js";
import User from "../models/user.model.js";

export const getBookingAnalytics = async (req, res) => {
  try {
    // Only superadmin can access this endpoint
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ message: "Access denied. Superadmin only." });
    }

    // Get booking statistics
    const totalBookings = await Booking.countDocuments();
    const approvedBookings = await Booking.countDocuments({ status: 'approved' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const rejectedBookings = await Booking.countDocuments({ status: 'rejected' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });

    // Get event statistics
    const totalEvents = await Event.countDocuments();
    const approvedEvents = await Event.countDocuments({ approved: true });
    const pendingEvents = await Event.countDocuments({ approved: false });

    // Get bookings per event
    const bookingsPerEvent = await Booking.aggregate([
      {
        $lookup: {
          from: 'events',
          localField: 'event',
          foreignField: '_id',
          as: 'eventData'
        }
      },
      {
        $unwind: '$eventData'
      },
      {
        $group: {
          _id: '$eventData.title',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10 // Top 10 events
      }
    ]);

    // Get bookings by status
    const bookingsByStatus = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get events by approval status
    const eventsByStatus = await Event.aggregate([
      {
        $group: {
          _id: '$approved',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get event popularity (most booked events)
    const eventPopularity = await Booking.aggregate([
      {
        $lookup: {
          from: 'events',
          localField: 'event',
          foreignField: '_id',
          as: 'eventData'
        }
      },
      {
        $unwind: '$eventData'
      },
      {
        $group: {
          _id: '$eventData.title',
          bookings: { $sum: 1 },
          eventId: { $first: '$eventData._id' }
        }
      },
      {
        $sort: { bookings: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Get location-wise bookings
    const locationWiseBookings = await Booking.aggregate([
      {
        $lookup: {
          from: 'events',
          localField: 'event',
          foreignField: '_id',
          as: 'eventData'
        }
      },
      {
        $unwind: '$eventData'
      },
      {
        $group: {
          _id: '$eventData.location',
          bookings: { $sum: 1 },
          approvedBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
          },
          pendingBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          }
        }
      },
      {
        $sort: { bookings: -1 }
      }
    ]);

    // Get expected outcome insights (booking trends by month)
    const monthlyTrends = await Booking.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$reservedAt' },
            month: { $month: '$reservedAt' }
          },
          totalBookings: { $sum: 1 },
          approvedBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
          },
          pendingBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      },
      {
        $limit: 12 // Last 12 months
      }
    ]);

    // Get recent bookings (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentBookings = await Booking.countDocuments({
      reservedAt: { $gte: sevenDaysAgo }
    });

    res.json({
      summary: {
        totalBookings,
        approvedBookings,
        pendingBookings,
        rejectedBookings,
        cancelledBookings,
        totalEvents,
        approvedEvents,
        pendingEvents,
        recentBookings
      },
      charts: {
        bookingsPerEvent: bookingsPerEvent.map(item => ({
          event: item._id,
          bookings: item.count
        })),
        bookingsByStatus: bookingsByStatus.map(item => ({
          status: item._id,
          count: item.count
        })),
        eventsByStatus: eventsByStatus.map(item => ({
          status: item._id ? 'Approved' : 'Pending',
          count: item.count
        })),
        eventPopularity: eventPopularity.map(item => ({
          event: item._id,
          bookings: item.bookings,
          eventId: item.eventId
        })),
        locationWiseBookings: locationWiseBookings.map(item => ({
          location: item._id || 'Unknown',
          totalBookings: item.bookings,
          approvedBookings: item.approvedBookings,
          pendingBookings: item.pendingBookings
        })),
        monthlyTrends: monthlyTrends.map(item => ({
          month: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`,
          totalBookings: item.totalBookings,
          approvedBookings: item.approvedBookings,
          pendingBookings: item.pendingBookings
        }))
      }
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};
