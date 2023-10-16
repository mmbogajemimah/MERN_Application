const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); 

const User = require('./models/User.js');
require('dotenv').config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'fhjakkbatjaLnbcbjlksbsln46kb6hc';

// Parses JSON from the Request
// Password: Q7uuCFXnVX4PxjHe
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    credentials: true,
    origin: 'http://127.0.0.1:5173',
}));

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });


// mongoose.connect(process.env.MONGO_URL)

console.log(process.env.MONGO_URL)

app.get('/test', (req, res) => {
    res.json('test ok');
});

app.post('/register', async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      const userDoc = await User.create({
        name,
        email,
        password: bcrypt.hashSync(password, bcryptSalt),
      });
  
      res.json(userDoc);
    } catch (error) {
      console.error(error);
      res.status(422).json({ error: 'unprocessable entity' });
    }
  });
  
app.post('/login', async(req,res) => {
  const {email,password} = req.body
  const userDoc = await User.findOne({email});

  // console.log(userDoc)

  if (userDoc){
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk ){
      jwt.sign({
        email:userDoc.email, 
        id:userDoc._id, 
        // name:userDoc.name
      }, jwtSecret, {}, (err,token) => {
        if (err) throw err;
        res.cookie('token', token).json(userDoc);
      });
      
    } else {
      res.json('Pass not Okay')
    }
    // res.json('found');
  } else {
    res.status(422).json('Not Found')
  }
})
  
app.get('/profile', (req, res) => {
  const {token} = req.cookies;
  if (token) {
    jwt.verify(token,jwtSecret, {}, async(err, userData) => {
      if (err) throw err;
      const {name, email, _id} = await User.findById(userData.id);
      res.json({name, email, _id});
    })
  }
})

app.post('/logout', (req, res) => {
  res.cookie('token', '').json(true);
});

app.listen(4000);