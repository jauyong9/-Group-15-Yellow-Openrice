const apiUrl = 'http://localhost:3000';
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const datasource = 'https://raw.githubusercontent.com/LiWaiYip/mynewrepository/master/map.json';

var request = require("request")
var cors = require('cors');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');
var config = require('./config.json');
var path = require('path');
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
    required: false,
    default: 'https://image.flaticon.com/icons/svg/21/21104.svg'
  },
  joinDate: {
    type: Date,
    default: Date.Now
  },
  type: {
    type: String,
    default: 'Unverifed User'
  },
  favouriteRest: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Restaurant'}],
    default: []
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
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    required: true,
    default: []
  },
  dislikes: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    required: true,
    default: []
  },
  views: {
    type: Number,
    required: true,
    default: 0
  },
  comments: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    required: true,
    default: []
  },
  description: {
    type: String
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
  time: {
    type: Date,
    default: Date.now
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

// app.use(express.static(__dirname + '/public'));
app.use('/images', express.static(path.resolve(__dirname + '/../images/')));
app.use('/css', express.static(path.resolve(__dirname + '/../frontend/css/')));
app.use('/js', express.static(path.resolve(__dirname + '/../frontend/js/')));
app.use('/jsx', express.static(path.resolve(__dirname + '/../frontend/jsx/')));

// Change Password
app.post('/password/', (req, res) => {
  jwt.verify(req.headers['authorization'], SECRET_KEY, function(err, decoded) {
    if (err)
      res.json({response: 'fail', message: err})
    else {
      const filter = {_id: decoded._id}

      const update = {password: bcrypt.hashSync(req.body.password)}

      User.findOneAndUpdate(filter, update, function(err, doc) {
       if (err) {
          res.json({response: 'fail', message: err});
       }
       else
          res.json({response: 'success'});
      })
    }
  });
});

// Change icon
app.post('/icon/', (req, res) => {
  jwt.verify(req.headers['authorization'], SECRET_KEY, function(err, decoded) {
    if (err)
      res.json({response: 'fail', message: err})
    else {
      const filter = {_id: decoded._id}

      const update = {iconUrl: req.body['iconUrl']}

      User.findOneAndUpdate(filter, update, function(err, doc) {
       if (err) {
          res.json({response: 'fail', message: err});
        }
       else if (doc == null)
          res.json({response: 'fail', message:'the link is not valid'});
       else
          res.json({response: 'success'});
      })
    }
  });
});
// Post Comment
app.post('/comment/:restId', (req, res) => {
  jwt.verify(req.headers['authorization'], SECRET_KEY, function(err, decoded) {
    if (err)
      res.json({response: 'fail', message: err})
    else {
      User.findOne({
        _id: decoded._id
      })
      .then(user => {
        if (user) {
          Restaurant.findOne({
            restId: req.params['restId']
          })
          .then(rest => {
            Comment.findOne().sort('-commentId').exec(function(err, item) {
              if (err)
                res.json({response: 'fail', message: err});
              let newId = (item == null ? 1 : item.commentId) + 1;

              if (rest) {
                var comment = new Comment({
                  commentId: newId,
                  content: req.body['content'],
                  postBy: user
                });

                comment.save(function(err) {
                  if (err)
                    res.json({response: 'fail', message: err});

                  const filter = {restId: req.params['restId']}

                  rest.comments.push(comment._id);

                  const update = {comments: rest.comments}

                  Restaurant.findOneAndUpdate(filter, update, function(err, doc) {
                   if (err) {
                      res.json({response: 'fail', message: err});
                    }
                   else if (doc == null)
                      res.json({response: 'fail', message:'the link is not valid'});
                   else
                      res.json({response: 'success'});
                  })
                });
              }
              else {
                res.json({response: 'fail', message: 'restaurant not found'})
              }
            });
          })
          .catch(err => {
            res.json({response: 'fail', message: err})
          })
        } else {
          res.json({response: 'fail', message: "User does not exist"})
        }
      })
      .catch(err => {
        res.json({response: 'fail', message: err})
      })
    }
  })
});


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
          expiresIn: 2880
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
    let newId = (item == null ? 1 : item.userId) + 1;
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
          expiresIn: 50000
        })

        //const link = apiUrl + '/activate/' + activateToken;
        const link = req.protocol + '://' + req.get('host') + '/activate/' + activateToken;

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
// Dislike a restaurant
app.get('/dislike/:restId', (req, res) => {
  jwt.verify(req.headers['authorization'], SECRET_KEY, function(err, decoded) {
    if (err)
      res.json({response: 'fail', err: err})
    else {
      User.findOne({
        _id: decoded._id
      })
      .then(user => {
        if (user) {
          Restaurant.findOne({
            restId: req.params['restId']
          })
          .then(rest => {
            if (rest) {
              if (rest.likes.indexOf(user._id) != -1 || rest.dislikes.indexOf(user._id) != -1) {
                res.json({response: 'fail', message: 'you have already rated this restaurant'})
              }
              else {
                const filter = {restId: req.params['restId']}

                rest.dislikes.push(user._id);

                const update = {dislikes: rest.dislikes}

                Restaurant.findOneAndUpdate(filter, update, function(err, doc) {
                 if (err) {
                    res.json({response: 'fail', err: err});
                  }
                 else if (doc == null)
                    res.json({response: 'fail', message:'the link is not valid'});
                 else
                    res.json({response: 'OK'});
                })
              }
           }
          })
          .catch(err => {
            res.json({response: 'fail', err: err})
          })
        } else {
          res.json({response: 'fail', message: "User does not exist"})
        }
      })
      .catch(err => {
        res.json({response: 'fail', err: err})
      })
    }
  })
});


