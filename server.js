var express = require('express');
var app = express();
app.use(express.static('public'));
var server = app.listen(7080, function() {
    console.log('Listening on port %d', server.address().port);
});