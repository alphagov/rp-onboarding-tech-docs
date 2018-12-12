.. _testmatching:

Test your matching service
=========================================

.. warning:: This documentation is out of date. We have published `new technical documentation <https://www.docs.verify.service.gov.uk>`_.

You can test your matching service with 2 tools provided by GOV.UK Verify:

* Matching Service Test Tool
* Compliance Tool

.. rubric:: Using the Matching Service Test Tool

The `Matching Service Test Tool <https://github.com/alphagov/verify-matching-service-adapter/tree/master/verify-matching-service-test-tool>`_ is a lightweight tool you can add to your existing testing workflow.

The tool makes sure your Local Matching Service can:

* handle matching datasets
* find and match records correctly
* handle matching failures

You can also add or amend test scenarios to the tool. Refer to the `Matching Service Test Tool documentation on GitHub <https://github.com/alphagov/verify-matching-service-adapter/tree/master/verify-matching-service-test-tool>`_ to install and configure the tool.

.. rubric:: Using the Compliance Tool

The SAML Compliance Tool helps you test your Local Matching Service and Matching Service Adapter (MSA) together. It also helps you to test and configure your MSA before entering the :ref:`Integration environment <env>`.

The Compliance Tool is hosted by GOV.UK Verify. To test the matching service using the Compliance Tool, you will need to make sure your MSA is accessible through the internet.

1. To set up the SAML Compliance Tool for matching service tests, POST the following JSON (via cURL or Postman, for example) to the SAML compliance tool URL (`https://compliance-tool-reference.ida.digital.cabinet-office.gov.uk/matching-service-test-run <https://compliance-tool-reference.ida.digital.cabinet-office.gov.uk/matching-service-test-run>`_):

  ::


    Content-Type: application/json
     {
     "matchingServiceEntityId": "[entityID of the matching service]",
     "serviceEntityId": "[entityID of the transaction (service)]",
     "matchingServiceEndpoint": "[the matching service's endpoint]",
     "matchingServiceSigningCertificate": "[signing certificate to verify the response]",
     "matchingServiceEncryptionCertificate": "[encryption certificate to encrypt the assertions]",
     "userAccountCreationEndpoint": "[optionally the matching service adapter's user account creation endpoint]"
     }

If your service :ref:`creates new user accounts <createnewaccounts>` then you will need to provide a value for ``"userAccountCreationEndpoint"``.

2. You receive a response similar to the following::

     Status 201 Created
     Location: .../matching-service-test-run/8fd7782f-efac-48b2-8171-3e4da9553d19


3. POST your test matching dataset (see example below) to the ``Location`` field in the above response (``.../matching-service-test-run/8fd7782f-efac-48b2-8171-3e4da9553d19`` in the above example).

   ::

      {
          "levelOfAssurance": "LEVEL_2",
          "persistentId": "93E5910B-F4C2-4561-AEC5-C878AFEF25A3",
          "firstName": {
              "value": "Joe",
              "to": "",
              "from": "",
              "verified": true
          },
          "middleNames": {
              "value": "Bob Rob",
              "to": "",
              "from": "",
              "verified": true
          },
          "surnames": [
              {
                  "value": "Fred",
                  "to": "2010-01-20",
                  "from": "1980-05-24",
                  "verified": true
              },
              {
                  "value": "Dou",
                  "to": "",
                  "from": "2010-01-20",
                  "verified": true
              }
          ],
          "gender": {
              "value": "Male",
              "to": "",
              "from": "",
              "verified": true
          },
          "dateOfBirth": {
              "value": "1980-05-24",
              "to": "",
              "from": "",
              "verified": true
          },
          "addresses": [
              {
                  "lines": ["123 George Street"],
                  "postCode": "GB1 2PP",
                  "internationalPostCode": "GB1 2PP",
                  "uprn": "7D68E096-5510-B3844C0BA3FD",
                  "toDate": "2005-05-14",
                  "fromDate": "1980-05-24",
                  "verified": true
              },
              {
                  "lines": ["10 George Street"],
                  "postCode": "GB1 2PF",
                  "internationalPostCode": "GB1 2PF",
                  "uprn": "833F1187-9F33-A7E27B3F211E",
                  "toDate": null,
                  "fromDate": "2005-05-14",
                  "verified": true
              }
          ],
          "cycle3Dataset": {
              "key": "drivers_licence",
              "value": "4C22DA90A18A4B88BE460E0A3D975F68"
          },
          "userAccountCreationAttributes": ["optional", "list", "of", "attributes", "the", "government", "service", "requires", "for", "new", "user", "account", "creation", "see", "below"]
      }

  If you provide a value for ``"userAccountCreationAttributes"`` the Compliance Tool will make a user account creation request to the ``"userAccountCreationEndpoint"`` configured in the POST request to /matching-service-test-run.
  If you do not provide a value, the compliance tool will make a matching request to your ``"matchingServiceEndpoint"``.

  You only need to test the user account creation requests if your service :ref:`creates new user accounts <createnewaccounts>`.

  where:

  * ``persistentId`` is mandatory
  * you must supply at least one other value in addition to ``persistentId``
  * the values of ``addresses`` and ``surnames`` are arrays
  * fields have optional ``from`` and ``to`` attributes in which you can capture historical values – for example, if the user has changed their surname, there's an additional entry for the old surname with the ``from`` and ``to`` values defining the period for which the name was valid; the new surname only has the ``from`` attribute, containing the date from which it was valid
  * the ``addresses`` field that holds the current address contains a ``fromDate`` attribute for the date from which the address is valid; past addresses also contain the ``toDate`` attribute
  * the ``cycle3Dataset`` field is only present for a cycle 3 matching attempt
  * the ``uprn`` (Unique Property Reference Number) is a unique reference for each property in Great Britain, ensuring accuracy of address data. This is an optional attribute that can contain up to 12 characters and should not have any leading zeros
  * ``userAccountCreationAttributes``: provide this only if you want to test :ref:`new user account creation <createnewaccounts>` – select from the full :ref:`list of attributes <list_cua_attributes>`


4. When the SAML Compliance Tool receives your test matching dataset, it will POST an attribute query to your MSA. This corresponds to step 4 in the :ref:`SAML message flow <samlWorks>`.

5. Your MSA validates the query and sends a POST with a JSON request containing your test matching dataset to your local matching service. This corresponds to step 5 in the :ref:`SAML message flow <samlWorks>`.
