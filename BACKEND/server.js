// server.js
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
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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
  primaryColor: String,
  secondaryColor: String,
  accentColor: String,
  fontFamily: String,
  updatedAt: { type: Date, default: Date.now }
});

const SiteInfoSchema = new mongoose.Schema({
  logo: String,
  siteTitle: String,
  footerText: String,
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
      Service.find(),
      Project.find(),
      Education.find(),
      Experience.find(),
      Skill.find(),
      Testimonial.find(),
      Contact.findOne(),
      Theme.findOne(),
      SiteInfo.findOne()
    ]);
    
    res.json({
      hero, services, projects, education,
      experience, skills, testimonials,
      contact, theme, siteInfo
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({ 
    message: 'File uploaded successfully', 
    filePath: `/uploads/${req.file.filename}` 
  });
});

// Hero routes
app.get('/api/hero', async (req, res) => {
  try {
    const hero = await Hero.findOne();
    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/hero', upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
]), async (req, res) => {
  try {
    let updateData = { ...req.body };
    
    if (req.files.profileImage) {
      updateData.profileImage = `/uploads/${req.files.profileImage[0].filename}`;
    }
    
    if (req.files.resume) {
      updateData.resume = `/uploads/${req.files.resume[0].filename}`;
    }
    
    const hero = await Hero.findOneAndUpdate({}, updateData, { 
      upsert: true, 
      new: true 
    });
    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Similar routes for other sections (Services, Projects, etc.)
// For brevity, I'll show a pattern that can be applied to all

// Generic CRUD routes for collections
const createCrudRoutes = (model, collectionName) => {
  // Get all
  app.get(`/api/${collectionName}`, async (req, res) => {
    try {
      const items = await model.find();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Create
  app.post(`/api/${collectionName}`, async (req, res) => {
    try {
      const newItem = new model(req.body);
      const savedItem = await newItem.save();
      res.json(savedItem);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Update
  app.put(`/api/${collectionName}/:id`, async (req, res) => {
    try {
      const updatedItem = await model.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true }
      );
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Delete
  app.delete(`/api/${collectionName}/:id`, async (req, res) => {
    try {
      await model.findByIdAndDelete(req.params.id);
      res.json({ message: 'Item deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
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
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate({}, req.body, { 
      upsert: true, 
      new: true 
    });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/theme', async (req, res) => {
  try {
    const theme = await Theme.findOne();
    res.json(theme);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/theme', async (req, res) => {
  try {
    const theme = await Theme.findOneAndUpdate({}, req.body, { 
      upsert: true, 
      new: true 
    });
    res.json(theme);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/siteinfo', async (req, res) => {
  try {
    const siteInfo = await SiteInfo.findOne();
    res.json(siteInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/siteinfo', upload.single('logo'), async (req, res) => {
  try {
    let updateData = { ...req.body };
    
    if (req.file) {
      updateData.logo = `/uploads/${req.file.filename}`;
    }
    
    const siteInfo = await SiteInfo.findOneAndUpdate({}, updateData, { 
      upsert: true, 
      new: true 
    });
    res.json(siteInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Project image management
app.post('/api/projects/:id/images', upload.array('images', 10), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const newImages = req.files.map(file => `/uploads/${file.filename}`);
    project.images.push(...newImages);
    await project.save();
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/projects/:id/images/:imageIndex', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    project.images.splice(req.params.imageIndex, 1);
    await project.save();
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});