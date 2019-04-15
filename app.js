const env 				= "live";
const fs 					= require("fs");
var config      	= JSON.parse(fs.readFileSync('./config.json', 'utf8'));
    config        = config[env];
    
const redis 			= require("redis");
const express 		= require('express');
const bodyParser 	= require('body-parser');
const redisClient = redis.createClient(config.redis_port, config.redis);
      redisClient.auth(config.redis_auth)
const moment 			= require('moment');
const app 				= express();
const url 		  	= require('url');
const path 		  	= require('path');
const uuid 				= require('uuidv4')
const cookieParser = require('cookie-parser');


var DBConnection      = require('./database/connection.js');
var dbConnection      = new DBConnection();

global.appRoot		    = path.resolve(__dirname);
global.cookieParser   = cookieParser;
global.uuid           = uuid;

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended' : false}));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.set("views", "/views");


app.use((req, res, next) =>{
  let cookie = req.cookies.client_id;

  if(cookie === undefined){
    res.cookie('client_id', uuid(), {maxAge: 90000, httpOnly: false});
  }

  next();
})


app.get('/', (req, res) => {
  res.render(appRoot + '/views/');
});

const main = async () =>{
  const db 		 = await dbConnection.connectDB(config.db);
  global.db 	 = db;

  const gameMultiplayer = require("./game/multiplayer").initialize(redisClient, uuid, config);
  
	// const routes = require('./routes/routes')(app, url, path, redisClient, bcrypt)

}


const server = require('http').createServer(app)
const port   = process.env.PORT || 3006;
server.listen(port, ()=>{
	console.log(`listening ${port}`)
	main()
})

redisClient.on('connect', () =>{
    console.log('Redis client connected');
})