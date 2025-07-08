const express = require('express'); //uses express as framework to simplify building app/site
const mongoose = require('mongoose'); //uses mongoose to connect to mongodb to collect data and store data and delete data
const bodyParser = require('body-parser'); //takes incoming form data from user and makes it easier to access on server side
const cookieParser = require('cookie-parser'); //takes incoming cookie data from user and shrinks it down to read and access easier
const User = require('./models/User'); //calls from the User.js in models folder to define User

const app = express(); //makes app refer to express to be used to use functions from the express framework
app.set('view engine', 'ejs'); //uses ejs add on to express so that html can be tailored to each user
app.use(bodyParser.urlencoded({ extended: true })); //uses bodyParser from the middleware urlencoded to take info in submitted forms and break it into clean readable sections and saves it to req.body, extended true allows for this info to be nested inside of one 'user'
app.use(cookieParser()); //allows app to read cookies from http requests and makes cookies accessable through req.cookies and is vulnerable because it doesn't verify these cookies against anything
app.use(express.static('public')); //routes all html, css, js, styling and other static things you want to add to the page from the public folder

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/vulnweb', { //basic syntax for mongoose to connect to mongodb database on localhost and on default port for mongodb and then create a database named 'vulnweb'
  useNewUrlParser: true, // option to use newer more updated urlparser to avoid problems
  useUnifiedTopology: true // another update option that usually comes standard in new mongoose versions
});

// Routes
app.get('/', (req, res) => { //when a user goes to the website root '.../' it redirects user to '.../login' page
  res.redirect('/login');
});

app.get('/login', (req, res) => { //when a user gets on the '.../login' page it renders the login.ejs file
  res.render('login', { error: null }); //creates an error variable that can present the specific error later
});

app.post('/login', async (req, res) => { //uses the body parser middleware to handle when a username and password is submitted via the login form
  const { username, password } = req.body;

  // Vulnerable: No input sanitization, possible NoSQL injection
  const user = await User.findOne({ username, password }); //creates a 'user' const that uses findone to search database 
  if (user) { //if there is a correct user then it creates a session cookie and displays a welcome with the corresponding username
    // Vulnerable: Session stored in plain cookie
    res.cookie('session', user.username);
    res.send(`<h1>Welcome, ${user.username}</h1>`);
  } else { //or else user does not exist in database then display error 'Invalid credentials'
    res.render('login', { error: 'Invalid credentials' });
  }
});

//creates a register route that allows user to create a username and password in the database and creates html and fields
app.get('/register', (req, res) => {
  res.send(`
    <form method="POST" action="/register">
      <input name="username" placeholder="Username" />
      <input name="password" placeholder="Password" />
      <button>Register</button>
    </form>
  `);
});

app.post('/register', async (req, res) => { //the logic for the /register page
  const { username, password } = req.body;
  const user = new User({ username, password }); // Stores plain passwords
  await user.save(); //saves user and adds it to the database
  res.redirect('/login'); //then redirects the user back to the login page
});

app.listen(3000, () => { //common practice app.listen expects a number in parantheses to state the port
  console.log('Vulnerable app running at http://localhost:3000');
}); //this runs the app on localhost and port 3000 then logs it to the console
