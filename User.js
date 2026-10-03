import mongoose from 'mongoose';

const skillItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: [
      'Programming',
      'Web Development',
      'Mobile Development',
      'UI/UX Design',
      'Graphic Design',
      'Languages',
      'Music',
      'Photography',
      'Video Editing',
      'Business',
      'Academic',
      'Communication',
      'Other',
    ],
    default: 'Other',
  },
  proficiency: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Intermediate',
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
}, { _id: true });

const skillLearnSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: [
      'Programming',
      'Web Development',
      'Mobile Development',
      'UI/UX Design',
      'Graphic Design',
      'Languages',
      'Music',
      'Photography',
      'Video Editing',
      'Business',
      'Academic',
      'Communication',
      'Other',
    ],
    default: 'Other',
  },
  proficiency: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
}, { _id: true });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  college: {
    type: String,
    default: '',
    trim: true,
  },
  course: {
    type: String,
    default: '',
    trim: true,
  },
  year: {
    type: String,
    default: '',
    trim: true,
  },
  bio: {
    type: String,
    default: '',
    trim: true,
  },
  avatar: {
    type: String,
    default: '',
  },
  linkedin: {
    type: String,
    default: '',
    trim: true,
  },
  skillsToTeach: [skillItemSchema],
  skillsToLearn: [skillLearnSchema],
}, {
  timestamps: true,
});

// Remove password from JSON responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', userSchema);
export default User;
