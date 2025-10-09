const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
const MONGODB_URI = 'mongodb+srv://dallaherick0_db_user:pXGtcukipK83r6F5@cluster0.rsxrzym.mongodb.net/portfolio?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// File Upload Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Database Models
const HeroSchema = new mongoose.Schema({
  name: String,
  title: String,
  description: String,
  profileImage: String,
  resume: String,
  updatedAt: { type: Date, default: Date.now }
});

const ServiceSchema = new mongoose.Schema({
  title: String,
  description: String,
  icon: String,
  updatedAt: { type: Date, default: Date.now }
});

const ProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  images: [String],
  category: String,
  link: String,
  updatedAt: { type: Date, default: Date.now }
});

const EducationSchema = new mongoose.Schema({
  period: String,
  degree: String,
  institution: String,
  updatedAt: { type: Date, default: Date.now }
});

const ExperienceSchema = new mongoose.Schema({
  period: String,
  position: String,
  company: String,
  location: String,
  updatedAt: { type: Date, default: Date.now }
});

const SkillSchema = new mongoose.Schema({
  name: String,
  percentage: Number,
  updatedAt: { type: Date, default: Date.now }
});

const TestimonialSchema = new mongoose.Schema({
  name: String,
  position: String,
  company: String,
  content: String,
  avatar: String,
  updatedAt: { type: Date, default: Date.now }
});

const ContactSchema = new mongoose.Schema({
  phone: String,
  email: String,
  location: String,
  socialLinks: {
    linkedin: String,
    github: String,
    twitter: String
  },
  updatedAt: { type: Date, default: Date.now }
});

const ThemeSchema = new mongoose.Schema({
  primaryColor: { type: String, default: '#121223' },
  secondaryColor: { type: String, default: '#1e1e32' },
  accentColor: { type: String, default: '#ffaa00' },
  fontFamily: { type: String, default: 'Inter, sans-serif' },
  updatedAt: { type: Date, default: Date.now }
});

const SiteInfoSchema = new mongoose.Schema({
  logo: String,
  siteTitle: { type: String, default: 'LOGO' },
  footerText: { type: String, default: '&copy; 2024 Steven. All rights reserved. | Developed with passion.' },
  updatedAt: { type: Date, default: Date.now }
});

// Create Models
const Hero = mongoose.model('Hero', HeroSchema);
const Service = mongoose.model('Service', ServiceSchema);
const Project = mongoose.model('Project', ProjectSchema);
const Education = mongoose.model('Education', EducationSchema);
const Experience = mongoose.model('Experience', ExperienceSchema);
const Skill = mongoose.model('Skill', SkillSchema);
const Testimonial = mongoose.model('Testimonial', TestimonialSchema);
const Contact = mongoose.model('Contact', ContactSchema);
const Theme = mongoose.model('Theme', ThemeSchema);
const SiteInfo = mongoose.model('SiteInfo', SiteInfoSchema);

