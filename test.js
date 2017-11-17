'use strict';
const fs = require('fs');
const test = require('ava');
const nodemailer = require('nodemailer');
const createApp = require('mm-test').createApp;
const extension = require('./index');
process.env.NODE_ENV = 'production';

let port = 0;

const getMailController = mailSettings => nodemailer
  .createTestAccount()
  .then(account => {
    const app = createApp({
      extensions: [
        'http',
        'nunjucks',
        extension
      ],

      http: {
        port: 3000 + port++,
        host: '0.0.0.0'
      },

      nunjucks: {
        path: './'
      },

      mail: Object.assign(mailSettings || {}, {
        transport: {
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass
          }
        }
      })
    });

    return app.units.require('resources.mail.controller');
  });


test.before(() => new Promise((resolve, reject) => {
  fs.writeFile('template.html', '<html><title>🚀 Subject</title><body>{{ body }}</body></html>', err => {
    if (err) {
      return reject(err);
    }

    resolve();
  })
}));

test.after.always(() => new Promise((resolve, reject) => {
  fs.unlink('template.html', err => {
    if (err) {
      return reject(err);
    }

    resolve();
  });
}));

test('sends plain text email', t => getMailController()
  .then(ctrl => ctrl.send({
    from: 'Sender Name <sender@test.com>',
    to: 'Recipient <recipient@test.com>',
    subject: '🚀 Subject',
    text: 'Hello to myself!'
  }))
  .then(info => t.truthy(info.messageId))
);

test('sends plain text with defaults email', t => getMailController({
  defaults: {
    from: 'Sender Name <sender@test.com>',
    subject: '🚀 Subject'
  }
})
  .then(ctrl => ctrl.send({
    to: 'Recipient <recipient@test.com>',
    text: 'Hello to myself!'
  }))
  .then(info => t.truthy(info.messageId))
);

test('sends html template with defaults email', t => getMailController({
  templates: 'nunjucks',
  defaults: {
    from: 'Sender Name <sender@test.com>'
  }
})
  .then(ctrl => ctrl.send({
    to: 'Recipient <recipient@test.com>',
    template: 'template.html',
    data: { body: 'Hello to myself!' }
  }))
  .then(info => {
    console.log('Template mail preview: ' + nodemailer.getTestMessageUrl(info));
    t.truthy(info.messageId);
  })
);

