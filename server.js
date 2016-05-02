var express = require('express');
var app = express();
var mongoose = require('mongoose');
var assert = require('assert');
var MONGODBURL = 'mongodb://localhost/test';
var kittySchema = require('./models/kitty');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

app.set('port', 8099);
app.set('json spaces', 40);

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());

app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    return method;

  }
}))



mongoose.connect(MONGODBURL);

var restaurantSchema = mongoose.Schema({
	
	name:String,
	cuisine:String,
	building:String,
	street:String,
	zipcode:String,
	lon:String,
	lat:String,
	borough:String,
	restaurant_id:String
});

var Restaurants = mongoose.model('Restaurant', restaurantSchema, 'restaurants');
mongoose.connection;


app.set('view engine', 'ejs');

app.get('/', function(req,res) {
    res.sendFile(__dirname + '/public/index.html');  
});


//----------------CREATE--------------------------------------------------------

app.get('/create', function(req,res) {
	res.render('create');
});

app.post('/create', function(req,res) {
	console.log("Adding new Restaurant: " + req.body.name);
	var restaurant = new Restaurants({

	name:req.body.name,
	cuisine:req.body.cuisine,
	building:req.body.building,
	street:req.body.street,
	zipcode:req.body.zipcode,
	lon:req.body.lon,
	lat:req.body.lat,
	borough:req.body.borough,
	restaurant_id:req.body.restaurant_id


	});
	
	restaurant.save(function(err, result){

	    if ( err ) throw err;
	    res.json({

	      messaage:"Successfully added restaurant",

	      restaurant:result

	    });

	  });

	});

//------------------END OF CREATE---------------------------------------------------


//------------------LIST------------------------------------------------------------



app.get('/list', function(req,res) {
	Restaurants.find({}, function(err, result){

	if  ( err ) throw err;
		
	res.json(result);

	});


});


app.get('/listOne', function(req,res) {
	res.render('listOne');
	});


app.post('/listOne', function(req,res) {
    
    var restaurant_id = req.body.restaurant_id;
	
	Restaurants.find({restaurant_id}, function(err, result){

	if  ( err ) throw err;
	
 	res.json(result);

	});


});


//-----------------END OF LIST------------------------------------------------------


//----------------UPDATE------------------------------------------------------------

app.get('/update', function(req,res) {
	res.render('update');
});


app.put('/update', function(req, res) {
    var restaurant_id = req.body.restaurant_id;

Restaurants.findOne({restaurant_id: restaurant_id}, function(err, result){

    if ( err ) throw err;

    if(!result){

      res.json({

        message:"Not Success.",

      });

    }


    result.name   = req.body.name;
    result.cuisine  = req.body.cuisine;
    result.building = req.body.building;
    result.street = req.body.street;
    result.zipcode = req.body.zipcode;
    result.lon = req.body.lon;
    result.lat = req.body.lat;
    result.borough = req.body.borough;

 

    result.save(function(err, result){

      if ( err ) throw err;

      res.json({

        message:"Successfully updated the Restaurant",

         restaurant:result

      });
    });

 

  });


});


//------------------END OF UPDATE---------------------------------------------------


//------------------DELETE---------------------------------------------------------


app.get('/delete', function(req,res) {
	res.render('delete');
});



app.delete('/delete', function(req,res) {
	

	Restaurants.findOneAndRemove({restaurant_id : req.body.restaurant_id}, function(err, result){

        res.json({

        message: "Successfully deleted the restaurant",

        restaurant: result

      });

  });

});



/*
app.post('/delete', function(req,res) {

	var restaurant_id = req.body.restaurant_id;

	Restaurants.findOneAndRemove({restaurant_id: restaurant_id}, function(err, result){

        res.json({

        message: "Successfully deleted the restaurant",

        restaurant: result

      });

  });

});

*/

//------------------END OF DELETE---------------------------------------------







app.listen(app.get('port'), function(){

 console.log('Server up: http://localhost:' + app.get('port'));

});





