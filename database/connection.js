var MongoClient 	= require('mongodb').MongoClient;
var assert      	= require('assert');
var ObjectId    	= require('mongodb').ObjectID;
var uuid        	= require('uuidv4');
var database 			= null;

var DBConnection 	= function() {}

DBConnection.prototype.connectDB = function(config){
  console.log('[MONGODB]: Connecting to database ' + config.id);
  return new Promise((resolve, reject) => {
    mongoClient = new MongoClient(config.url,{ useNewUrlParser: true }
      // {
      //   auth: {
      //     user: config.username,
      //     password: config.primarykey,
      //   }
      // }
    )
    .connect((err, client) => {
      if (err) {
          reject(err);
      } else {
        console.log('[MONGODB]: Database connected ' + config.id);
        assert.equal(null, err);
        database = client.db(config.id);
        resolve(database);
      }
    });
  });
};

module.exports = DBConnection
