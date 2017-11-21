# Matter In Motion. Mail resource extension

[![NPM Version](https://img.shields.io/npm/v/mm-mail.svg?style=flat-square)](https://www.npmjs.com/package/mm-mail)
[![NPM Downloads](https://img.shields.io/npm/dt/mm-mail.svg?style=flat-square)](https://www.npmjs.com/package/mm-mail)

This extension adds a __mail__ resource. `Mail` resource doesn't provide any public APIs. It uses [nodemailer](https://nodemailer.com/about/) to send emails.

## Usage

[Extensions installation intructions](https://github.com/matter-in-motion/mm/blob/master/docs/extensions.md)

## Settings

* __transport__ — as in [nodemailer transport options](https://nodemailer.com/smtp)
* __defaults__ — are the same options as below in the send method. `defaults` will be applied to all messages.
* __templates__ — optional, a name of the templates engine. Should be available as `templates.${templates}` unit.

## Controller Methods

### send(options)

For available options check [nodemailer message documentation](https://nodemailer.com/message/)

* **template** - template name that will be rendered with templates engine provided in the settings.
* **templateData** - data object that will be passed to the template.

License: MIT.
