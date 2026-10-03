import User from '../models/User.js';

// @desc    Get all users (with optional query filters)
// @route   GET /api/users
// @access  Public
export const getUsers = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'skillsToTeach.name': { $regex: search, $options: 'i' } },
        { 'skillsToLearn.name': { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      query.$or = [
        { 'skillsToTeach.category': category },
        { 'skillsToLearn.category': category },
      ];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    return res.json(users);
  } catch (error) {
    console.error('getUsers error:', error);
    return res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Public
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Student profile not found' });
    }
    return res.json(user);
  } catch (error) {
    console.error('getUserById error:', error);
    return res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

// @desc    Update student profile
// @route   PUT /api/users/:id
// @access  Private (Owner only)
export const updateUserProfile = async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'You can only update your own profile' });
    }

    const { name, college, course, year, bio, avatar, linkedin } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name.trim();
    if (college !== undefined) user.college = college.trim();
    if (course !== undefined) user.course = course.trim();
    if (year !== undefined) user.year = year.trim();
    if (bio !== undefined) user.bio = bio.trim();
    if (avatar !== undefined) user.avatar = avatar;
    if (linkedin !== undefined) user.linkedin = linkedin.trim();

    const updatedUser = await user.save();
    return res.json(updatedUser);
  } catch (error) {
    console.error('updateUserProfile error:', error);
    return res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// @desc    Add a skill to teach
// @route   POST /api/users/skills/teach
// @access  Private
export const addSkillToTeach = async (req, res) => {
  try {
    const { name, category, proficiency, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Skill name is required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if skill already exists in skillsToTeach
    const exists = user.skillsToTeach.some(
      (s) => s.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (exists) {
      return res.status(400).json({ message: 'You have already added this skill to teach' });
    }

    user.skillsToTeach.push({
      name: name.trim(),
      category: category || 'Other',
      proficiency: proficiency || 'Intermediate',
      description: description ? description.trim() : '',
    });

    await user.save();
    return res.status(201).json({
      message: 'Skill added to teaching list',
      skillsToTeach: user.skillsToTeach,
    });
  } catch (error) {
    console.error('addSkillToTeach error:', error);
    return res.status(500).json({ message: 'Error adding skill', error: error.message });
  }
};

// @desc    Delete a skill from teach list
// @route   DELETE /api/users/skills/teach/:skillId
// @access  Private
export const removeSkillToTeach = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.skillsToTeach = user.skillsToTeach.filter(
      (s) => s._id.toString() !== req.params.skillId
    );

    await user.save();
    return res.json({
      message: 'Skill removed successfully',
      skillsToTeach: user.skillsToTeach,
    });
  } catch (error) {
    console.error('removeSkillToTeach error:', error);
    return res.status(500).json({ message: 'Error removing skill', error: error.message });
  }
};

// @desc    Add a skill to learn
// @route   POST /api/users/skills/learn
// @access  Private
export const addSkillToLearn = async (req, res) => {
  try {
    const { name, category, proficiency, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Skill name is required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const exists = user.skillsToLearn.some(
      (s) => s.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (exists) {
      return res.status(400).json({ message: 'You have already added this skill to your learning list' });
    }

    user.skillsToLearn.push({
      name: name.trim(),
      category: category || 'Other',
      proficiency: proficiency || 'Beginner',
      description: description ? description.trim() : '',
    });

    await user.save();
    return res.status(201).json({
      message: 'Skill added to learning list',
      skillsToLearn: user.skillsToLearn,
    });
  } catch (error) {
    console.error('addSkillToLearn error:', error);
    return res.status(500).json({ message: 'Error adding skill to learn', error: error.message });
  }
};

// @desc    Delete a skill from learn list
// @route   DELETE /api/users/skills/learn/:skillId
// @access  Private
export const removeSkillToLearn = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.skillsToLearn = user.skillsToLearn.filter(
      (s) => s._id.toString() !== req.params.skillId
    );

    await user.save();
    return res.json({
      message: 'Skill removed successfully',
      skillsToLearn: user.skillsToLearn,
    });
  } catch (error) {
    console.error('removeSkillToLearn error:', error);
    return res.status(500).json({ message: 'Error removing skill to learn', error: error.message });
  }
};

// @desc    Discover skills offered by students
// @route   GET /api/skills
// @access  Public
export const discoverSkills = async (req, res) => {
  try {
    const { search, category, proficiency } = req.query;

    const users = await User.find({
      'skillsToTeach.0': { $exists: true },
    }).select('name email college course year avatar skillsToTeach');

    let skillList = [];

    users.forEach((user) => {
      user.skillsToTeach.forEach((skill) => {
        skillList.push({
          _id: skill._id,
          name: skill.name,
          category: skill.category,
          proficiency: skill.proficiency,
          description: skill.description,
          student: {
            _id: user._id,
            name: user.name,
            college: user.college,
            course: user.course,
            year: user.year,
            avatar: user.avatar,
          },
        });
      });
    });

    // Apply search filter
    if (search && search.trim() !== '') {
      const s = search.trim().toLowerCase();
      skillList = skillList.filter(
        (item) =>
          item.name.toLowerCase().includes(s) ||
          item.student.name.toLowerCase().includes(s) ||
          item.category.toLowerCase().includes(s)
      );
    }

    // Apply category filter
    if (category && category !== 'All') {
      skillList = skillList.filter(
        (item) => item.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Apply proficiency filter
    if (proficiency && proficiency !== 'All') {
      skillList = skillList.filter(
        (item) => item.proficiency.toLowerCase() === proficiency.toLowerCase()
      );
    }

    return res.json(skillList);
  } catch (error) {
    console.error('discoverSkills error:', error);
    return res.status(500).json({ message: 'Error discovering skills', error: error.message });
  }
};
