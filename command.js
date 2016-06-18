#!/usr/bin/env casperjs

var system = require('system');
var casper = require('casper').create({
  onError: (function(error){
    console.log("failure due to error: " + error)
    console.log(this.echo(casper.captureBase64('png')))
    casper.exit(1)
  })
});


var GOOGLE_USERNAME = system.env.GOOGLE_USERNAME;
var GOOGLE_PASSWORD = system.env.GOOGLE_PASSWORD;

if(!GOOGLE_USERNAME || !GOOGLE_PASSWORD) {
  console.log('Missing required env: GOOGLE_USERNAME or GOOGLE_PASSWORD')
  this.exit(1)
}

casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36');
casper.start('https://app.octoblu.com/');

casper.waitForText("Google+")

casper.then(function() {
  this.click('.auth__button--google');
})

casper.waitForSelector("#Email")

casper.then(function(){
  this.fill('#gaia_loginform', {
    'Email': GOOGLE_USERNAME
  })
  this.click("#next")
})

casper.waitForSelector("#Passwd")

casper.then(function(){
  this.fill('#gaia_loginform', {
    'Passwd': GOOGLE_PASSWORD
  })
  this.click("#signIn")
})

casper.waitForSelector("#challenge", function(){
  this.fill('#challenge', {
    'email': 'sqrtofsaturn@gmail.com'
  })
  this.capture("challenge.png")
  this.click("#submit")
}, function(){
  // Guess we're not getting challenged this time
  // This function has to exist to ignore the timeout error
});

casper.waitForText("dashboard", function(){
  this.echo("success");
  this.exit()
}, function(){
  console.log("failure")
  console.log(this.echo(casper.captureBase64('png')))
  this.exit(1)
})

casper.run();
