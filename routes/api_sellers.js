var express = require('express');
var router = express.Router();
var _ = require('underscore');
var fs = require('fs');

//creating empty data json array
var sellers = [];

var dataPath = 'data_seller.json';

try {
	var stats = fs.statSync(dataPath);
	var dataString = fs.readFileSync(dataPath);
	sellers = JSON.parse(dataString);
} catch (e) {
	console.log('Data File Does Not Exist... Creating Empty File...');
	fs.writeFileSync(dataPath, JSON.stringify([]));
}

function lookupseller(seller_id) {
  return _.find(sellers, function(c) {
    return c.id == parseInt(seller_id);
  });
}

function findMaxId() {
  return _.max(sellers, function(seller) {
    return seller.id;
  });
}

router.get('/', function(req, res, next) {
  res.render('list', {sellers: sellers});
});

router.get('/sellers', function(req, res, next) {
  //res.render('list', {sellers: sellers});
  res.json(sellers);
});


router.route('/sellers/:seller_id')
	.all(function(req, res, next){
		seller_id = req.params.seller_id;
		seller = lookupseller(seller_id);
		next();
	})
	.get(function(req,res,next){
		res.json('read', {seller: seller});
	})
 

module.exports = router;
