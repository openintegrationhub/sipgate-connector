/* eslint prefer-destructuring: "off" */

function personToOih(contact) {
  let person;

  const metadata = {
    recordUid: String(contact.id),
  };

  if ('given' in contact && 'family' in contact) {
    person = {
      firstName: contact.given,
      lastName: contact.family,
      contactData: [],
      addresses: [],
      relations: [],
    };
  } else {
    const names = contact.name.split(' ');
    person = {
      firstName: names[0],
      lastName: (names.length > 1) ? names[names.length - 1] : '',
      contactData: [],
      addresses: [],
      relations: [],
    };
  }

  if ('picture' in contact && contact.picture !== null) {
    person.photo = contact.picture;
  }

  if (contact.emails && Array.isArray(contact.emails)) {
    const length = contact.emails.length;
    for (let i = 0; i < length; i += 1) {
      person.contactData.push({
        type: 'email',
        value: contact.emails[i].email,
        description: (Array.isArray(contact.emails[i].type) ? contact.emails[i].type.join(',') : String(contact.emails[i].type)),
      });
    }
  }

  if (contact.numbers && Array.isArray(contact.numbers)) {
    const length = contact.numbers.length;
    for (let i = 0; i < length; i += 1) {
      person.contactData.push({
        type: 'phone',
        value: contact.numbers[i].number,
        description: (Array.isArray(contact.numbers[i].type) ? contact.numbers[i].type.join(',') : String(contact.numbers[i].type)),
      });
    }
  }

  if (contact.addresses && Array.isArray(contact.addresses)) {
    const length = contact.addresses.length;
    for (let i = 0; i < length; i += 1) {
      let streetParts = [];
      let street = '';
      let streetNumber = '';
      if (contact.addresses[i].streetAddress) {
        streetParts = contact.addresses[i].streetAddress.match(/^([^0-9]+)(.*?)$/u);
        if (streetParts) {
          street = streetParts[1].trim();
          streetNumber = streetParts[2].trim();
        }
      }
      person.addresses.push({
        street,
        streetNumber,
        // unit: ,
        zipcode: contact.addresses[i].postalCode || '',
        city: contact.addresses[i].locality || '',
        // district: ,
        region: contact.addresses[i].region || '',
        country: contact.addresses[i].country || '',
        // countryCode: ,
        // primaryContact: ,
        description: contact.addresses[i].extendedAddress || '',
      });
    }
  }

  if (contact.organization && Array.isArray(contact.organization)) {
    const length = contact.organization.length;
    for (let i = 0; i < length; i += 1) {
      person.relations.push({
        type: 'PersonToOrganization',
        label: 'Employee',
        partner: {
          name: (Array.isArray(contact.organization[i]) ? contact.organization[i][0] : String(contact.organization[i])),
        },
      });
    }
  }

  return { data: person, metadata };
}

module.exports = {
  personToOih,
};
