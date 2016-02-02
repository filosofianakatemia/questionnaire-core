var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/test';
var ObjectId = require('mongodb').ObjectID;

var core = {
	findRestaurants : function(serverCallback){
		var getDataFromDB = function(db, callback) {
			var dataFromDB = new Array();
			var cursor = db.collection('restaurants').find( );
			cursor.each(function(err, doc) {
				assert.equal(err, null);
				if (doc != null) {
					dataFromDB.push(doc);
				} else {
					callback(dataFromDB);
				}
			});
		};
		MongoClient.connect(url, function(err, db) {
			assert.equal(null, err);
			getDataFromDB(db, function(dataFromDB) {
				db.close();
				serverCallback(dataFromDB);
			});
		});
	}
};

module.exports = core;
