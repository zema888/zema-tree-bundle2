var concat = require('concat-files');
var fs = require('file-system');
const cheerio = require('cheerio');
const distPath = './dist/angular-tree/';

fs.readFile(distPath + 'index.html', 'utf8', function(err, contents) {
    const $ = cheerio.load(contents);
    var files = [];
    $('body script').each(function (key, el) {
        if (el && el.attribs && el.attribs.src) {
            files.push(distPath + el.attribs.src);
        }
    });
    console.log('In index.html found files: ', files.join(', '));
    if (files.length > 0) {
        concat(files, '../public/js/app.js', function (err) {
            if (err) throw err;
            console.log('done');
        });
    }

});

fs.copyFile(distPath + 'styles.css', '../public/css/styles.css', (err) => {
    if (err) throw err;
    console.log(distPath + 'styles.css was copied to ../public/css/styles.css');
});
