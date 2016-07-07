#!/usr/bin/env casperjs

var system  = require('system');
var helpers = require('./helpers');
var Casper  = require('casper');
var casper  = helpers.buildCasper(Casper, 'sentinel-google');

var GOOGLE_USERNAME = system.env.GOOGLE_USERNAME;
var GOOGLE_PASSWORD = system.env.GOOGLE_PASSWORD;

if(!GOOGLE_USERNAME || !GOOGLE_PASSWORD) {
  console.log('Missing required env: GITHUB_USERNAME or GITHUB_PASSWORD')
  this.exit(1)
}

helpers.thenWithErrors(casper, function() {
  casper.click('.auth__button--google');
})

casper.waitForSelector("#Email");

helpers.thenWithErrors(casper, function() {
  casper.fill('#gaia_loginform', {
    'Email': GOOGLE_USERNAME
  });
  casper.click("#next");
})

casper.waitForSelector("#Passwd")

helpers.thenWithErrors(casper, function() {
  casper.fill('#gaia_loginform', {
    'Passwd': GOOGLE_PASSWORD
  });
  casper.click("#signIn");
})

casper.waitForSelector("#challenge", function(){
  helpers.reportErrors(casper, function(){
    casper.fill('#challenge', {
      'email': 'sqrtofsaturn@gmail.com'
    });
    casper.capture("challenge.png");
    casper.click("#submit");
  });
}, function(){
  // Guess we're not getting challenged this time
  // This function has to exist to ignore the timeout error
});

casper.waitForSelector("#submit_approve_access", function(){
  helpers.reportErrors(casper, function(){
    casper.click('#submit_approve_access');
  });
}, function(){
  // Guess we don't have to approve the app this time
  // This function has to exist to ignore the timeout error
});

helpers.assertOnOctobluDashboard(casper);
helpers.thenWithErrors(casper, function(){
  helpers.logout(casper);
});
helpers.thenWithErrors(casper, function(){
  casper.echo("success");
  casper.exit(0);
})

casper.run();
