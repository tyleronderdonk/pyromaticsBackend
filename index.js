let express = require('express');
let cors = require('cors')
let app = express();
let port = 7777;
let bodyParser = require('body-parser');

let corsOptions = {
  origin: ''
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

let routes = require('./routes/PMRoutes');
routes(app);


app.listen(port);


console.log('Pyromatics RESTful API server started on: ' + port);
