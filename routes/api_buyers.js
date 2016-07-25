var express = require('express');
var router = express.Router();
var _ = require('underscore');
var fs = require('fs');

//creating empty data json array
var buyers = [];

var dataPath = 'data.json';

try {
	var stats = fs.statSync(dataPath);
	var dataString = fs.readFileSync(dataPath);
	buyers = JSON.parse(dataString);
} catch (e) {
	console.log('Data File Does Not Exist... Creating Empty File...');
	fs.writeFileSync(dataPath, JSON.stringify([]));
}

function lookupbuyer(buyer_id) {
  return _.find(buyers, function(c) {
    return c.id == parseInt(buyer_id);
  });
}

function findMaxId() {
  return _.max(buyers, function(buyer) {
    return buyer.id;
  });
}

router.get('/', function(req, res, next) {
  res.render('list', {buyers: buyers});
});

router.get('/buyers', function(req, res, next) {
  //res.render('list', {buyers: buyers});
  res.json(buyers);
});


router.route('/buyers/:buyer_id')
	.all(function(req, res, next){
		buyer_id = req.params.buyer_id;
		buyer = lookupbuyer(buyer_id);
		next();
	})
	.get(function(req,res,next){
		res.json('read', {buyer: buyer});
	})
 

module.exports = router;
