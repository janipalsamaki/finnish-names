var express = require('express');
var csvtojson = require('csvtojson');
var _ = require('lodash');
var app = express();
var names;

app.set('port', (process.env.PORT || 5000));

loadJson(['./data/surnames.csv', './data/names-men.csv', './data/names-women.csv']);

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
 * @param csvFilePaths Paths to the csv files.
 */
function loadJson(csvFilePaths) {
  var Converter = csvtojson.Converter;
  var converter = new Converter({delimiter: ';', headers: ["name", "count"]});

  // Transform integers with spaces to actual integers.
  converter.transform = function(json, row, index) {
    if (typeof json['count'] != 'undefined' && !Number.isInteger(json['count'])) {
      var count = json['count'].replace(/ /g, "");
      json['count'] = parseInt(count);
    }
  };

  // Assign the result on conversion completion.
  csvFilePaths.forEach(function (csvFilePath) {
    converter.fromFile(csvFilePath, function(err, result) {
      if (names) {
        names.concat(result);
      } else {
        names = result;
      }
    });
  });
}

