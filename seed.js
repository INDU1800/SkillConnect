import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import ExchangeRequest from './models/ExchangeRequest.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillconnect';

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB for seeding...');
    await mongoose.connect(MONGO_URI, {
      tlsAllowInvalidCertificates: true,
    });
    console.log('MongoDB connected successfully.');

    // Clear existing users and requests
    await User.deleteMany({});
    await ExchangeRequest.deleteMany({});
    console.log('Cleared existing database records.');

    // Common password hash for test accounts
    const salt = await bcrypt.genSalt(10);
    const demoPasswordHash = await bcrypt.hash('Demo@123', salt);
    const commonPasswordHash = await bcrypt.hash('Password@123', salt);

    const students = [
      // Demo User
      {
        name: 'Demo Student',
        email: 'demo@skillconnect.com',
        password: demoPasswordHash,
        college: 'City Engineering College',
        course: 'Computer Science',
        year: '3rd Year',
        bio: 'Passionate full-stack enthusiast looking to swap web dev skills for mobile dev and design!',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        linkedin: 'https://linkedin.com/in/demostudent',
        skillsToTeach: [
          {
            name: 'JavaScript',
            category: 'Web Development',
            proficiency: 'Advanced',
            description: 'ES6+, Async/Await, DOM manipulation, and modern frontend patterns.',
          },
          {
            name: 'React.js',
            category: 'Web Development',
            proficiency: 'Intermediate',
            description: 'Hooks, state management, components, and Tailwind styling.',
          },
        ],
        skillsToLearn: [
          {
            name: 'Photoshop',
            category: 'Graphic Design',
            proficiency: 'Beginner',
            description: 'Want to learn banner design and photo retouching for web projects.',
          },
          {
            name: 'UI/UX Design',
            category: 'UI/UX Design',
            proficiency: 'Beginner',
            description: 'Figma wireframing, color theory, and prototyping.',
          },
        ],
      },
      // Student 1: Aarav (Mutual match with Priya for JS <-> Photoshop)
      {
        name: 'Aarav Sharma',
        email: 'aarav@skillconnect.com',
        password: commonPasswordHash,
        college: 'National Institute of Technology',
        course: 'Information Technology',
        year: '3rd Year',
        bio: 'Frontend developer and competitive programmer. Love building interactive web apps.',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
        linkedin: 'https://linkedin.com/in/aaravsharma',
        skillsToTeach: [
          {
            name: 'JavaScript',
            category: 'Web Development',
            proficiency: 'Advanced',
            description: 'Core concepts, closures, asynchronous JS, and browser APIs.',
          },
          {
            name: 'Node.js',
            category: 'Web Development',
            proficiency: 'Intermediate',
            description: 'Building RESTful APIs with Express and MongoDB.',
          },
        ],
        skillsToLearn: [
          {
            name: 'Photoshop',
            category: 'Graphic Design',
            proficiency: 'Beginner',
            description: 'Interested in digital art creation and asset editing.',
          },
        ],
      },
      // Student 2: Priya (Mutual match with Aarav & Demo for Photoshop <-> JS)
      {
        name: 'Priya Patel',
        email: 'priya@skillconnect.com',
        password: commonPasswordHash,
        college: 'Apex College of Arts & Design',
        course: 'Visual Communication',
        year: '2nd Year',
        bio: 'Graphic artist and illustrator. Eager to understand web coding so I can build my portfolio.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        linkedin: 'https://linkedin.com/in/priyapatel',
        skillsToTeach: [
          {
            name: 'Photoshop',
            category: 'Graphic Design',
            proficiency: 'Expert',
            description: 'Photo manipulation, digital painting, poster and thumbnail design.',
          },
          {
            name: 'Illustrator',
            category: 'Graphic Design',
            proficiency: 'Advanced',
            description: 'Vector icons, branding, logos, and vector illustrations.',
          },
        ],
        skillsToLearn: [
          {
            name: 'JavaScript',
            category: 'Web Development',
            proficiency: 'Beginner',
            description: 'Want to make interactive web portfolios and animations.',
          },
        ],
      },
      // Student 3: Rahul (Mutual match with Ananya for Python <-> UI/UX)
      {
        name: 'Rahul Verma',
        email: 'rahul@skillconnect.com',
        password: commonPasswordHash,
        college: 'State Technical University',
        course: 'Data Science & AI',
        year: '3rd Year',
        bio: 'Python data science geek. Can teach data handling, scripting, and backend development.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        skillsToTeach: [
          {
            name: 'Python',
            category: 'Programming',
            proficiency: 'Advanced',
            description: 'Python fundamentals, OOP, Pandas, and automation scripts.',
          },
        ],
        skillsToLearn: [
          {
            name: 'UI/UX Design',
            category: 'UI/UX Design',
            proficiency: 'Beginner',
            description: 'Figma and mobile app interface design principles.',
          },
        ],
      },
      // Student 4: Ananya (Mutual match with Rahul for UI/UX <-> Python)
      {
        name: 'Ananya Iyer',
        email: 'ananya@skillconnect.com',
        password: commonPasswordHash,
        college: 'Metropolitan Institute of Technology',
        course: 'Human-Computer Interaction',
        year: '4th Year',
        bio: 'Product design student passionate about clean interfaces and design systems.',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
        skillsToTeach: [
          {
            name: 'UI/UX Design',
            category: 'UI/UX Design',
            proficiency: 'Advanced',
            description: 'Figma prototypes, design tokens, typography, and wireframes.',
          },
        ],
        skillsToLearn: [
          {
            name: 'Python',
            category: 'Programming',
            proficiency: 'Beginner',
            description: 'Basic scripting to automate data exports and user research analytics.',
          },
        ],
      },
      // Student 5: Rohan (Mobile dev <-> Video editing)
      {
        name: 'Rohan Mehta',
        email: 'rohan@skillconnect.com',
        password: commonPasswordHash,
        college: 'City Engineering College',
        course: 'Computer Science',
        year: '3rd Year',
        bio: 'Flutter and Android developer. Want to learn video editing for college tech fest reels.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        skillsToTeach: [
          {
            name: 'Flutter',
            category: 'Mobile Development',
            proficiency: 'Advanced',
            description: 'Cross-platform mobile apps for iOS and Android with clean state management.',
          },
        ],
        skillsToLearn: [
          {
            name: 'Video Editing',
            category: 'Video Editing',
            proficiency: 'Beginner',
            description: 'Premiere Pro basics, transitions, and audio sync for short-form content.',
          },
        ],
      },
      // Student 6: Sneha (Video editing <-> Flutter)
      {
        name: 'Sneha Kulkarni',
        email: 'sneha@skillconnect.com',
        password: commonPasswordHash,
        college: 'Film & Media Institute',
        course: 'Digital Media Production',
        year: '2nd Year',
        bio: 'Content creator & video editor. Interested in app development to create an editing portfolio app.',
        avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150',
        skillsToTeach: [
          {
            name: 'Video Editing',
            category: 'Video Editing',
            proficiency: 'Advanced',
            description: 'Premiere Pro, DaVinci Resolve color grading, and audio enhancement.',
          },
        ],
        skillsToLearn: [
          {
            name: 'Flutter',
            category: 'Mobile Development',
            proficiency: 'Beginner',
            description: 'Building simple mobile apps to show portfolio videos.',
          },
        ],
      },
      // Student 7: Vikram (Languages & Guitar)
      {
        name: 'Vikram Singh',
        email: 'vikram@skillconnect.com',
        password: commonPasswordHash,
        college: 'Global University',
        course: 'International Business',
        year: '3rd Year',
        bio: 'Polyglot and guitarist. Happy to teach Spanish or acoustic guitar in exchange for web dev!',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
        skillsToTeach: [
          {
            name: 'Spanish',
            category: 'Languages',
            proficiency: 'Advanced',
            description: 'Conversational Spanish, basic grammar, and pronunciation.',
          },
          {
            name: 'Acoustic Guitar',
            category: 'Music',
            proficiency: 'Intermediate',
            description: 'Chords, strumming patterns, and basic fingerstyle.',
          },
        ],
        skillsToLearn: [
          {
            name: 'Web Development',
            category: 'Web Development',
            proficiency: 'Beginner',
            description: 'HTML, CSS, and basic site hosting.',
          },
        ],
      },
      // Student 8: Meera (Photography <-> Business)
      {
        name: 'Meera Nair',
        email: 'meera@skillconnect.com',
        password: commonPasswordHash,
        college: 'Modern School of Photography',
        course: 'Visual Arts',
        year: '1st Year',
        bio: 'Portrait and event photographer. Would love guidance on business pitch decks and startup basics.',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
        skillsToTeach: [
          {
            name: 'Photography',
            category: 'Photography',
            proficiency: 'Expert',
            description: 'Camera manual settings, framing, natural lighting, and Lightroom presets.',
          },
        ],
        skillsToLearn: [
          {
            name: 'Business',
            category: 'Business',
            proficiency: 'Beginner',
            description: 'Basic business plans, marketing, and client pricing.',
          },
        ],
      },
    ];

    const createdUsers = await User.insertMany(students);
    console.log(`Successfully seeded ${createdUsers.length} students.`);

    // Create a couple sample exchange requests between students
    const demoUser = createdUsers.find(u => u.email === 'demo@skillconnect.com');
    const priyaUser = createdUsers.find(u => u.email === 'priya@skillconnect.com');
    const aaravUser = createdUsers.find(u => u.email === 'aarav@skillconnect.com');

    if (demoUser && priyaUser && aaravUser) {
      await ExchangeRequest.create([
        {
          sender: priyaUser._id,
          receiver: demoUser._id,
          skillOffered: 'Photoshop',
          skillRequested: 'JavaScript',
          status: 'pending',
          message: 'Hi! I saw you know JavaScript. I can help you with Photoshop editing in exchange for some JS basics!',
        },
        {
          sender: demoUser._id,
          receiver: aaravUser._id,
          skillOffered: 'React.js',
          skillRequested: 'Photoshop',
          status: 'accepted',
          message: 'Hey Aarav! Excited to collaborate on our upcoming project.',
        },
      ]);
      console.log('Successfully seeded sample exchange requests.');
    }

    console.log('\nSeed summary:');
    console.log('Demo Login Email:    demo@skillconnect.com');
    console.log('Demo Login Password: Demo@123');
    console.log('Other Users Password: Password@123\n');

    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seedData();
