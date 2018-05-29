var concat = require('concat-files');
concat([
    './dist/runtime.js',
    './dist/polyfills.js',
    './dist/main.js'
], '../public/js/app.js', function(err) {
    if (err) throw err;
    console.log('done');
});