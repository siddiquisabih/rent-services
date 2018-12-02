let mongoose = require('mongoose');
express = require('express');
cors = require('cors');
morgan = require('morgan');
config = require('./config/database');
passport = require('passport');
routes = require('./routes/routes');
bodyParser = require('body-parser');


const port = process.env.PORT || 3050

mongoose.connect(config.database).then(
  () => {
    console.log('Mongo is connected');
    let app = express();
    app.use(morgan('dev'));
    app.use(cors());
    app.use(bodyParser.json({limit: "50mb"}));
    app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
    app.use('/api', routes);
    app.use(passport.initialize());
    require('./config/passport')(passport);

    app.listen(port, function () {
      console.log('server is running on port:' + port);
    });
  },
  err => {
    console.log('MongoDB not connected');
  }
);
