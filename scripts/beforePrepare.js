module.exports = function(context) {
  var fs = context.requireCordovaModule('fs');
  var path = context.requireCordovaModule('path');
  var cordova_util = context.requireCordovaModule('cordova-lib/src/cordova/util.js');
  var ConfigParser = context.requireCordovaModule('cordova-common').ConfigParser;

  var projectRoot = context.opts.projectRoot;

  var configXml = cordova_util.projectConfig(projectRoot);
  var config = new ConfigParser(configXml);
  var projectName = config.name();

  var iOSHTMLPath = path.join(context.opts.projectRoot, 'platforms/ios/www/application/index.html');
  var androidHTMLPath = path.join(context.opts.projectRoot, 'platforms/android/assets/www/application/index.html');
  var mainIndexHTMLPath = path.join(context.opts.projectRoot, 'www/application/index.html');

  var cspOverridePreference = config.getPreference("CONTENT_SECURITY_POLICY") || "default-src * data: blob: 'unsafe-inline' 'unsafe-eval' ws: wss:;";  

  var oldMetaPattern = '  \<meta http-equiv="Content-Security-Policy" [^\n]*';

  var data = fs.readFileSync(mainIndexHTMLPath, {'encoding': 'utf8'});

  var oldMetaRegexp = new RegExp(oldMetaPattern, 'i');
  var newmeta = `<meta http-equiv="Content-Security-Policy" content="${cspOverridePreference}">`;

  if (oldMetaRegexp.test(data)) {
    var newdata = data.replace(oldMetaRegexp, newmeta);

    fs.writeFileSync(mainIndexHTMLPath, newdata);

    console.log(context.opts.plugin.id + ' updating META tag for file ' + mainIndexHTMLPath);

  } else {
    // no meta tag found. So we'll add one.
    // first find the head.
    var headpattern = '<head>';
    var headregexp = new RegExp(headpattern, 'i');
    if (headregexp.test(data)) {
      // replace <head> with <head>\n<meta....>
      var newdata = data.replace(headregexp, `${headpattern}\n${newmeta}`);
      
      fs.writeFileSync(mainIndexHTMLPath, newdata);
    } 
  }

  // if (fs.existsSync(iOSHTMLPath)) {
  //   data = fs.readFileSync(iOSHTMLPath, {'encoding': 'utf8'});
  //   newdata = data.replace(oldMetaRegexp, newmeta);
  //   fs.writeFileSync(iOSHTMLPath, newdata);
  //   console.log(context.opts.plugin.id + ' updating META tag for file ' + iOSHTMLPath);

  // }
  // if (fs.existsSync(androidHTMLPath)) {
  //   data = fs.readFileSync(androidHTMLPath, {'encoding': 'utf8'});
  //   newdata = data.replace(oldMetaRegexp, newmeta);
  //   fs.writeFileSync(androidHTMLPath, newdata);
  //   console.log(context.opts.plugin.id + ' updating META tag for file ' + androidHTMLPath);

  // }
}