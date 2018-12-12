
.. _legacyJSONschema:

The legacy JSON matching schema
-------------------------------

.. warning:: This documentation is out of date. We have published `new technical documentation <https://www.docs.verify.service.gov.uk>`_.

If you :ref:`configured your MSA<msaeidas>` to not consume EU identities, the matching datasets you receive from the GOV.UK Verify Hub will be formatted according to the legacy JSON matching schema:

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