// Initialize sample data
async function initializeSampleData() {
  try {
    // Check if sample data already exists
    const serviceCount = await Service.countDocuments();
    const projectCount = await Project.countDocuments();
    const educationCount = await Education.countDocuments();
    const experienceCount = await Experience.countDocuments();
    const skillCount = await Skill.countDocuments();
    const testimonialCount = await Testimonial.countDocuments();

    if (serviceCount === 0) {
      // Add sample services
      const sampleServices = [
        {
          title: 'Web Development',
          description: 'Crafting fast, responsive, and robust websites and applications from scratch.',
          icon: 'fas fa-desktop'
        },
        {
          title: 'Graphic Design',
          description: 'Creating stunning visual identities, branding, and marketing materials that capture attention.',
          icon: 'fas fa-pencil-ruler'
        },
        {
          title: 'UI/UX Design',
          description: 'Focusing on user experience (UX) and modern, intuitive interfaces (UI) for digital products.',
          icon: 'fas fa-file-code'
        }
      ];
      await Service.insertMany(sampleServices);
      console.log('✅ Sample services added successfully');
    }

    if (projectCount === 0) {
      // Add sample projects
      const sampleProjects = [
        {
          title: 'Interactive Fintech App',
          description: 'A modern finance tracking application built with React and Node.js.',
          images: [],
          category: 'Web Development',
          link: '#'
        },
        {
          title: 'E-commerce Platform Redesign',
          description: 'Complete UX/UI redesign for a high-traffic online store.',
          images: [],
          category: 'UI/UX Design',
          link: '#'
        }
      ];
      await Project.insertMany(sampleProjects);
      console.log('✅ Sample projects added successfully');
    }

    if (educationCount === 0) {
      // Add sample education
      const sampleEducation = [
        {
          period: '2018 - 2022',
          degree: 'Master of Science in Computer Science',
          institution: 'Massachusetts Institute of Technology (MIT)'
        },
        {
          period: '2014 - 2018',
          degree: 'Bachelor of Arts in Design',
          institution: 'Rhode Island School of Design (RISD)'
        }
      ];
      await Education.insertMany(sampleEducation);
      console.log('✅ Sample education added successfully');
    }

    if (experienceCount === 0) {
      // Add sample experience
      const sampleExperience = [
        {
          period: '2023 - Present',
          position: 'SENIOR WEB DEVELOPER',
          company: 'Tech Innovators Inc.',
          location: 'Remote'
        },
        {
          period: '2020 - 2023',
          position: 'CREATIVE LEAD & DESIGNER',
          company: 'Digital Agency X',
          location: 'New York, NY'
        }
      ];
      await Experience.insertMany(sampleExperience);
      console.log('✅ Sample experience added successfully');
    }

    if (skillCount === 0) {
      // Add sample skills
      const sampleSkills = [
        { name: 'Web Development', percentage: 95 },
        { name: 'Graphic Design', percentage: 88 },
        { name: 'UI/UX Design', percentage: 91 },
        { name: 'Team Leadership', percentage: 85 }
      ];
      await Skill.insertMany(sampleSkills);
      console.log('✅ Sample skills added successfully');
    }

    if (testimonialCount === 0) {
      // Add sample testimonials
      const sampleTestimonials = [
        {
          name: 'Jane Doe',
          position: 'CEO',
          company: 'Alpha Corp',
          content: 'Steven delivered a complex project ahead of schedule. The quality and attention to detail were exceptional!',
          avatar: ''
        },
        {
          name: 'Mark Smith',
          position: 'Founder',
          company: 'Beta Solutions',
          content: 'His design skills transformed our brand image. Highly collaborative and highly recommended.',
          avatar: ''
        }
      ];
      await Testimonial.insertMany(sampleTestimonials);
      console.log('✅ Sample testimonials added successfully');
    }

    // Initialize single document collections if they don't exist
    const heroCount = await Hero.countDocuments();
    if (heroCount === 0) {
      await Hero.create({
        name: 'Steven',
        title: 'Web Developer & Designer',
        description: 'A passionate web developer and graphic designer creating modern, interactive, and beautiful digital experiences. Let\'s build something amazing together!'
      });
      console.log('✅ Sample hero section added successfully');
    }

    const contactCount = await Contact.countDocuments();
    if (contactCount === 0) {
      await Contact.create({
        phone: '+1 (555) 123-4567',
        email: 'steven@example.com',
        location: 'San Francisco, CA',
        socialLinks: {
          linkedin: '#',
          github: '#',
          twitter: '#'
        }
      });
      console.log('✅ Sample contact info added successfully');
    }

    const themeCount = await Theme.countDocuments();
    if (themeCount === 0) {
      await Theme.create({});
      console.log('✅ Default theme settings added successfully');
    }

    const siteInfoCount = await SiteInfo.countDocuments();
    if (siteInfoCount === 0) {
      await SiteInfo.create({});
      console.log('✅ Default site info added successfully');
    }

  } catch (error) {
    console.error('❌ Error initializing sample data:', error);
  }
}

// API Routes

// Get all data for frontend
app.get('/api/portfolio', async (req, res) => {
  try {
    const [
      hero, services, projects, education, 
      experience, skills, testimonials, 
      contact, theme, siteInfo
    ] = await Promise.all([
      Hero.findOne(),
      Service.find().sort({ updatedAt: -1 }),
      Project.find().sort({ updatedAt: -1 }),
      Education.find().sort({ updatedAt: -1 }),
      Experience.find().sort({ updatedAt: -1 }),
      Skill.find().sort({ updatedAt: -1 }),
      Testimonial.find().sort({ updatedAt: -1 }),
      Contact.findOne(),
      Theme.findOne(),
      SiteInfo.findOne()
    ]);
    
    res.json({
      success: true,
      hero: hero || {},
      services: services || [],
      projects: projects || [],
      education: education || [],
      experience: experience || [],
      skills: skills || [],
      testimonials: testimonials || [],
      contact: contact || {},
      theme: theme || {},
      siteInfo: siteInfo || {}
    });
  } catch (error) {
    console.error('❌ Error fetching portfolio data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching portfolio data',
      error: error.message 
    });
  }
});

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }
    
    console.log(`✅ File uploaded successfully: ${req.file.filename}`);
    res.json({ 
      success: true,
      message: 'File uploaded successfully', 
      filePath: `/uploads/${req.file.filename}` 
    });
  } catch (error) {
    console.error('❌ File upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'File upload failed',
      error: error.message 
    });
  }
});

