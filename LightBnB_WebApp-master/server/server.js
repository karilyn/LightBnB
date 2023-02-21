const database = require('./database');
const apiRoutes = require('./apiRoutes');
const userRoutes = require('./userRoutes');

const path = require('path');

const express = require('express');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');

/// this is an instance of an express server
const app = express();

app.use(cookieSession({
  name: 'session',
  keys: ['key1']
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// /api/endpoints
const apiRouter = express.Router();
apiRoutes(apiRouter, database);
//* the router is just an express thing.*/
app.use('/api', apiRouter);

// /user/endpoints
const userRouter = express.Router();
userRoutes(userRouter, database);
/// any of the user paths are now scoped into this sub router so that it joins the main list at the end.
/// this is basically a helper function for our routers
app.use('/users', userRouter);

app.use(express.static(path.join(__dirname, '../public')));


/// we're registering this handler into the main app, so after we call it, these handlers and paths are stored in the app object
/// we think this is waiting, but it happens immediately and then listens later
/// imagine it as a list of all our route handlers, BUT we can also break it up into sub paths
app.get("/test", (req, res) => {
  res.send("🤗");
});

const port = process.env.PORT || 3000;
app.listen(port, (err) => console.log(err || `listening on port ${port} 😎`));