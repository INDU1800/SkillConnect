import User from '../models/User.js';

// Normalize skill name for clean comparison
const normalize = (str) => (str || '').toLowerCase().trim();

// Check if skill names match (either equal or one contains the other)
const isMatch = (name1, name2) => {
  const n1 = normalize(name1);
  const n2 = normalize(name2);
  if (!n1 || !n2) return false;
  return n1 === n2 || n1.includes(n2) || n2.includes(n1);
};

// @desc    Calculate skill matches for authenticated user
// @route   GET /api/matches
// @access  Private
export const getMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const mySkillsToTeach = currentUser.skillsToTeach || [];
    const mySkillsToLearn = currentUser.skillsToLearn || [];

    // If current user has neither skills to teach nor learn, return empty with advice
    if (mySkillsToTeach.length === 0 && mySkillsToLearn.length === 0) {
      return res.json({
        mutualMatches: [],
        otherMatches: [],
        total: 0,
        tip: 'Add skills you can teach and skills you want to learn to get personalized matches!',
      });
    }

    // Fetch all other users
    const otherUsers = await User.find({ _id: { $ne: currentUser._id } }).select('-password');

    const matches = [];

    for (const other of otherUsers) {
      const otherTeaches = other.skillsToTeach || [];
      const otherWants = other.skillsToLearn || [];

      // 1. What they teach that I want to learn
      const skillsTheyCanTeachMe = [];
      for (const myLearn of mySkillsToLearn) {
        for (const theirTeach of otherTeaches) {
          if (isMatch(myLearn.name, theirTeach.name)) {
            skillsTheyCanTeachMe.push({
              skill: theirTeach.name,
              category: theirTeach.category,
              proficiency: theirTeach.proficiency,
            });
          }
        }
      }

      // 2. What I teach that they want to learn
      const skillsICanTeachThem = [];
      for (const myTeach of mySkillsToTeach) {
        for (const theirLearn of otherWants) {
          if (isMatch(myTeach.name, theirLearn.name)) {
            skillsICanTeachThem.push({
              skill: myTeach.name,
              category: myTeach.category,
              proficiency: myTeach.proficiency,
            });
          }
        }
      }

      // Deduplicate arrays
      const uniqueTheyTeachMe = [...new Map(skillsTheyCanTeachMe.map(item => [item.skill.toLowerCase(), item])).values()];
      const uniqueICanTeachThem = [...new Map(skillsICanTeachThem.map(item => [item.skill.toLowerCase(), item])).values()];

      const isMutual = uniqueTheyTeachMe.length > 0 && uniqueICanTeachThem.length > 0;
      const isOneWayLearn = uniqueTheyTeachMe.length > 0 && uniqueICanTeachThem.length === 0;
      const isOneWayTeach = uniqueTheyTeachMe.length === 0 && uniqueICanTeachThem.length > 0;

      if (isMutual || isOneWayLearn || isOneWayTeach) {
        let matchType = 'MUTUAL';
        let matchScore = 95; // Strong mutual match
        let matchBadge = 'Mutual Match';
        let description = `Reciprocal match! You can teach ${uniqueICanTeachThem.map(s => s.skill).join(', ')} and learn ${uniqueTheyTeachMe.map(s => s.skill).join(', ')}.`;

        if (isOneWayLearn) {
          matchType = 'THEY_TEACH';
          matchScore = 70;
          matchBadge = 'Can Teach You';
          description = `They can teach you ${uniqueTheyTeachMe.map(s => s.skill).join(', ')}.`;
        } else if (isOneWayTeach) {
          matchType = 'YOU_TEACH';
          matchScore = 50;
          matchBadge = 'Wants Your Skill';
          description = `They want to learn ${uniqueICanTeachThem.map(s => s.skill).join(', ')} from you.`;
        }

        matches.push({
          user: {
            _id: other._id,
            name: other.name,
            college: other.college,
            course: other.course,
            year: other.year,
            bio: other.bio,
            avatar: other.avatar,
            skillsToTeach: other.skillsToTeach,
            skillsToLearn: other.skillsToLearn,
          },
          matchType,
          matchScore,
          matchBadge,
          description,
          skillsTheyCanTeachMe: uniqueTheyTeachMe,
          skillsICanTeachThem: uniqueICanTeachThem,
        });
      }
    }

    // Sort matches: Highest score first, then alphabetically
    matches.sort((a, b) => b.matchScore - a.matchScore);

    const mutualMatches = matches.filter(m => m.matchType === 'MUTUAL');
    const otherMatches = matches.filter(m => m.matchType !== 'MUTUAL');

    return res.json({
      matches,
      mutualMatches,
      otherMatches,
      total: matches.length,
    });
  } catch (error) {
    console.error('getMatches error:', error);
    return res.status(500).json({ message: 'Error calculating skill matches', error: error.message });
  }
};
