/* eslint prefer-destructuring: "off" */

function personFromOih(msg) {
  const firstName = msg.data.firstName || '';
  const lastName = msg.data.lastName || '';

  let photo = '';

  if (msg.data.photo && typeof msg.data.photo === 'string' && msg.data.photo.length > 0) {
    try {
      // eslint-disable-next-line no-unused-vars
      const test = Buffer.from(msg.data.photo, 'base64');
      photo = msg.data.photo;
    } catch (e) {
      console.log('Photo is not base64 image discarding');
    }
  }

  const contact = {
    name: `${firstName} ${lastName}`,
    family: lastName,
    given: firstName,
    picture: photo,
    emails: [],
    numbers: [],
    addresses: [],
    organization: [],
    scope: 'PRIVATE',
  };

  if (contact.picture === '') delete contact.picture;

  if (msg.data.contactData) {
    for (let i = 0; i < msg.data.contactData.length; i += 1) {
      const currentCD = msg.data.contactData[i];

      if (currentCD.type === 'email') {
        contact.emails.push({
          email: currentCD.value,
          type: [currentCD.description || 'string'],
        });
      } else if (
        currentCD.type === 'phone'
        || currentCD.type === 'mobile'
        || currentCD.type === 'fax'
      ) {
        contact.numbers.push({
          number: currentCD.value,
          type: [currentCD.description || 'string'],
        });
      }
    }
  }

  if (msg.data.addresses) {
    for (let i = 0; i < msg.data.addresses.length; i += 1) {
      const currentAdr = msg.data.addresses[i];
      contact.addresses.push({
        poBox: '',
        extendedAddress: currentAdr.description || '',
        streetAddress: `${currentAdr.street || ''} ${currentAdr.streetNumber || ''}`,
        locality: currentAdr.city || '',
        region: currentAdr.region || '',
        postalCode: currentAdr.zipcode || '',
        country: currentAdr.country || '',
      });
    }
  }

  if (msg.data.relations) {
    for (let i = 0; i < msg.data.relations.length; i += 1) {
      contact.organization.push([
        (msg.data.relations[i].label || ''),
      ]);
    }
  }

  if (contact.emails.length === 0) delete contact.emails;
  if (contact.addresses.length === 0) delete contact.addresses;
  if (contact.organization.length === 0) delete contact.organization;

  return { data: contact, metadata: msg.metadata };
}

module.exports = {
  personFromOih,
};