// Hero routes
app.get('/api/hero', async (req, res) => {
  try {
    const hero = await Hero.findOne();
    res.json({ success: true, data: hero });
  } catch (error) {
    console.error('❌ Error fetching hero:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching hero data',
      error: error.message 
    });
  }
});

app.post('/api/hero', upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
]), async (req, res) => {
  try {
    let updateData = { ...req.body };
    
    if (req.files && req.files.profileImage) {
      updateData.profileImage = `/uploads/${req.files.profileImage[0].filename}`;
      console.log(`✅ Profile image updated: ${updateData.profileImage}`);
    }
    
    if (req.files && req.files.resume) {
      updateData.resume = `/uploads/${req.files.resume[0].filename}`;
      console.log(`✅ Resume updated: ${updateData.resume}`);
    }
    
    updateData.updatedAt = new Date();
    
    const hero = await Hero.findOneAndUpdate({}, updateData, { 
      upsert: true, 
      new: true 
    });
    
    console.log('✅ Hero section updated successfully');
    res.json({ success: true, message: 'Hero section updated successfully', data: hero });
  } catch (error) {
    console.error('❌ Error updating hero:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating hero section',
      error: error.message 
    });
  }
});

// Generic CRUD routes for collections
const createCrudRoutes = (model, collectionName) => {
  // Get all
  app.get(`/api/${collectionName}`, async (req, res) => {
    try {
      const items = await model.find().sort({ updatedAt: -1 });
      res.json({ success: true, data: items });
    } catch (error) {
      console.error(`❌ Error fetching ${collectionName}:`, error);
      res.status(500).json({ 
        success: false, 
        message: `Error fetching ${collectionName}`,
        error: error.message 
      });
    }
  });
  
  // Create
  app.post(`/api/${collectionName}`, async (req, res) => {
    try {
      const newItem = new model(req.body);
      const savedItem = await newItem.save();
      console.log(`✅ ${collectionName.slice(0, -1)} added successfully: ${savedItem.title || savedItem.name || savedItem._id}`);
      res.json({ 
        success: true, 
        message: `${collectionName.slice(0, -1)} added successfully`,
        data: savedItem 
      });
    } catch (error) {
      console.error(`❌ Error creating ${collectionName.slice(0, -1)}:`, error);
      res.status(500).json({ 
        success: false, 
        message: `Error creating ${collectionName.slice(0, -1)}`,
        error: error.message 
      });
    }
  });
  
  // Update
  app.put(`/api/${collectionName}/:id`, async (req, res) => {
    try {
      req.body.updatedAt = new Date();
      const updatedItem = await model.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true }
      );
      
      if (!updatedItem) {
        return res.status(404).json({ 
          success: false, 
          message: `${collectionName.slice(0, -1)} not found` 
        });
      }
      
      console.log(`✅ ${collectionName.slice(0, -1)} updated successfully: ${updatedItem.title || updatedItem.name || updatedItem._id}`);
      res.json({ 
        success: true, 
        message: `${collectionName.slice(0, -1)} updated successfully`,
        data: updatedItem 
      });
    } catch (error) {
      console.error(`❌ Error updating ${collectionName.slice(0, -1)}:`, error);
      res.status(500).json({ 
        success: false, 
        message: `Error updating ${collectionName.slice(0, -1)}`,
        error: error.message 
      });
    }
  });
  
  // Delete
  app.delete(`/api/${collectionName}/:id`, async (req, res) => {
    try {
      const deletedItem = await model.findByIdAndDelete(req.params.id);
      
      if (!deletedItem) {
        return res.status(404).json({ 
          success: false, 
          message: `${collectionName.slice(0, -1)} not found` 
        });
      }
      
      console.log(`✅ ${collectionName.slice(0, -1)} deleted successfully: ${deletedItem.title || deletedItem.name || deletedItem._id}`);
      res.json({ 
        success: true, 
        message: `${collectionName.slice(0, -1)} deleted successfully` 
      });
    } catch (error) {
      console.error(`❌ Error deleting ${collectionName.slice(0, -1)}:`, error);
      res.status(500).json({ 
        success: false, 
        message: `Error deleting ${collectionName.slice(0, -1)}`,
        error: error.message 
      });
    }
  });
};

