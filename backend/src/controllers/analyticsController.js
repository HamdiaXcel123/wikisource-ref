import Submission from '../models/Submission.js';
import User from '../models/User.js';
import Activity from '../models/Activity.js';

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    // User-specific stats
    const userSubmissions = await Submission.countDocuments({ submitter: userId });
    const userApproved = await Submission.countDocuments({ 
      submitter: userId, 
      status: 'approved' 
    });
    const userPending = await Submission.countDocuments({ 
      submitter: userId, 
      status: 'pending' 
    });

    // Global stats (for verifiers and admins)
    let globalStats = {};
    if (userRole === 'verifier' || userRole === 'admin') {
      const totalSubmissions = await Submission.countDocuments();
      const pendingVerification = await Submission.countDocuments({ status: 'pending' });
      const totalUsers = await User.countDocuments({ isActive: true });
      const totalVerifiers = await User.countDocuments({ 
        role: { $in: ['verifier', 'admin'] },
        isActive: true 
      });

      globalStats = {
        totalSubmissions,
        pendingVerification,
        totalUsers,
        totalVerifiers
      };
    }

    // Recent activity count
    const recentActivityCount = await Activity.countDocuments({
      user: userId,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    res.json({
      success: true,
      stats: {
        user: {
          submissions: userSubmissions,
          approved: userApproved,
          pending: userPending,
          points: req.user.points,
          badges: req.user.badges.length,
          recentActivity: recentActivityCount
        },
        global: globalStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};

// Get submission trends
export const getSubmissionTrends = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let startDate;
    switch (period) {
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    const trends = await Submission.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            status: '$status'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ]);

    res.json({
      success: true,
      trends
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching trends',
      error: error.message
    });
  }
};

// Get category distribution
export const getCategoryDistribution = async (req, res) => {
  try {
    const distribution = await Submission.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      distribution
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching distribution',
      error: error.message
    });
  }
};

// Get country statistics
export const getCountryStats = async (req, res) => {
  try {
    const countryStats = await Submission.aggregate([
      {
        $group: {
          _id: '$country',
          total: { $sum: 1 },
          approved: {
            $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
          },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          rejected: {
            $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
          }
        }
      },
      {
        $sort: { total: -1 }
      },
      {
        $limit: 20
      }
    ]);

    res.json({
      success: true,
      countryStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching country statistics',
      error: error.message
    });
  }
};

// Get user performance metrics
export const getUserPerformance = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;

    const [submissions, verifications, activities] = await Promise.all([
      Submission.countDocuments({ submitter: userId }),
      Submission.countDocuments({ verifier: userId }),
      Activity.countDocuments({ user: userId })
    ]);

    const approvalRate = await Submission.aggregate([
      {
        $match: { submitter: userId }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          approved: {
            $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
          }
        }
      }
    ]);

    const rate = approvalRate.length > 0 
      ? (approvalRate[0].approved / approvalRate[0].total * 100).toFixed(2)
      : 0;

    res.json({
      success: true,
      performance: {
        submissions,
        verifications,
        activities,
        approvalRate: parseFloat(rate)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching performance metrics',
      error: error.message
    });
  }
};
