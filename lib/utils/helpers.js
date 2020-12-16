/* eslint no-await-in-loop: "off" */
/* eslint consistent-return: "off" */

const request = require('request-promise').defaults({ simple: false, resolveWithFullResponse: true });

const secretServiceApiEndpoint = process.env.SECRET_SERVICE_ENDPOINT || 'https://secret-service.openintegrationhub.com';

// async function lookupContact(msg, cfg) {
//   try {
//     const options = {
//       method: 'GET',
//       uri: `https://api.sipgate.com/v2/contacts/${msg.metadata.recordUid}`,
//       json: true,
//       headers: {
//         Authorization: `Bearer ${cfg.accessToken}`,
//       },
//     };
//
//     const response = await request(options);
//
//     if (response.statusCode === 200) {
//       return String(response.body.id);
//     }
//
//     return false;
//   } catch (e) {
//     console.error(e);
//   }
// }

async function upsertContact(msg, cfg) {
  try {
    let id = false;
    if (msg.metadata && msg.metadata.recordUid) {
      // id = await lookupContact(msg, cfg);
      id = msg.metadata.recordUid;
    }

    const newMsg = {
      data: Object.assign({}, msg.data),
      metadata: Object.assign({}, msg.metadata),
    };
    if (id) newMsg.data.id = id;

    const options = {
      method: id ? 'PUT' : 'POST',
      uri: id ? `https://api.sipgate.com/v2/contacts/${id}` : 'https://api.sipgate.com/v2/contacts',
      json: true,
      headers: {
        Authorization: `Bearer ${cfg.accessToken}`,
      },
      body: newMsg.data,
    };

    if (cfg.devMode) console.log(options);

    let response = await request(options);

    if (cfg.devMode) {
      console.log(response.statusCode);
      console.log(response.text);
      console.log(response.body);
    }

    if (id && response.statusCode !== 200 && response.statusCode !== 201) {
      // Entry deleted or recordUid from other account
      // Trying normal insert
      console.log(`Entry ${id} not found inserting as new entry`);
      options.method = 'POST';
      options.uri = 'https://api.sipgate.com/v2/contacts';
      delete options.body.id;
      response = await request(options);
      if (cfg.devMode) {
        console.log(response.statusCode);
        console.log(response.text);
        console.log(response.body);
      }
    }

    // Upon success, return the new ID
    if (response.statusCode === 200 || response.statusCode === 201) {
      const newMeta = msg.metadata;
      newMeta.recordUid = String(response.body.id);
      return { metadata: newMeta };
    }
    return false;
  } catch (e) {
    console.error(e);
    return {};
  }
}

async function getContacts(cfg) { // , snapshot
  try {
    const options = {
      method: 'GET',
      uri: ' https://api.sipgate.com/v2/contacts',
      json: true,
      qs: {
        limit: 100000,
        offset: 0,
      },
      headers: {
        Authorization: `Bearer ${cfg.accessToken}`,
      },
    };

    const response = await request(options);

    if (response.statusCode === 200) {
      const contacts = response.body.items;
      // if(snapshot) contacts = contacts.filter(contact => new Date(contact.updated).getTime() > snapshot.lastUpdated);
      return contacts;
    }
    return [];
  } catch (e) {
    console.error(e);
    return [];
  }
}


async function getAccessToken(config) {
  try {
    if (config.accessToken) {
      return config.accessToken;
    }

    const response = await request({
      method: 'GET',
      uri: `${secretServiceApiEndpoint}/secrets/${config.secret}`,
      headers: {
        'x-auth-type': 'basic',
        authorization: `Bearer ${config.iamToken}`,
      },
      json: true,
    });

    const { value } = response.body;
    return value.accessToken;
  } catch (e) {
    console.log(e);
    return e;
  }
}


module.exports = {
  upsertContact, getContacts, getAccessToken, secretServiceApiEndpoint,
};
