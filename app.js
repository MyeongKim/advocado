var path = require('path');
var Twit = require('twit');
var T = new Twit({
		consumer_key: 'iLE5MMmOwR90BlejYeyeUtxRT'
	, consumer_secret: 'CMfbxk0mPeK9fz3omhqpbwrHFCeRq98dLkDuV4ftYy0Mahuthr'
	, access_token: '769492250-WKyVbWlEYAjwqSjUlIpR472g8MO1ViTlcQ30hXM8'
	, access_token_secret: 'IeR27LE2dcbrV38ZuAU9KHXaA9kE2PX5nQOaSgT88j5y3'
});

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

// router
app.get('/', function (req, res) {
	res.render('index');
});

app.get('/book', function(req,res){
	res.render('book');
});

app.get('/list', function(req,res){
	res.render('index');
});

app.get('/book/:title', function(req,res){
	var title = req.params.title;
	res.render('bookInside', {title : title});
});

io.sockets.on('connection', function (socket) {
  // var stream = T.stream('statuses/filter', { track: 'happy' })
  // stream.on('tweet', function (tweet) {
  //   io.sockets.emit('stream',tweet.text);
  // });

	idSearch('FeFeFe2015');
	favoriteSearch('FeFeFe2015');
	keywordSearch('#나는페미니스트입니다');

	// var stream = T.stream('statuses/filter', { track: '나는바보다' });
	// stream.on('tweet', function (tweet) {
 //  		io.sockets.emit('hashTag', tweet.text);
	// });

	// search keyword from client
	socket.on('search', function(data){
		console.log("search arrived");
		console.log(data);
		search(data);
	});
});

function search(data){
	var type = data[1];
	if (type == "id_search"){

		idSearch(data[0]);
		favoriteSearch(data[0]);
	}else if (type = "keyword_search"){
		keywordSearch(data[0]);
	}else if(type = "favorite_search"){
	}else{
		console.log("invalid input type");
	}
};

function idSearch(value){
	T.get('statuses/user_timeline', { screen_name: value },  function (err, data, response) {
		var length = data.length;
		for ( i = length-1 ; i > 0 ; i--){
			io.sockets.emit('id_search', data[i].text);
		}
	});
};

//error
function favoriteSearch(value){
	// T.get('favorites/list', { screen_name: value, count: 20 }, function(err, data, response) {
	// 	if (data.length == undefined){
	// 		return;
	// 	} else{
	// 		var length = data.length;
	// 		for( i = length-1 ; i >= 0 ; i--){
	// 			if (data[i].text){
	// 				io.sockets.emit('favorites', data[i].text);
	// 			}
	// 		};
	// 	}
	// });
};

function keywordSearch(value){
	T.get('search/tweets', { q: value, count: 20 }, function(err, data, response) {
		for( i = 19 ; i > 0 ; i--){
			io.sockets.emit('keyword_search', data.statuses[i].text);
		}
	});
		// T.get('search/tweets', { q: '#'+value, count: 20 }, function(err, data, response) {
	// for( i = 19 ; i > 0 ; i--){
	// 	io.sockets.emit('hashtag_search', data.statuses[i].text);
	// }
	// console.log(data.statuses[1].text);
	// });
};

server.listen(4000);