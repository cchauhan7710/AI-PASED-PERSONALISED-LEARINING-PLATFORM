const mongoose = require('mongoose');
const Topic = require('../models/Topic');
const { topicsData } = require('../utils/seedData');

// Helper to escape regex special characters
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// @desc    Get topic details by name or ID
// @route   GET /api/topics/:identifier
// @access  Private
const getTopicByIdentifier = async (req, res) => {
  try {
    const { identifier } = req.params;
    const isConnected = mongoose.connection.readyState === 1;

    let topic = null;

    if (isConnected) {
      try {
        const isObjectId = identifier.match(/^[0-9a-fA-F]{24}$/);
        topic = await Topic.findOne({
          $or: [
            { name: { $regex: new RegExp(`^${escapeRegex(identifier)}$`, 'i') } },
            ...(isObjectId ? [{ _id: identifier }] : [])
          ]
        });
      } catch (dbErr) {
        console.warn('Topic DB query error, using fallback:', dbErr.message);
      }
    }

    if (!topic) {
      const cleanId = (identifier || '').toLowerCase().trim();
      const fallback = topicsData.find(
        (t) => t.name.toLowerCase() === cleanId || (t.skillName && t.skillName.toLowerCase() === cleanId)
      ) || topicsData.find(
        (t) => t.name.toLowerCase().includes(cleanId) || cleanId.includes(t.name.toLowerCase())
      ) || topicsData[0];

      topic = fallback;
    }

    res.json({ success: true, data: topic });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all topics catalog
// @route   GET /api/topics
// @access  Private
const getAllTopics = async (req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    let topics = null;

    if (isConnected) {
      try {
        topics = await Topic.find({});
      } catch (dbErr) {
        console.warn('Topics DB fetch error, using fallback:', dbErr.message);
      }
    }

    if (!topics || topics.length === 0) {
      topics = topicsData;
    }

    res.json({ success: true, count: topics.length, data: topics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTopicByIdentifier,
  getAllTopics
};
