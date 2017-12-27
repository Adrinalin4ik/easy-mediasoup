const browserify = require('browserify');
const fs = require('fs');
const request = require('request');
const uglify = require('uglify-js');

const bundle = browserify({ standalone: 'EasyMediasoup' });
bundle.add('./es5-bundle/index');
bundle.bundle(function (err, source) {
  if (err) {
    console.error(err);
  }
  fs.writeFileSync('dist/easy-mediasoup.bundle.js', source);
  // fs.writeFileSync('dist/easy-mediasoup.bundle.min.js', uglify.minify('dist/easy-mediasoup.bundle.js'));

  // uglify.minify({"dist/easy-mediasoup.bundle.js": "compiled code"}, {
  //   sourceMap: {
  //       content: "content from compiled.js.map",
  //       url: "minified.js.map"
  //   }
  // })
  // const adapter = fs.readFileSync('node_modules/webrtc-adapter/out/adapter.js').toString();
  // fs.writeFileSync('out/simplewebrtc-with-adapter.bundle.js', `${adapter}\n${source}`);
});
//https://skalman.github.io/UglifyJS-online/