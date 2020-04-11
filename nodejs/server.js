const SECRET_KEY = 'CSCI3100_GROUP15';
const express = require('express'); const app = express();
const bodyParser = require("body-parser");

var cors = require('cors');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs')
var Schema = mongoose.Schema;
var serverURL = 'mongodb://csci3100_15:csci3100_15@localhost/csci3100';

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
        console.log(process.env.SECRET_KEY);
        let token = jwt.sign(payload, SECRET_KEY, {
          expiresIn: 1440
        })
        res.send(token)
      } else {
        res.json({error: "user does not exist / password is incorrect"})
      }
    } else {
      res.json({error: "user does not exist / password is incorrect"})
    }
  })
  .catch(err => {
    res.send('error: ' + err)
  })
});

// Register
app.post('/register', function(req, res) {
  User.findOne().sort('-userId').exec(function(err, item) {
    if (err)
      res.json({response: err});
    let newId = (item == null ? 0 : item.userId) + 1;
    var usr = new User({
      userId: newId,
      email: req.body['email'],
      name: req.body['name'],
      password: bcrypt.hashSync(req.body['password'])
    });

    usr.save(function(err) {
      if (err)
        res.json({response: `Email is in use`, ref: err});
      else {
        res.status(201);
        res.json({
          response: `Register Successful`,
          userId: newId,
          name: usr.name
        });
      }
    });
  });
});

app.all('/*', function (req, res) {
    res.json({response: "Hello World from CSCI 3100 Group 15 Backend Server!"});
});

// listen to port 3000
const server = app.listen(3000);
