// Generated by CoffeeScript 1.9.0
var Config, Contact, Tag, WebDavAccount, async, cozydb, getImports;

Contact = require('../models/contact');

Config = require('../models/config');

Tag = require('../models/tag');

WebDavAccount = require('../models/webdavaccount');

async = require('async');

cozydb = require('cozydb');

getImports = function(callback) {
  return async.parallel([
    function(cb) {
      return Contact.all(cb);
    }, Config.getInstance, function(cb) {
      return cozydb.api.getCozyInstance(cb);
    }, function(cb) {
      return cozydb.api.getCozyTags(cb);
    }, function(cb) {
      return WebDavAccount.first(cb);
    }, Tag.all
  ], function(err, results) {
    var config, contacts, instance, locale, tagInstances, tags, webDavAccount;
    contacts = results[0], config = results[1], instance = results[2], tags = results[3], webDavAccount = results[4], tagInstances = results[5];
    locale = (instance != null ? instance.locale : void 0) || 'en';
    if (webDavAccount != null) {
      webDavAccount.domain = (instance != null ? instance.domain : void 0) || '';
    }
    return callback(null, "window.config = " + (JSON.stringify(config)) + ";\nwindow.locale = \"" + locale + "\";\nwindow.initcontacts = " + (JSON.stringify(contacts)) + ";\nwindow.tags = " + (JSON.stringify(tags)) + ";\nwindow.webDavAccount = " + (JSON.stringify(webDavAccount)) + ";\nwindow.inittags = " + (JSON.stringify(tagInstances)));
  });
};

module.exports = {
  index: function(req, res) {
    return getImports(function(err, imports) {
      if (err) {
        return res.error(500, 'An error occured', err);
      }
      return res.render('index.js', {
        imports: imports
      });
    });
  },
  setConfig: function(req, res) {
    return Config.set(req.body, function(err, config) {
      if (err) {
        return res.error(500, 'An error occured', err);
      }
      return res.send(config);
    });
  }
};