// Like a restaurant
app.get('/like/:restId', (req, res) => {
  jwt.verify(req.headers['authorization'], SECRET_KEY, function(err, decoded) {
    if (err)
      res.json({response: 'fail', err: err})
    User.findOne({
      _id: decoded._id
    })
    .then(user => {
      if (user) {
        Restaurant.findOne({
          restId: req.params['restId']
        })
        .then(rest => {
          if (rest) {
            const filter = {restId: req.params['restId']}

            if (rest.likes.indexOf(user._id) != -1 || rest.dislikes.indexOf(user._id) != -1) {
              res.json({response: 'fail', message: 'you have already rated this restaurant'})
            }
            else {
              rest.likes.push(user._id);
              const update = {likes: rest.likes}

              Restaurant.findOneAndUpdate(filter, update, function(err, doc) {
               if (err) {
                  res.json({response: 'fail', err: err});
                }
               else if (doc == null)
                  res.json({response: 'fail', message:'the link is not valid'});
               else
                  res.json({response: 'OK'});
              })
            }
         }
        })
        .catch(err => {
          res.json({response: 'fail', err: err})
        })
      } else {
        res.json({response: 'fail', message: "User does not exist"})
      }
    })
    .catch(err => {
      res.json({response: 'fail', err: err})
    })
  })
});

//  Add a restaurant to favourites
app.get('/favourite/:restId', (req, res) => {
  var rest_id;
  jwt.verify(req.headers['authorization'], SECRET_KEY, function(err, decoded) {
    if (err)
      res.json({response: 'fail', message: err})
    else {

      Restaurant.findOne(
        { restId: req.params['restId'] },
        function(err, result) {

          rest_id = result._id;

          User.findOne({ _id: decoded._id })
          .then(user => {
            if(user.favouriteRest.indexOf(rest_id) != -1) {
              res.json({response: 'warn', message: 'You have already added the restaurant to favourites.'})
            }
            else
            {
              const filter = {_id: decoded._id}
              user.favouriteRest.push(rest_id);
              const update = {favouriteRest: user.favouriteRest}

              User.findOneAndUpdate(filter, update, function(err, doc) {
              if (err) {
                  res.json({response: 'fail', message: err});
              }
              else
                  res.json({response: 'OK'});
              })
            }
          })
        }
      )
    }
  });
});

// Get favourite restaurants
app.get('/favourite', function (req, res) {
    var decoded = jwt.verify(req.headers['authorization'], SECRET_KEY);
    // if (err)
    //   res.json({response: 'fail', err: err})
    User.findOne({
      _id: decoded._id
    })
    .populate('favouriteRest').exec(function(err, user) {
      if (err) throw err;
      console.log('Rest: ', user.favouriteRest[0].name);
      res.send(user.favouriteRest);
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
      res.json({response: 'fail', err: err})
    })
});

// Get All Restaurant
app.get('/restaurant', function(req, res) {
  Restaurant.find({}).exec(function(err, restaurants) {
    if (err)
       res.send(err);
    if (restaurants == null || restaurants.length == 0)
       res.send('No result is found');
    else{
      var result = [];
      res.json({'response': 'success', 'restaurants': restaurants});
    }
    /*restaurants.forEach(function(restaurant) {
                  result.push(restaurant);
                  if (result.length == restaurants.length)
                    res.send(result.join(''));

    });*/
  });
});

