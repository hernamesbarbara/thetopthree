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
    mongojs = require('mongojs'),
    moment = require('moment');

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
    db.media.distinct("date_emailed", function (err, dates) {
        dates = dates.sort();
        console.log(dates[0])
        if (req.query.date_emailed) {
            q = {media_format: 'img', date_emailed: req.query.date_emailed}
        }
        else {
            q = {media_format: 'img', date_emailed: dates[0]}
        }
        db.media.find(q, function(err, images) {
            var displayable = [];
            _.each(images,  function (img) {
                data_str = "data:image/png;base64,"+img.img_data
                record = {
                    src: data_str, 
                    id: img._id.toString(), 
                    date: img.date_emailed
                }
                displayable.push(record)
            });
            indices = _.zip(_.range(1, dates.length+1), dates)
            idx = _.indexOf(dates, req.query.date_emailed);
            prev = dates[idx - 1];
            next = dates[idx + 1];
            payload = {
                images: displayable, 
                pagination: indices.slice(Math.max(idx-5,0), Math.min(idx+5, indices.length)), 
                isfirst: dates[0] ==  req.query.date_emailed,
                islast: dates[-1] == req.query.date_emailed,
                current: moment(q.date_emailed).format('MMMM DD, YYYY'),
                next: next,
                prev: prev
            }
            res.render('index', payload);
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
