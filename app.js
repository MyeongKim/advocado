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
app.get('/', function (req, res) {
	res.render('index');
});

io.sockets.on('connection', function (socket) {
  // var stream = T.stream('statuses/filter', { track: 'happy' })
  // stream.on('tweet', function (tweet) {
  //   io.sockets.emit('stream',tweet.text);
  // });

	T.get('statuses/user_timeline', { screen_name: 'xxvet' },  function (err, data, response) {
		var length = data.length;
		for ( i = length-1 ; i > 0 ; i--){
			io.sockets.emit('stream', data[i].text);
		}
	});

	T.get('search/tweets', { q: '나는페미니스트입니다', count: 20 }, function(err, data, response) {
		for( i = 19 ; i > 0 ; i--){
			io.sockets.emit('hashTag', data.statuses[i].text);
		}
	})

	var stream = T.stream('statuses/filter', { track: 'love' });
	stream.on('tweet', function (tweet) {
  		io.sockets.emit('hashTag', tweet.text);
	});
	
	//관심글
	T.get('favorites/list', { screen_name: 'xxvet', count: 20 }, function(err, data, response) {
		for( i = 19 ; i >= 0 ; i--){
			io.sockets.emit('favorites', data[i].text);
		}
	})

});

server.listen(4000);