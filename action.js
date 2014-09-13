var crypto = require('crypto');
var rsj = require('rsj');
var confidencial = require('confidencial-ni-node');
var request = require('request');
var config = require('./config');

module.exports.request = function() {
  rsj.r2j('http://www.confidencial.com.ni/feed', function(rows) {
    if (rows) {
      rows = JSON.parse(rows);
    }
    if (rows.length > 0) {
      rows.forEach(function(row) {
        var hash = crypto.createHash('md5').update(row.link).digest('hex');
        var apiUrl = config.api + 'entries/' + hash + '/exists';
        request(apiUrl, function(err, response, body) {
          var json = JSON.parse(body);
          if (json.exists) {
            console.log('This article exists');
          }
          else {
            confidencial.getArticle(row.link, function(resultData) {
              var apiUrl = config.api + 'entries/' + config['library_id'] + '/create';
              var image = '';
              if (resultData.images.length > 0) {
                image = resultData.images[0];
              }
              var form = {
                title: resultData.title,
                summary: row.summary,
                content: resultData.content,
                pubDate: new Date(),
                image: image,
                source: row.link
              }
              request.post(apiUrl, {form:form}, function (error, response, body) {
                var json = JSON.parse(body);
                if (json.error) {
                  console.log(json.error);
                }
                else {
                  console.log('Registro guardado con éxito');
                }
              });
            });
          }
        });
      });
    }
  });
}
