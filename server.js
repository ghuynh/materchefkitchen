var http = require("http");
var url = require("url");
var qs = require("querystring");
var fs = require('fs');
// var $ = jQuery = require('jQuery');
// require('./jquery.csv.js');


var formOutput = '<html><body>'
    + '<h1>What to cook tonight - George Huynh\'s kitchen </h1>'
    + '<h2>Please provide data for fridges in CSV and JSON formats</h2>'
    + '<form method="post" action="." enctype="application/x-www-form-urlencoded"><fieldset>'
    + '<div><label for="fridgecsv">CSV DATA:</label><textarea  id="fridgecsv" name="fridgecsv" cols=40 rows=6></textarea></div>'
    + '<div><label for="fridgejson">JSON DATA:</label><textarea id="fridgejson" name="fridgejson" cols=40 rows=6></textarea></div>'
	+ '<div><input id="Post" type="submit" value="Post" /></div></fieldset></form></body></html>';
function start(route){
function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
	if(request.method == "GET") {
    		response.writeHead(200, {'Content-Type': 'text/html'});
	        response.end(formOutput);
	} else if (request.method == "POST"){

		var requestBody = "";
		request.on('data', function(data) {
			requestBody += data;

		});
		request.on('end', function() {

            try{
				var CSVdata = qs.parse(requestBody.fridgecsv);
				// $.csv.toArrays(csv, {}, function(err, data) {
					// for(var i=0, len=data.length; i<len; i++) {
					  // console.log(data[i]);
					// }
				  // });
  
  
			    var JSONdata = JSON.parse(requestBody.fridgejson);





                var ret = new Array();
                for (var prop in JSONdata.fridgejson){

                    var value = JSONdata.fridgejson[prop];
                    var showimg = value.image;
                    var drm = value.drm;
                    var episodeCount = value.episodeCount;
                    if (showimg && drm !== false && episodeCount > 0 ){
                         var ret1 = {"image": showimg.showImage, "slug": value.slug, "title": value.title};
                        ret.push((ret1));
                    }

                }

                var result = {'response' : ret};
                response.writeHead(200, {"Content-Type": "application/json"});
                response.write(JSON.stringify(result));
                response.end();

            } catch (e) {
                response.writeHead(400, {"Content-Type": "application/json"});
                var error = new Error("Could not decode request: JSON parsing failed");
                response.write(JSON.stringify({"error":  "Could not decode request: JSON parsing failed"}));
                response.end();

            }

		});
	}
    route(pathname);

}

http.createServer(onRequest).listen(process.env.PORT || 5000);
console.log("Server started and listening at " + process.env.PORT);
}
exports.start = start;