/*
// Add all Restaurants from datasource
app.get('/load_datasource', function(req, res) {
  // TODO: verify admin account before adding
  request({
    url: datasource,
    json: true
  }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
          var restaurants = body.features

          var responses = []

          for (var i = 0; i < restaurants.length; i++) {
                const rest = new Restaurant({
                  restId: i+1,
                  name: restaurants[i].properties.Name,
                  longitude: restaurants[i].geometry.coordinates[0],
                  latitude: restaurants[i].geometry.coordinates[1],
                  description: restaurants[i].properties.description
                });

                rest.save(function(err) {

                  if (err)
                    responses.push(`Fail for adding ${rest.name} because ${err}`);
                  else
                    responses.push(`Successful for adding ${rest.name}`);

                  if (responses.length == restaurants.length) {
                      res.json({'response':responses});
                  }
                });

           }

       }
     });
});
*/

app.get('/restaurant/:id', function(req, res) {
  Restaurant
  .find({restId: req.params['id']})
  .populate({path: 'comments', populate: {path: 'postBy'}})
  .exec(function(err, rest) {
    if (err)
      res.json({'response': 'fail', 'message': err})
    else if (!rest)
      res.json({'response': 'fail', 'message': 'no restaurant with this id'})
    else
      res.json({'response': 'success', 'restaurant': rest})
  });
});

// Get K closest restaurant from (latitude, longitude)
app.get('/closest_restaurants/:k/:lat/:lon', function(req, res) {
    const k = Number(req.params['k']);
    const lat = req.params['lat'];
    const lon = req.params['lon'];
    const distance = function(lat1, lon1, lat2, lon2, unit) { // source: https://www.geodatasource.com/developers/javascript
    	if ((lat1 == lat2) && (lon1 == lon2)) {
    		return 0;
    	}
    	else {
    		var radlat1 = Math.PI * lat1/180;
    		var radlat2 = Math.PI * lat2/180;
    		var theta = lon1-lon2;
    		var radtheta = Math.PI * theta/180;
    		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    		if (dist > 1) {
    			dist = 1;
    		}
    		dist = Math.acos(dist);
    		dist = dist * 180/Math.PI;
    		dist = dist * 60 * 1.1515;
    		if (unit=="K") { dist = dist * 1.609344 }
    		if (unit=="N") { dist = dist * 0.8684 }
    		return dist;
    	}
    }


    Restaurant
    .find({})
    .exec(function(err, rests) {
      if (err)
        res.json({'response': 'fail', 'message': err})
      else if (!rests)
        res.json({'response': 'fail', 'message': 'no restaurant found'})
      else {
        rests = JSON.parse(JSON.stringify(rests)) // clone it so we can add extra distance field

        ret = []

        for ( i = 0; i < rests.length; i++) {
          rests[i]["distance"] = distance(rests[i].latitude,rests[i].longitude,req.params['lat'],req.params['lon'], 'N');
          rests[i]["distance"] = Math.floor(rests[i]["distance"] * 1000);
        }

        rests.sort(function(a, b) {
          return a.distance - b.distance;
        });


        res.json({'response': 'success', 'restaurants': rests.slice(0, Math.min(k, rests.length))});
      }
    });
});


// Add View
app.get('/view/restaurant/:restId', function(req, res) {
  Restaurant.findOne({
    restId: req.params['restId']
  })
  .then(rest => {
    if (rest) {
      const filter = {restId: req.params['restId']}
      const update = {views: rest.views+1}

      Restaurant.findOneAndUpdate(filter, update, function(err, doc) {
       if (err)
          res.send(err);
       else if (doc == null)
          res.json({response: 'fail', message:'the link is not valid'});
       else
          res.json({response: 'OK'});
     })
   }
  })
  .catch(err => {
    res.json({response: 'fail', err: err})
  })

});

// Display All Users
app.get('/users', function(req, res) {
  User.collection.find({$or:[{ type: 'User' }, { type: 'Unverifed User'}]}).toArray(function(err, result) {
    if (err) throw err;
    res.send(result);
  })
});

// Display All Restaurant
app.get('/rests', function(req, res) {
  Restaurant.collection.find({}).sort({restId: 1}).toArray(function(err, result) {
    if (err) throw err;
    res.send(result);
  })
});

