'use strict';
const Promise = require('bluebird');
const nodemailer = require('nodemailer');

const Controller = function() {};

Controller.prototype.__init = function(units) {
  this.logger = units.require('core.logger').get('mail');
  const settings = units.require('core.settings').require('mail');
  this.defaults = settings.defaults;
  this.transport = nodemailer.createTransport(settings.transport);

  if (settings.templates) {
    this.templates = units.require(`templates.${settings.templates}`);
  }
};

Controller.prototype.send = function(options) {
  const mail = Object.assign({}, this.defaults, options);
  const template = options.template;
  delete mail.template;
  const data = options.data;
  delete mail.data;

  if (this.templates && template) {
    mail.html = this.templates.render(template, data);

    if (!mail.subject) {
      mail.subject = mail.html.match(/<title[^>]*>([^<]+)<\/title>/)[1];
    }
  }

  return new Promise((resolve, reject) => {
    this.transport.sendMail(mail, (error, info) => {
      if (error) {
        this.logger.error({ error }, 'Mail send error')
        return reject(error);
      }
      resolve(info);
    });
  })
};

module.exports = Controller;
