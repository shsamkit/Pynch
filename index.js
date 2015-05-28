var express = require('express');
var app = express();
var cool = require('cool-ascii-faces');
var YT = require('./sources/YouTubeAPI.js');
var user = null;
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.statusCode = 302;
  response.setHeader("Location", YT.YouTubeAuth());
  response.end();
});

app.get('/oauth2callback', function(request, response) {
	YT.YouTubeToken(request.query.code,function(err, result){
      if(err){
      	response.send(500,result);
      } else {
      	user=result;  
        response.statusCode = 302;
		response.setHeader("Location", "http://localhost:5000/user");   
		response.end();
      }
  	})
    
});

app.get('/user', function(request, response) {
	YT.YouTubeGetPlaylist(user,function(error,result){
	  if(error) {
	  	response.send(result);
	  } else { 
	  	response.send(result);
	  }	
	})
	
});

app.get('/callGoogle', function(req, res){
  YT.invokeAndProcessGoogleResponse(function(err, result){
    if(err){
      res.send(500, { error: 'something blew up' });
    } else {
      res.send(result);
    }
  });
});




app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
