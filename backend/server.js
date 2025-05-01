const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/team-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Member Model
const memberSchema = new mongoose.Schema({
  name: String,
  role: String,
  email: String,
  image: String
});

const Member = mongoose.model('Member', memberSchema);

// Routes
app.post('/api/members', upload.single('image'), async (req, res) => {
  try {
    const member = new Member({
      name: req.body.name,
      role: req.body.role,
      email: req.body.email,
      image: req.file.filename
    });
    await member.save();
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/members', async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/members/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (member) {
      res.json(member);
    } else {
      res.status(404).json({ message: 'Member not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add delete endpoint
app.delete('/api/members/:id', async (req, res) => {
  try {
    console.log('Delete request received for member ID:', req.params.id);
    
    const member = await Member.findById(req.params.id);
    console.log('Found member:', member);
    
    if (!member) {
      console.log('Member not found');
      return res.status(404).json({ message: 'Member not found' });
    }
    
    // Delete the member's image file
    const imagePath = path.join(__dirname, 'uploads', member.image);
    console.log('Attempting to delete image at path:', imagePath);
    
    if (fs.existsSync(imagePath)) {
      console.log('Image file exists, deleting...');
      fs.unlinkSync(imagePath);
      console.log('Image file deleted successfully');
    } else {
      console.log('Image file not found at path:', imagePath);
    }
    
    // Delete the member from database
    console.log('Deleting member from database...');
    const deletedMember = await Member.findByIdAndDelete(req.params.id);
    console.log('Member deleted from database:', deletedMember);
    
    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Error in delete endpoint:', error);
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 