// Apply CRUD routes to all collections
createCrudRoutes(Service, 'services');
createCrudRoutes(Project, 'projects');
createCrudRoutes(Education, 'education');
createCrudRoutes(Experience, 'experience');
createCrudRoutes(Skill, 'skills');
createCrudRoutes(Testimonial, 'testimonials');

// Special routes for single document collections
app.get('/api/contact', async (req, res) => {
  try {
    const contact = await Contact.findOne();
    res.json({ success: true, data: contact });
  } catch (error) {
    console.error('❌ Error fetching contact:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching contact info',
      error: error.message 
    });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    req.body.updatedAt = new Date();
    const contact = await Contact.findOneAndUpdate({}, req.body, { 
      upsert: true, 
      new: true 
    });
    
    console.log('✅ Contact information updated successfully');
    res.json({ 
      success: true, 
      message: 'Contact information updated successfully',
      data: contact 
    });
  } catch (error) {
    console.error('❌ Error updating contact:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating contact information',
      error: error.message 
    });
  }
});

app.get('/api/theme', async (req, res) => {
  try {
    const theme = await Theme.findOne();
    res.json({ success: true, data: theme });
  } catch (error) {
    console.error('❌ Error fetching theme:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching theme settings',
      error: error.message 
    });
  }
});

app.post('/api/theme', async (req, res) => {
  try {
    req.body.updatedAt = new Date();
    const theme = await Theme.findOneAndUpdate({}, req.body, { 
      upsert: true, 
      new: true 
    });
    
    console.log('✅ Theme settings updated successfully');
    res.json({ 
      success: true, 
      message: 'Theme settings updated successfully',
      data: theme 
    });
  } catch (error) {
    console.error('❌ Error updating theme:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating theme settings',
      error: error.message 
    });
  }
});

app.get('/api/siteinfo', async (req, res) => {
  try {
    const siteInfo = await SiteInfo.findOne();
    res.json({ success: true, data: siteInfo });
  } catch (error) {
    console.error('❌ Error fetching site info:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching site information',
      error: error.message 
    });
  }
});

app.post('/api/siteinfo', upload.single('logo'), async (req, res) => {
  try {
    let updateData = { ...req.body };
    updateData.updatedAt = new Date();
    
    if (req.file) {
      updateData.logo = `/uploads/${req.file.filename}`;
      console.log(`✅ Logo updated: ${updateData.logo}`);
    }
    
    const siteInfo = await SiteInfo.findOneAndUpdate({}, updateData, { 
      upsert: true, 
      new: true 
    });
    
    console.log('✅ Site information updated successfully');
    res.json({ 
      success: true, 
      message: 'Site information updated successfully',
      data: siteInfo 
    });
  } catch (error) {
    console.error('❌ Error updating site info:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating site information',
      error: error.message 
    });
  }
});

// Project image management
app.post('/api/projects/:id/images', upload.array('images', 10), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: 'Project not found' 
      });
    }
    
    const newImages = req.files.map(file => `/uploads/${file.filename}`);
    project.images.push(...newImages);
    project.updatedAt = new Date();
    await project.save();
    
    console.log(`✅ ${newImages.length} images added to project: ${project.title}`);
    res.json({ 
      success: true, 
      message: 'Images added successfully',
      data: project 
    });
  } catch (error) {
    console.error('❌ Error adding project images:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error adding project images',
      error: error.message 
    });
  }
});

app.delete('/api/projects/:id/images/:imageIndex', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: 'Project not found' 
      });
    }
    
    if (req.params.imageIndex >= project.images.length) {
      return res.status(404).json({ 
        success: false, 
        message: 'Image not found' 
      });
    }
    
    project.images.splice(req.params.imageIndex, 1);
    project.updatedAt = new Date();
    await project.save();
    
    console.log(`✅ Image removed from project: ${project.title}`);
    res.json({ 
      success: true, 
      message: 'Image removed successfully',
      data: project 
    });
  } catch (error) {
    console.error('❌ Error removing project image:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error removing project image',
      error: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running', 
    timestamp: new Date().toISOString() 
  });
});

// Initialize sample data when server starts
initializeSampleData();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 MongoDB connected: ${MONGODB_URI.split('@')[1]}`);
  console.log(`📁 Upload directory: ./uploads`);
});