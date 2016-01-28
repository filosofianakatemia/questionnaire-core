var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/test';
var ObjectId = require('mongodb').ObjectID;

var core = {
	findRestaurants : function(){
		var data = new Array();
		var getData = function(db, callback) {
			var cursor = db.collection('restaurants').find( );
			cursor.each(function(err, doc) {
				assert.equal(err, null);
				if (doc != null) {
					data.push(doc);
				} else {
					callback();
				}
			});
		};
		MongoClient.connect(url, function(err, db) {
			assert.equal(null, err);
			getData(db, function() {
				db.close();
			});
		});
		return data;
	}
};

module.exports = core;
