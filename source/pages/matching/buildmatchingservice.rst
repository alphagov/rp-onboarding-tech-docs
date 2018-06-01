.. _buildmatchingservice:

Build a matching service
======================================

A matching service is is made up of:

- Matching Service Adapter (MSA) provided by GOV.UK Verify
- Local Matching Service built by you

You must host both the MSA and the Local Matching Service on your own infrastructure.

.. figure:: ../ms/matchingservice.svg
     :alt: Diagram showing that a matching service is composed of a MSA and a local matching service.


Matching Service Adapter
--------------------------------------

The Matching Service Adapter (MSA) is a software tool supplied free of charge by the GOV.UK Verify team. It simplifies communication between your Local Matching Service and the GOV.UK Verify Hub.

Follow the :ref:`documentation to install, configure and test the Matching Service Adapter <msaUse>`.

.. _localmatchingservice:

Local Matching Service
--------------------------------------

A Local Matching Service helps you to find a match between a user’s verified identity and a record in your existing database(s). You must build your own Local Matching Service and host it on your own infrastructure.

As well as following this guidance, you can refer to the `example Local Matching Service built by the GOV.UK Verify team <https://github.com/alphagov/verify-local-matching-service-example>`_. It uses a `simplified version of a matching strategy from the Department of Work and Pensions (DWP) <https://github.com/alphagov/verify-local-matching-service-example/blob/master/docs/architecture-decisions/0003-we-will-follow-dwps-proposed-strategy.org>`_.

You can also use a `matching service test tool built by the GOV.UK Verify team <https://github.com/alphagov/verify-matching-service-adapter/tree/master/verify-matching-service-test-tool>`_ to make sure your Local Matching Service can:

- handle matching datasets
- find and match records correctly
- handle matching failures

.. _RespondJSONmr:

.. rubric:: Respond to JSON matching requests

Your service must respond to JSON matching requests from the Matching Service Adapter (MSA). The MSA makes requests to the URLs specified in the :ref:`YAML configuration file <yamlfile>`:

