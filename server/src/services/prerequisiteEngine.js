const Topic = require('../models/Topic');
const { topicsData } = require('../utils/seedData');

/**
 * Ensures learning path topics respect prerequisite dependency graph
 */
const enforcePrerequisites = async (candidateTopics) => {
  let allTopics = [];
  try {
    allTopics = await Topic.find({});
  } catch (err) {
    allTopics = [];
  }
  if (!allTopics || allTopics.length === 0) {
    allTopics = topicsData;
  }

  const topicMap = new Map();
  allTopics.forEach((t) => topicMap.set(t.name.toLowerCase(), t));

  const orderedList = [];
  const added = new Set();

  // Helper to add topic and all its prerequisites recursively
  const addTopicWithPrereqs = (topicName) => {
    const key = topicName.toLowerCase();
    const tDoc = topicMap.get(key);
    if (!tDoc) return;

    if (tDoc.prerequisites && tDoc.prerequisites.length > 0) {
      tDoc.prerequisites.forEach((pName) => {
        if (!added.has(pName.toLowerCase())) {
          addTopicWithPrereqs(pName);
        }
      });
    }

    if (!added.has(key)) {
      added.add(key);
      orderedList.push(tDoc);
    }
  };

  candidateTopics.forEach((tName) => {
    addTopicWithPrereqs(tName);
  });

  return orderedList;
};

module.exports = {
  enforcePrerequisites
};
