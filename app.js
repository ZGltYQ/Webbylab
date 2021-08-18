const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressHbs = require("express-handlebars");
const hbs = require("hbs");
const multer = require("multer");
const ModelPassport = require("./models/Passport");
const helmet = require("helmet");
const session = require("express-session");
const MySQLStore = require('express-mysql-session')(session);

const indexRouter = require('./routes/index');
const apiRouter = require("./routes/api");

const app = express();

// view engine setup

hbs.registerPartials(__dirname + "/views/partials");
app.engine("hbs", expressHbs({
  layoutsDir: __dirname + "/views/layouts",
  defaultLayout: "main",
  extname: "hbs"
}));

var sessionStore = new MySQLStore({
	host: 'tz-db.cqumjjcigocl.us-east-2.rds.amazonaws.com',
	port: 3306,
	user: 'qwerty',
	password: 'qwerty03022001',
	database: 'tz'
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
	secret: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJwZXRyb0BnbWFpbC5jb20iLCJuYW1lIjoiUGV0cm92IFBldHJvIiwiY3JlYXRlZEF0IjoiMjAyMS0wNi0yOVQxMDo0Njo1NS4wMDBaIiwidXBkYXRlZEF0IjoiMjAyMS0wNi0yOVQxMDo0Njo1NS4wMDBaIiwiaWF0IjoxNjI1MDUyNDc5fQ.LY8PKLr060GmU81LaW8GY0Ef3Nr0aXHZPhL168rhPa0',
	store: sessionStore,
	resave: false,
	saveUninitialized: false,
  cookie: {
    maxAge: 5 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
}));


app.use(ModelPassport.initialize());
app.use(ModelPassport.session());


const storageConfig = multer.diskStorage({
  destination: (req, file, cb) =>{
    if(req.session.passport.user.token){
      cb(null, "uploads");
    }   
  },
  filename: (req, file, cb) =>{
      cb(null, file.originalname);
  }
});

app.use(multer({storage:storageConfig}).single("movies"));

app.use("/api/v1", apiRouter);
app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
