/* eslint no-param-reassign: "off" */


const { transform } = require('@openintegrationhub/ferryman');
const { upsertContact } = require('./../utils/helpers');
const { personFromOih } = require('../transformations/personFromOih');

/**
 * This method will be called from OIH platform providing following data
 *
 * @param {Object} msg - incoming message object that contains ``data`` with payload
 * @param {Object} cfg - configuration that is account information and configuration field values
 */
async function processAction(msg, cfg) {
  try {
    if (!cfg || !cfg.accessToken) {
      throw new Error('No access token!');
    }

    const transformedMessage = transform(msg, cfg, personFromOih);

    const response = await upsertContact(transformedMessage, cfg);


    this.emit('data', response);
  } catch (e) {
    console.error('ERROR: ', e);
    this.emit('error', e);
  }
}

module.exports = {
  process: processAction,
};
