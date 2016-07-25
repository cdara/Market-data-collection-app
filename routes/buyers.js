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
	console.log('Buyer Data File Does Not Exist... Creating Empty Buyer Json Data file...');
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

router.get('/api', function(req, res, next) {
  res.json(buyers);
});

router.post('/', function(req, res, next) {
	console.log(findMaxId());
	var new_buyer_id = (findMaxId()).id + 1;
	var new_buyer = {
		id: new_buyer_id,
		name: req.body.fullname,
		company: req.body.company,
		email: req.body.email,
		productname: req.body.productname,
		productcost: req.body.productcost
	};
	buyers.push(new_buyer);
	console.log(buyers);
	fs.writeFileSync(dataPath, JSON.stringify(buyers));
	res.redirect('/buyers/');
});

router.get('/add', function(req, res, next) {
	res.render('add', {buyer:{}});
});

router.route('/:buyer_id')
	.all(function(req, res, next){
		buyer_id = req.params.buyer_id;
		buyer = lookupbuyer(buyer_id);
		next();
	})
	.get(function(req,res,next){
		res.render('edit', {buyer: buyer});
	})
	.post(function(req,res,next){
		res.send('Post for buyer ' + buyer_id);
	})
	.put(function(req,res,next){
		buyer.name = req.body.fullname;
		buyer.company = req.body.company;
		buyer.email = req.body.email;
		buyer.productname = req.body.productname;
		buyer.productcost = req.body.productcost;

		fs.writeFileSync(dataPath, JSON.stringify(buyers));
		res.redirect('/buyers/');
	})
	.delete(function(req,res,next){
		for (var i = 0; i < buyers.length; i++) {
			if (buyers[i].id === parseInt(buyer_id)) {
				buyers.splice(i, 1);
			}
		}
		//console.log(buyers);
		fs.writeFileSync(dataPath, JSON.stringify(buyers));
		res.send('Delete for buyer ' + buyer_id);
	});

module.exports = router;
