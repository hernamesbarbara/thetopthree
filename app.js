/* 
 * Dependencies
 */
var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    http = require('http'),
    exphbs = require('express3-handlebars'),
    lessMiddleware = require('less-middleware'),
    _ = require('underscore'),
    mongojs = require('mongojs');
/*
 * Initiate Express
 */
var app = express()
    , db = mongojs(process.env.MONGO_URI || "mongodb://localhost/thetop3", ["users", "media"]);

/* 
 * App Configurations
 */
app.configure(function() {
    app.set('port', process.env.PORT || 5000);

    app.set('views', __dirname + '/views');

    app.set('view engine', 'html');
    app.engine('html', exphbs({
        defaultLayout: 'main',
        extname: '.html'
        //helpers: helpers
    }));
    app.enable('view cache');

    app.use(lessMiddleware({
        src: __dirname + '/public',
        compress: true,
        sourceMap: true
    }));
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(express.bodyParser());
    app.use(express.favicon());
    app.use(express.logger('dev')); 
    app.use(express.methodOverride());
    app.use(app.router);
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

/*
* Route for Index
*/
app.get('/', function(req, res) {
    var q = {media_format: "img"};

    if (req.query.date_emailed) {
        q.date_emailed = req.query.date_emailed;
    }

    db.media.distinct("date_emailed", function (err, dates) {
        dates = dates.sort();
        db.media.find(q, function(err, images) {
            displayable = []
            _.each(images,  function (img) {
                data_str = "data:image/png;base64,"+img.img_data
                record = {
                    src: data_str, 
                    id: img._id.toString(), 
                    week: img.date_emailed
                }
                displayable.push(record)
            });
            res.render('index', { images: displayable, dates: dates });
        });
    });
});

app.post('/image', function(req, res) {
    res.send({ status: "OK" });
});


/*
 * Routes for Robots/404
 */
app.get('/robots.txt', function(req, res) {
    fs.readFile(__dirname + "/robots.txt", function(err, data) {
        res.header('Content-Type', 'text/plain');
        res.send(data);
    });
});

app.get('*', function(req, res) {
    res.render('404');
});


http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});
