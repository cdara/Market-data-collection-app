var express = require('express');
var router = express.Router();
var _ = require('underscore');
var fs = require('fs');

var sellers = [];

var dataPath = 'data_seller.json';

try {
	var stats = fs.statSync(dataPath);
	var dataString = fs.readFileSync(dataPath);
	sellers = JSON.parse(dataString);
} catch (e) {
	console.log('Seller Data File Does Not Exist... Creating Empty Seller Json Data File...');
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
  res.render('list_seller', {sellers: sellers});
});

router.get('/api', function(req, res, next) {
  //res.render('list', {sellers: sellers});
  res.json(sellers);
});

router.post('/', function(req, res, next) {
	console.log(findMaxId());
	var new_seller_id = (findMaxId()).id + 1;
	var new_seller = {
		id: new_seller_id,
		name: req.body.fullname,
		company: req.body.company,
		email: req.body.email,
		productname: req.body.productname,
		productcost: req.body.productcost
	};
	sellers.push(new_seller);
	console.log(sellers);
	fs.writeFileSync(dataPath, JSON.stringify(sellers));
	res.redirect('/sellers/');
});

router.get('/add_seller', function(req, res, next) {
	res.render('add_seller', {seller:{}});
});

router.route('/:seller_id')
	.all(function(req, res, next){
		seller_id = req.params.seller_id;
		seller = lookupseller(seller_id);
		next();
	})
	.get(function(req,res,next){
		res.render('edit_seller', {seller: seller});
	})
	.post(function(req,res,next){
		res.send('Post for seller ' + seller_id);
	})
	.put(function(req,res,next){
		seller.name = req.body.fullname;
		seller.company = req.body.company;
		seller.email = req.body.email;
		seller.productname = req.body.productname;
		seller.productcost = req.body.productcost;


		fs.writeFileSync(dataPath, JSON.stringify(sellers));
		res.redirect('/sellers/');
	})
	.delete(function(req,res,next){
		for (var i = 0; i < sellers.length; i++) {
			if (sellers[i].id === parseInt(seller_id)) {
				sellers.splice(i, 1);
			}
		}
		//console.log(sellers);
		fs.writeFileSync(dataPath, JSON.stringify(sellers));
		res.send('Delete for seller ' + seller_id);
	});

module.exports = router;
