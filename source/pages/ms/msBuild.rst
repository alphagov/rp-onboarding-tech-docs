.. _msBuild:

Build a local matching service
==============================

.. warning:: This documentation is out of date. We have published `new technical documentation <https://www.docs.verify.service.gov.uk>`_.

You must build a local matching service and host it on your own infrastructure.

Even if your service doesn’t need to perform matching, you must still build a local matching service because it also:

* creates the :ref:`hashed persistent identifier <gloss_hashpid>`
* creates and signs the final assertion sent to your service - for more information, see :ref:`samlWorks`
* acts as the :ref:`trust anchor <gloss_trustanchor>` for your service because the final assertion is created in your service's security domain

As well as following this guidance, you can refer to the `example local matching service <https://github.com/alphagov/verify-local-matching-service-example>`_ built by the Verify team. It uses a simplified version of a matching strategy from DWP.

You can also use a `matching service test tool built by Verify <https://github.com/alphagov/verify-matching-service-adapter/tree/master/verify-matching-service-test-tool>`_ to make sure your local matching service can:

* handle matching datasets
* find and match records correctly
* handle matching failures

.. _ms_strat:

Define your matching strategy
-----------------------------

A matching strategy defines the most efficient and effective way of matching assured identities to your service records. The strategy depends on the quality and completeness of available data sources and the types of evidence users can provide.

A local matching service carries out a risk-based match to find the local record. Exact matching of identity data is rarely possible for many reasons:

* transcription errors
* spelling mistakes
* incorrect data in your service's data sources, for example, if someone has moved house but not informed the service
* use of shortened names or nicknames which refer to the same person, for example, William Smith, Bill Smith and David William Smith

Your local matching service must be able to handle these issues. You may decide to:

* widen the initial query to make sure that relevant records are not missed, then narrow the query on the results to make sure false positives are not returned; for example, search for last name, date of birth, and postcode, then run further matching on the results and apply a confidence score
* try synonym matching against combinations of first name and last name, possibly transposing them to maximise the chances of finding a match

Matching considerations
-----------------------

When you define your matching strategy you need to:

* prepare for matching with customer data aggregation and data cleansing
* define the confidence level required for a successful match and how to score the confidence level, for example:

  * 100% match confidence means that all elements from the matching dataset fully match the local record
  * 80% match confidence might mean that the first name, last name, and date of birth match, but the address is showing a mismatch


* define the rules for successful matching, which may include what to do with:

  * synonyms for first names, for example, **William** and **Bill**
  * transpositions of multiple part names, for example, **Anna-Marie**, **Jane** and **Anna, Marie-Jane**
  * transpositions of errors of day and month in the date of birth, for example, **04/10/78** and **10/04/78**

* define the level of 'fuzzy matching' that is acceptable when an exact match is not found – this allows a match that, although not 100%, is above a service-defined threshold
* manage the risk of incorrect matching by defining what happens when:

  * there's no match – you can :ref:`create a new account <ms_cua>` for the user
  * there are multiple matches – you can implement :ref:`matching cycle 3 <ms_mc3>`

* analyse your data sources in the light of your matching strategy, so you can test and refine your strategy before launching alpha or beta services

.. note:: We recommend that you discuss your matching strategy with your engagement lead. They can organise technical support if needed.

Respond to JSON matching requests
---------------------------------

Your service must respond to JSON matching requests from the matching service adapter (MSA). The MSA makes requests to the URLs specified in the :ref:`YAML configuration file <yamlfile>`:

* ``localMatchingService:`` ``matchUrl:``
* ``localMatchingService:`` ``accountCreationUrl:`` (if you're :ref:`creating new user accounts <ms_cua>` when a match is not found)

The MSA sends one matching request for both cycle 0 and cycle 1 to your local matching service. Below is a formatted example:

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

If no match is found on cycles 0, 1 and 3, you can :ref:`create a new account <ms_cua>` for the user.


Use a JSON schema
-----------------

Below is a `JSON schema <http://json-schema.org/>`_ for a matching request. You can use this schema to validate incoming matching requests and as a reference when developing your local matching service.

.. note:: The elements in ``matchingDataset`` are optional, so the code handling this in your local matching service must be appropriately flexible.

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
              ],
              "type": "string"
          },
          "matchId": {
              "type": "string"
          },
          "matchingDataset": {
              "properties": {
                  "addresses": {
                      "items": {
                          "properties": {
                              "fromDate": {
                                  "format": "DATE_TIME",
                                  "type": "string"
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
                              "toDate": {
                                  "format": "DATE_TIME",
                                  "type": "string"
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
                              "format": "DATE_TIME",
                              "type": "string"
                          },
                          "to": {
                              "format": "DATE_TIME",
                              "type": "string"
                          },
                          "value": {
                              "format": "DATE_TIME",
                              "type": "string"
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
                              "format": "DATE_TIME",
                              "type": "string"
                          },
                          "to": {
                              "format": "DATE_TIME",
                              "type": "string"
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
                  "gender": {
                      "properties": {
                          "from": {
                              "format": "DATE_TIME",
                              "type": "string"
                          },
                          "to": {
                              "format": "DATE_TIME",
                              "type": "string"
                          },
                          "value": {
                              "enum": [
                                  "FEMALE",
                                  "MALE",
                                  "NOT_SPECIFIED"
                              ],
                              "type": "string"
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
                              "format": "DATE_TIME",
                              "type": "string"
                          },
                          "to": {
                              "format": "DATE_TIME",
                              "type": "string"
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
                                  "format": "DATE_TIME",
                                  "type": "string"
                              },
                              "to": {
                                  "format": "DATE_TIME",
                                  "type": "string"
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
                      "type": "array"
                  }
              },
              "type": "object"
          }
      },
      "type": "object",
      "required": [ "matchId", "levelOfAssurance", "hashedPid", "matchingDataset" ]
  }
