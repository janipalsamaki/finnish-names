var express = require('express');
var csvtojson = require('csvtojson');
var _ = require('lodash');
var app = express();
var names;

app.set('port', (process.env.PORT || 5000));

loadJson('./data/names.csv');

app.get('/', function(request, response) {
  response.json(names);
});

app.get('/:name', function(request, response) {
  var index = _.findIndex(names, function(o) {
    return o.name.toLowerCase() == request.params.name.toLowerCase();
  });

  if (index == -1) {
    response.status(404).json({});
  } else {
    response.json(names[index]);
  }
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

/**
 * Loads and converts the csv file to in-memory JSON.
 *
 * @param csvFilePath Path to the csv file.
 */
function loadJson(csvFilePath) {
  var Converter = csvtojson.Converter;
  var converter = new Converter({delimiter: ';', headers: ["name", "count"]});

  // Assign the result on conversion completion.
  converter.fromFile(csvFilePath, function(err, result) {
    names = result;
  });
}

