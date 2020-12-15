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

    const options = {
      method: id ? 'PUT' : 'POST',
      uri: id ? `https://api.sipgate.com/v2/contacts/${id}` : 'https://api.sipgate.com/v2/contacts',
      json: true,
      headers: {
        Authorization: `Bearer ${cfg.accessToken}`,
      },
      body: msg.data,
    };

    const response = await request(options);

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
      const contacts = response.body;
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
