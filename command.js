#!/usr/bin/env casperjs

var system = require('system');
var casper = require('casper').create();


var GOOGLE_USERNAME = system.env.GOOGLE_USERNAME;
var GOOGLE_PASSWORD = system.env.GOOGLE_PASSWORD;

if(!GOOGLE_USERNAME || !GOOGLE_PASSWORD) casper.die('Missing required env: GOOGLE_USERNAME or GOOGLE_PASSWORD')

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

casper.waitForText("dashboard", function(){
  this.echo("success");
  this.exit()
}, function(){
  this.die("failure")
})

casper.run();
