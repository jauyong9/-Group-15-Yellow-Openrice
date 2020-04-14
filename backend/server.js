const apiUrl = 'http://localhost:3000';
const express = require('express'); const app = express();
const bodyParser = require("body-parser");

var cors = require('cors');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');
var config = require('./config.json');

const SECRET_KEY = config.SECRET_KEY;

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.email,
    pass: config.password
  }
});

var Schema = mongoose.Schema;
var serverURL = 'mongodb://localhost/hkrestguide';

mongoose.connect(serverURL);

/* Connect to the database: begins */
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function() {
  console.log('Connection is open...');
});
/* Connect to the database: ends */

/* Setup database tables: begins */

var UserSchema = mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  iconUrl: {
    type: String,
    required: false
  },
  joinDate: {
    type: Date,
    default: Date.Now
  },
  type: {
    type: String,
    default: 'Unverifed User'
  }
});
var User = mongoose.model('User', UserSchema);

var RestaurantSchema = mongoose.Schema({
  restId: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  tag: {
    type: [String]
  },
  likes: {
    type: Number,
    required: true,
    default: 0
  },
  dislikes: {
    type: Number,
    required: true,
    default: 0
  },
  comments: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    required: true,
    default: []
  }
});
var Restaurant = mongoose.model('Restaurant', RestaurantSchema);

var CommentSchema = mongoose.Schema({
  commentId: {
    type: Number,
    required: true,
    unique: true
  },
  postBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  postOn: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  likes: {
    type: Number,
    required: true,
    default: 0
  },
  dislikes: {
    type: Number,
    required: true,
    default: 0
  },
  content: {
    type: String,
    required: true
  }
});
var Comment = mongoose.model('Comment', CommentSchema);

/* Setup database tables: ends */


app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use(cors()); // allow index.html to connect

// Login
app.post('/login', (req, res) => {
  User.findOne({
      email: req.body.email
  })
  .then(user => {
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        const payload = {
            _id: user._id,
            userId: user.userId,
            email: user.email,
            name: user.name
        }
        let token = jwt.sign(payload, SECRET_KEY, {
          expiresIn: 1440
        })
        res.json({response: 'success', message: 'login successful', token: token})
      } else {
        res.json({response: 'fail', message: "user does not exist / password is incorrect"})
      }
    } else {
      res.json({response: 'fail', message: "user does not exist / password is incorrect"})
    }
  })
  .catch(err => {
    console.log(err);
    res.json({response: 'fail', message: "user does not exist / password is incorrect", error: err})
  })
});

// Register
app.post('/register', function(req, res) {
  User.findOne().sort('-userId').exec(function(err, item) {
    if (err)
      res.json({response: err});
    let newId = (item == null ? 0 : item.userId) + 1;
    const today = new Date();
    var user = new User({
      userId: newId,
      email: req.body['email'],
      name: req.body['name'],
      password: bcrypt.hashSync(req.body['password']),
      joinDate: today
    });

    user.save(function(err) {
      if (err)
        res.json({response: `fail`, message: `Email is in use`, ref: err});
      else {
        res.status(201);
        const payload = {
            _id: user._id,
            userId: user.userId,
            email: user.email,
            name: user.name
        }
        let token = jwt.sign(payload, SECRET_KEY, {
          expiresIn: 1440
        })
        res.json({
          response: `success`,
          message: `Register Successful`,
          userId: user.userId,
          name: user.name,
          token: token
        });

        let activateToken = jwt.sign(payload, SECRET_KEY, {
          expiresIn: 2880
        })

        const link = apiUrl + '/activate/' + activateToken;

        // Send verification email
        var mailOptions = {
          from: '2020.hkrestguide.gp@gmail.com',
          to: user.email,
          subject: 'Thank you for registering HK Restaurant Guide!',
          text: `
            Dear ${user.name},

            Thank you for registering HK Restaurant.

            Please click this link to activate your account: ${link}

            Best,
            HK Restaurant Guide
          `
        };

        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });

      }
    });
  });
});

// Profile
app.get('/profile', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], SECRET_KEY)
  User.findOne({
    _id: decoded._id
  })
  .then(user => {
    if (user) {
      res.json(user)
    } else {
      res.send("User does not exist")
    }
  })
  .catch(err => {
    res.send("Error: " + err)
  })
});

// Delete all users
app.delete('/all_users', function(req, res) {
    User.deleteMany({}, function(err) {
      if (err) {
        res.send(err);
      }
      else {
        res.send('Deleted all users');
      }
    });
});

app.get('/activate/:token', function (req, res) {
    var decoded = jwt.verify(req.params['token'], SECRET_KEY)
    User.findOne({
      _id: decoded._id
    })
    .then(user => {
      if (user) {
        const filter = {_id: user._id}
        const update = {type: 'User'}

        User.findOneAndUpdate(filter, update, function(err, doc) {
         if (err)
           res.send(err);
         else if (doc == null)
           res.json({response: 'fail', message:'the link is not valid'});
         else {
           User.findOne(filter, function(err, doc) {
             res.json({response: 'success', message:'Activate successful. Please login again'});
           });
         }
       })
     }
    })
    .catch(err => {
      res.send("Error: " + err)
    })
});

app.all('/*', function (req, res) {
    res.json({response: "Hello World from HK Restaurant Guide Backend Server!"});
});



// listen to port 3000
const server = app.listen(3000);
