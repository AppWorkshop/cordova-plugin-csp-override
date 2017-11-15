# Cordova Content-Security-Policy Override

Allows the override of Content Security Policy `<meta>` element for cordova apps.

This simple little plugin 
just rewrites the ```META``` tag in your cordova build's ```www/index.html```
file.

### Installation

For cordova:

```
cordova plugin add cordova-plugin-csp-override
```

For meteor:

```
meteor add cordova:cordova-plugin-csp-override@1.0.0
```

### Usage

Just add a preference in your app's `config.xml` , containing the complete string you want your Content-Security-Policy `<meta>` element to be rewritten to (i.e. the attribute value).

```xml
<preference name="CONTENT_SECURITY_POLICY" value="* * 'self' default-src * data: blob: 'unsafe-inline' 'unsafe-eval' ws: wss: cdvfile: file: ;"/>
```

Or in meteor's mobile-config.js :

```js
App.setPreference("CONTENT_SECURITY_POLICY","* * 'self' default-src * data: blob: 'unsafe-inline' 'unsafe-eval' ws: wss: cdvfile: file: ;");
```