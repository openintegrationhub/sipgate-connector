![alpha](https://img.shields.io/badge/Status-Alpha-yellow.svg)

# Sipgate Connector

> Sipgate Connector for Open Integration Hub.


## Data model
This connector transforms to and from the sipgate contact data model, using these fields:

```json
{
   "id":"string",
   "name":"string",
   "family":"string",
   "given":"string",
   "picture":"string",
   "emails":[
      {
         "email":"string",
         "type":[
            "string"
         ]
      }
   ],
   "numbers":[
      {
         "number":"string",
         "type":[
            "string"
         ]
      }
   ],
   "addresses":[
      {
         "poBox":"string",
         "extendedAddress":"string",
         "streetAddress":"string",
         "locality":"string",
         "region":"string",
         "postalCode":"string",
         "country":"string"
      }
   ],
   "organization":[
      [
         "string"
      ]
   ],
   "scope":"string"
}
```

## Usage


1. register for the sipgate rest api v2
2. set redirect uri to https://app.yourservice.com/callback/oauth2
3. set contacts:read contacts:write addresses:read addresses:write
4. set register secret in secret service
5. add secret to flow step


## Actions

### upsertContact
This action will upsert a contact in Sipgate. If an ID is supplied, the connector will attempt to update an existing contact with this ID. If no ID is provided a new entry will be created instead.

## Triggers

### getContacts
This trigger will get all contacts from the associated Sipgate account and pass them forward. By default it will only fetch the first 100000 entries.

## Integrated Transformations

By default, this connector attempts to automatically transform data to and from the OIH Address Master Data model. If you would like to use your own transformation solution, simply set `skipTransformation: true` in the `fields` object of your flow configuration. Alternatively, you can also inject a valid, stringified JSONata expression in the `customMapping` key of the `fields` object, which will be used instead of the integrated transformation.