* ``localMatchingService:`` ``matchUrl:``
* ``localMatchingService:`` ``accountCreationUrl:`` (if you're :ref:`creating new user accounts <createnewaccounts>` when a match is not found)

The MSA sends one matching request for both Cycle 0 and Cycle 1 to your local matching service. Below is a formatted example:

::

  {
      "hashedPid": "8a5db0ad424efe4e09622cc4a876cc4c338558384752b483ff69dda4dca1ef04",
      "levelOfAssurance": "LEVEL_2",
      "matchId": "default-request-id",
      "matchingDataset": {
          "addresses": [
              {
                  "fromDate": "1980-05-24T00:00:00.000Z",
                  "internationalPostCode": "GB1 2PP",
                  "lines": [
                      "123 George Street"
                  ],
                  "postCode": "GB1 2PP",
                  "toDate": "2005-05-14T00:00:00.000Z",
                  "uprn": "7D68E096-5510-B3844C0BA3FD",
                  "verified": true
              },
              {
                  "fromDate": "2005-05-14T00:00:00.000Z",
                  "internationalPostCode": "GB1 2PF",
                  "lines": [
                      "10 George Street"
                  ],
                  "postCode": "GB1 2PF",
                  "uprn": "833F1187-9F33-A7E27B3F211E",
                  "verified": true
              }
          ],
          "dateOfBirth": {
              "value": "1980-05-24",
              "verified": true
          },
          "firstName": {
              "value": "Joe",
              "verified": true
          },
          "gender": {
              "value": "MALE",
              "verified": true
          },
          "middleNames": {
              "value": "Bob Rob",
              "verified": true
          },
          "surnames": [
              {
                  "from": "1980-05-24T00:00:00.000Z",
                  "to": "2010-01-20T00:00:00.000Z",
                  "value": "Fred",
                  "verified": true
              },
              {
                  "from": "2010-01-20T00:00:00.000Z",
                  "value": "Dou",
                  "verified": true
              }
          ]
      }
  }

Your local matching service first runs cycle 0. If no match is found, it runs cycle 1. It then sends either a ``match`` or a ``no-match`` response to the MSA. This response corresponds to step 6 in the :ref:`SAML message flow <samlWorks>`.

Below is a ``match`` response (it should have the status code ``200 OK``):

::

  {"result":"match"}

Below is a ``no-match`` response (it should have the status code ``200 OK``):

::

  {"result":"no-match"}


If you're using cycle 3 and your local matching service returned a ``no-match`` response to the MSA, the MSA sends a cycle 3 matching request.  Below is a formatted example:

::

  {
      "cycle3Dataset": {
          "attributes": {
              "drivers_licence": "4C22DA90A18A4B88BE460E0A3D975F68"
          }
      },
      "hashedPid": "8a5db0ad424efe4e09622cc4a876cc4c338558384752b483ff69dda4dca1ef04",
      "levelOfAssurance": "LEVEL_2",
      "matchId": "default-request-id",
      "matchingDataset": {
          "addresses": [
              {
                  "fromDate": "1980-05-24T00:00:00.000Z",
                  "internationalPostCode": "GB1 2PP",
                  "lines": [
                      "123 George Street"
                  ],
                  "postCode": "GB1 2PP",
                  "toDate": "2005-05-14T00:00:00.000Z",
                  "uprn": "7D68E096-5510-B3844C0BA3FD",
                  "verified": true
              },
              {
                  "fromDate": "2005-05-14T00:00:00.000Z",
                  "internationalPostCode": "GB1 2PF",
                  "lines": [
                      "10 George Street"
                  ],
                  "postCode": "GB1 2PF",
                  "uprn": "833F1187-9F33-A7E27B3F211E",
                  "verified": true
              }
          ],
          "dateOfBirth": {
              "value": "1980-05-24",
              "verified": true
          },
          "firstName": {
              "value": "Joe",
              "verified": true
          },
          "gender": {
              "value": "MALE",
              "verified": true
          },
          "middleNames": {
              "value": "Bob Rob",
              "verified": true
          },
          "surnames": [
              {
                  "from": "1980-05-24T00:00:00.000Z",
                  "to": "2010-01-20T00:00:00.000Z",
                  "value": "Fred",
                  "verified": true
              },
              {
                  "from": "2010-01-20T00:00:00.000Z",
                  "value": "Dou",
                  "verified": true
              }
          ]
      }
  }

Your local matching service sends either a ``match`` or a ``no-match`` response to the MSA. This response corresponds to step 6 in the :ref:`SAML message flow <samlWorks>`.

If no match is found on cycles 0, 1 and 3, you can :ref:`create a new account<createnewaccounts>` for the user.

.. _JSONschema:

.. rubric:: Use the universal JSON matching schema

Below is the universal `JSON schema <http://json-schema.org/>`_ for a matching request. You can use this schema to validate incoming matching requests and as a reference when developing your local matching service.

The universal JSON matching schema will be used to represent both Verify  identities and European identities. This schema only applies if your :ref:`MSA is configured to use European identities<msaeidas>`. Otherwise your MSA will use the :ref:`legacy JSON matching schema<legacyJSONschema>`.

::

  {
   "properties": {
     "cycle3Dataset": {
       "properties": {
         "attributes": {
           "additionalProperties": {
             "type": "string"
           },
           "type": "object"
         }
       },
       "type": "object"
     },
     "hashedPid": {
       "type": "string"
     },
     "levelOfAssurance": {
       "enum": [
         "LEVEL_1",
         "LEVEL_2",
         "LEVEL_3",
         "LEVEL_4"
       ]
     },
     "matchId": {
       "type": "string"
     },
     "matchingDataset": {
       "properties": {
         "addresses": {
           "items": {
             "properties": {
               "from": {
                 "format": "date-time"
               },
               "internationalPostCode": {
                 "type": "string"
               },
               "lines": {
                 "items": {
                   "type": "string"
                 },
                 "type": "array"
               },
               "postCode": {
                 "type": "string"
               },
               "to": {
                 "format": "date-time"
               },
               "uprn": {
                 "type": "string"
               },
               "verified": {
                 "type": "boolean"
               }
             },
             "type": "object"
           },
           "type": "array"
         },
         "dateOfBirth": {
           "properties": {
             "from": {
               "format": "date-time"
             },
             "to": {
               "format": "date-time"
             },
             "value": {
               "format": "date"
             },
             "verified": {
               "type": "boolean"
             }
           },
           "type": "object"
         },
         "firstName": {
           "properties": {
             "from": {
               "format": "date-time"
             },
             "to": {
               "format": "date-time"
             },
             "value": {
               "type": "string"
             },
             "nonLatinScriptValue": {
               "type": "string"
             },
             "verified": {
               "type": "boolean"
             }
           },
           "type": "object"
         },
         "gender": {
           "properties": {
             "from": {
               "format": "date-time"
             },
             "to": {
               "format": "date-time"
             },
             "value": {
               "enum": [
                 "FEMALE",
                 "MALE",
                 "NOT_SPECIFIED"
               ]
             },
             "verified": {
               "type": "boolean"
             }
           },
           "type": "object"
         },
         "middleNames": {
           "properties": {
             "from": {
               "format": "date-time"
             },
             "to": {
               "format": "date-time"
             },
             "value": {
               "type": "string"
             },
             "verified": {
               "type": "boolean"
             }
           },
           "type": "object"
         },
         "surnames": {
           "items": {
             "properties": {
               "from": {
                 "format": "date-time"
               },
               "to": {
                 "format": "date-time"
               },
               "value": {
                 "type": "string"
               },
               "nonLatinScriptValue": {
                 "type": "string"
               },
               "verified": {
                 "type": "boolean"
               }
             },
             "type": "object"
           },
           "type": "array"
         }
       },
       "type": "object",
       "required": ["dateOfBirth", "firstName", "surnames"]
     }
   },
   "type": "object",
   "required": [ "matchId", "levelOfAssurance", "hashedPid", "matchingDataset" ]
  }
