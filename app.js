const createError = require('http-errors');
const express = require('express');
const path = require('path');
const fs = require('fs');
// const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const sequelize = require('./sequelize');

const indexRouter = require('./routes/index');
const signupRouter = require('./routes/signup');
const loginRouter = require('./routes/login');
const userRouter = require('./routes/user');

const app = express();

if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}
if (
  process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === 'production'
) {
  try {
    const data = fs.readFileSync('keys.json', 'utf-8');
    const result = JSON.parse(data);
    process.env.OWM_KEY = result.OWM_KEY;
    process.env.SECRET_KEY = result.SECRET_KEY;
  } catch (err) {
    console.log(`Environment Variable Setup Failed: \n ${err}`);
    console.log('Setting Dummy Session Key');
    process.env.SECRET_KEY = 'dummykey';
  }
}

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
  })
);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

// sync database
sequelize
  .authenticate()
  .then(() => {
    sequelize.sync();
  })
  .catch((err) => {
    console.log('Database sync Error:', err);
  });

// set routes
app.use('/', indexRouter);
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});
app.use(
  '/:user',
  (req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.redirect('/');
    }
  },
  userRouter
);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
