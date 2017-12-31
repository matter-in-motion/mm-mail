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
  const template = mail.template;
  delete mail.template;
  const data = mail.data;
  delete mail.data;

  return new Promise((resolve, reject) => {
    if (this.templates && template) {
      let html
      try {
        html = this.templates.render(template, data);
      } catch (e) {
        return reject(e);
      }

      mail.html = html;
      if (!mail.subject) {
        const title = mail.html.match(/<title[^>]*>([^<]+)<\/title>/);
        if (title) {
          mail.subject = title[1];
        }
      }
    }

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