// Add New Restaurant
app.post('/restaurant', function(req, res) {
  var maxid = 0;
  Restaurant.findOne({}, 'restId').sort({restId: -1}).limit(1)
  .exec(function(err, result) {
    maxid = result.restId +1;
    var rest = new Restaurant({
      restId: maxid,
      name: req.body['name'],
      logitude: req.body['longitude'],
      latitude: req.body['latitude'],
      tag: req.body['tag'],
      likes: 0,
      dislikes: 0,
      views: 0,
      description: req.body['description']
    });
    rest.save(function(err){
      if(err){
        res.send(err);
        return;
      }
      res.status(201).send("New restaurant added.");
    })
  })
});

// Delete Single Restaurant
app.delete('/rest/:restId', function(req, res) {
  var id = req.params['restId'];
  console.log("delete: "+id);

  Restaurant.remove({restId: id}, function(err) {
    if(err) {
      res.json({response: 'fail', message: err});
    } else {
      res.json({response: 'success'});
    }
  });
});

// Delete Single User
app.delete('/user/:userId', function(req, res) {
  var id = req.params['userId'];

  User.remove({userId: id}, function(err) {
    if(err) {
      res.json({response: 'fail', message: err});
    } else {
      res.json({response: 'success'});
    }
  });
});


// Delete all restaurants (Not open to public, for debugging only)
app.delete('/all_restaurants', function(req, res) {
    if (req.headers['key'] == SECRET_KEY) {
      Restaurant.deleteMany({}, function(err) {
        if (err) {
          res.send(err);
        }
        else {
          res.send('Deleted all restaurants');
        }
      });
    }
    else {
      res.send('key is wrong')
    }
});


// Delete all users (Not open to public, for debugging only)
app.delete('/all_users', function(req, res) {
    if (req.headers['key'] == SECRET_KEY) {
      User.deleteMany({}, function(err) {
        if (err) {
          res.send(err);
        }
        else {
          res.send('Deleted all users');
        }
      });
    }
    else {
      res.send('key is wrong')
    }
});

/*
app.get('/add_admin', function (req, res) {
  var maxid = 0;
  User.findOne({}, 'userId').sort({userId: -1}).limit(1)
  .exec(function(err, result) {
    if(err) return console.error(err);
    maxid = result.userId +1;
  });

  console.log("maxid: "+maxid);
  var admin = new User ({
    userId: maxid,
    email: 'admin@admin.com',
    name: 'Admin',
    password: bcrypt.hashSync('qwer'),
    type: 'admin'
  });
  admin.save(function (err, result) {
    if(err){
      res.send(err);
      return;
    }
    res.status(201).send("Use this account information to login as admin.:\n"
              + "Email: " + result.email + "\n"
              + "Password: qwer"
            );
  });
});
*/

const load_datasource = () => {
  request({
    url: datasource,
    json: true
  }, function (error, response, body) {
      console.log(response.statusCode)
      if (!error && response.statusCode === 200) {
          var restaurants = body.features

          var responses = []

          for (var i = 0; i < restaurants.length; i++) {
                const rest = new Restaurant({
                  restId: i+1,
                  name: restaurants[i].properties.Name,
                  longitude: restaurants[i].geometry.coordinates[0],
                  latitude: restaurants[i].geometry.coordinates[1],
                  description: restaurants[i].properties.description
                });

                rest.save(function(err) {

                  if (err)
                    console.log(`Fail for adding ${rest.name} because ${err}`);
                  else
                    console.log(`Successful for adding ${rest.name}`);

                });

           }

       }
     });
}

const add_default_admin = () => {
  var maxid = 0;
  User.findOne({}, 'userId').sort({userId: -1}).limit(1)
  .exec(function(err, result) {
    if(err) return console.error(err);
    if(result)
      maxid = result.userId + 1;
    else
      maxid = 1;
  });

  var admin = new User ({
    userId: maxid,
    email: 'admin@admin.com',
    name: 'Admin',
    password: bcrypt.hashSync('qwer'),
    type: 'admin'
  });
  admin.save(function (err, result) {
    if(err){
      console.log(err);
      return;
    }
    console.log("Use this account information to login as admin.:\n"
              + "Email: " + result.email + "\n"
              + "Password: qwer"
            );
  });
}

app.all('/map.html', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../frontend/map.html'));
});

app.all('/*', function (req, res) {
    Restaurant.count({}, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        if (result == 0)
          load_datasource();
      }
    })

    User.count({email: 'admin@admin.com'}, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        if (result == 0)
          add_default_admin();
      }
    })

    res.sendFile(path.resolve(__dirname + '/../frontend/index.html'));
});



// listen to port 3000
const server = app.listen(3000);
