.. _samlComplianceTool:

Run SAML compliance tests
===========================

The purpose of SAML compliance tests is to ensure that the service you're building is compliant with the `SAML profile <https://www.gov.uk/government/publications/identity-assurance-hub-service-saml-20-profile>`_. This guarantees that:

* your service will work with GOV.UK Verify
* user data will remain secure within the GOV.UK Verify federation

The SAML Compliance Tool allows you to test and prove that your service can respond appropriately to all of the scenarios your service needs to be able to handle. 

After successfully testing all the scenarios applicable to you, send `the GOV.UK Verify team <mailto:idasupport+onboarding@digital.cabinet-office.gov.uk>`_ proof of this in the form of a series of screenshots or a recording screen as the tests were performed.

The Compliance Tool provides clear error messages to help with the iterative development of your service. We advise you to use the Compliance Tool as part of your continuous integration pipeline to ensure that any changes maintain backwards compatibility.

Before running SAML compliance tests, :ref:`install <msa_install_msa>` and :ref:`configure  <ConfigureMSA>` your MSA.

Use the SAML compliance test to:

* :ref:`test your service <samlCTservicehub>`
* :ref:`test your matching service <samlCThubMSA>`

After running SAML compliance tests, you can run :ref:`end-to-end testing <envEndToEndTests>` in the integration environment.

.. _samlComplianceToolScenarios:

Compliance Tool scenarios
-----------------------------------------------

Your service and matching service need to be able to consume and produce SAML messages in a variety of different scenarios:

* :ref:`Basic Successful Match Response <CTscenarioMatch>`
* :ref:`Basic No Match Response <CTscenarioNoMatch>`
* :ref:`No Authentication Context Response <CTscenarioNoAuthnContext>`
* :ref:`Authentication Failed Response <CTscenarioAuthnFailed>`
* :ref:`Account Creation Response <CTscenarioAccountCreation>`
* :ref:`Fraudulent match response with assertions signed by hub <CTscenarioFraud>`

.. _CTscenarioMatch:

Basic Successful Match Response
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
The user has been verified successfully at the required level of assurance (LoA). Users with higher LoA identity accounts should be allowed to access services requiring lower LoA, but not the other way around.

In this case, you should make sure that the user arrives to a page useful to them, for example the service home page.

.. _CTscenarioNoMatch:

Basic No Match Response
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
A match was not found by the :ref:`Local Matching Service <localmatchingservice>`. Depending on your service, you could:

* :ref:`Tell the user about alternatives <CTscenarioMatchAlternatives>`
* :ref:`Take the user to their new account page <CTscenarioMatchAccount>`

.. _CTscenarioMatchAlternatives:

Tell the user about alternatives
````````````````````````````````
Because there was no match in the service database, the user cannot access the service.

In this case, let the user know what their alternatives are, for example, "We could not match your identity with an entry from our database. You can still apply for a vehicle operator licence by post."

.. _CTscenarioMatchAccount:

Take the user to their new account page
```````````````````````````````````````
Some services choose to create a new account if they found no match in their database. If account creation is implemented, the Verify Team need to see that the user arrives to a page that is useful to them, for example the service home page.

.. _CTscenarioNoAuthnContext:

No Authentication Context Response
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
This response can happen for a number of reasons, but the most common cases  are:

* :ref:`Session timeout <CTscenarioNoAuthnContextTimeout>`
* :ref:`Cancellation by the user <CTscenarioNoAuthnContextCancel>`
* :ref:`Failure to authenticate at an appropriate LoA <CTscenarioNoAuthnContextLoA>`

.. _CTscenarioNoAuthnContextTimeout:

Session timeout
````````````````````````````````
Before completing the verification process with the identity provider, the user became inactive. In this case the user has to restart the verification process.

.. _CTscenarioNoAuthnContextCancel:

Cancellation by the user
````````````````````````````````
During the identification process with the identity provider, the user selected **Cancel**. In this case, send the user back to the page where they start answering questions to help them choose the identity provider.

.. _CTscenarioNoAuthnContextLoA:

Failure to authenticate at an appropriate LoA
`````````````````````````````````````````````````````````````
This happens when there is an attempt to authenticate with a lower LoA than required by your service. This would be a fraudulent attempt rather than a real user.

In this case, show a generic error saying something went wrong and suggest alternatives, for example "Something went wrong. We’re working on fixing this problem so please try again later. You can also apply for a vehicle operator licence by post."

.. _CTscenarioAuthnFailed:

Authentication Failed Response
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
The user was not authenticated successfully when trying to sign into their account with the identity provider. The identity provider should help the user continue their journey.

.. _CTscenarioAccountCreation:

Account Creation Response
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
This is only relevant if your service creates new user accounts.

The response contains a hashed persistent identifier (PID) and attributes of the user that can be used to identify or create an account.

In this case, the user successfully created an account with your government service and you should make sure they arrive at a page useful to them, for example a personal account.

.. _CTscenarioFraud:

Fraudulent match response with assertions signed by hub
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Your service should only trust assertions signed by your matching service adapter, but in case of a fraudulent match, the response has an assertion signed with the Verify Hub's private key.

In this case, the user should see a generic error saying something went wrong, for example "Something went wrong. We’re working on fixing this problem so please try again later or apply for a vehicle operator licence by post".



.. _samlCTservicehub:

Test your service with the SAML compliance tool
-----------------------------------------------------------------

To use the Compliance Tool:


.. _samlCTselfsigncert:

1. :ref:`Generate self-signed certificates <generateSelfSignedCertificates>` for use with the compliance tool only.

2. POST the following JSON to the SAML compliance tool URL before every test run (`https://compliance-tool-reference.ida.digital.cabinet-office.gov.uk/service-test-data <https://compliance-tool-reference.ida.digital.cabinet-office.gov.uk/service-test-data>`_)::


    Content-Type: application/json
    {
        "serviceEntityId":"[entityID for your service - you can use the same URL as the assertionConsumerServiceUrl]",
        "assertionConsumerServiceUrl":"[assertion consumer service URL: this is the URL that will consume responses from the GOV.UK Verify hub]",
        "signingCertificate":"[Base64-encoded X509 signing certificate for your service]",
        "encryptionCertificate":"[Base64-encoded X509 encryption certificate for your service]",
        "expectedPID":"[expected persistent identifier: this is the user id that the MSA returns in an assertion]",
        "matchingServiceEntityId":"[entityID for your MSA]",
        "matchingServiceSigningPrivateKey":"[Base64-encoded private signing key for the MSA, see below]",
        "userAccountCreationAttributes":["optional", "list", "of", "attributes", "the", "government", "service", "requires", "for", "new", "user", "account", "creation", "see", "below"]
    }

  Replace the square brackets and their contents with your configuration data, taking account of the following:

  *   the keys and certificates in the configuration data must be single-line strings of Base64-encoded data without the header and footer ``BEGIN CERTIFICATE`` and ``END CERTIFICATE``

  * ``matchingServiceSigningPrivateKey``: this is required because the compliance tool sends a response to your service which contains an assertion signed by the MSA.

    This key must be a Base-64 encoded version of your PKCS#8 signing key. To convert a key named ``test_primary_signing.pk8``, run:

    ::

     base64 test_primary_signing.pk8


  * ``userAccountCreationAttributes``: provide this only if you want to test :ref:`new user account creation <createnewaccounts>` – select from the full :ref:`list of attributes <list_cua_attributes>`

  * ``useSimpleProfile``: set this to true only if you use Shibboleth-SP (Service Provider). By default this is set to false.

The compliance tool is deployed regularly and does not hold historical configuration data. You should POST the configuration data before every test run so the tool has the information it needs to run compliance tests.

3. You receive an empty response with ``200 OK`` status.

4. Make sure that your MSA is pointing at the URLs for the compliance tool (``metadata:`` ``url``) and and hub (``hub:`` ``ssoUrl``). These are the defaults in the ``test-config.yml`` file for non-production environments.

5. Generate a SAML authentication request and POST it to the compliance tool's SSO URI. Follow the redirect in the response to retrieve the result.

   .. note:: The SAML authentication requests signed by the government service must use RSA-SHA256 for the `signature method algorithm <https://www.w3.org/TR/xmldsig-core/#sec-SignatureMethod>`_ and SHA256 for the `digest method algorithm <https://www.w3.org/TR/xmldsig-core/#sec-DigestMethod>`_ . These are required to comply with the '`Identity Assurance Hub Service SAML 2.0 Profile <https://www.gov.uk/government/publications/identity-assurance-hub-service-saml-20-profile>`_'.

   Below is an example of a SAML authentication request:

  .. code-block:: yaml
     :emphasize-lines: 7, 13

      <?xml version="1.0" encoding="UTF-8"?>
      <saml2p:AuthnRequest ...>
        <saml2:Issuer xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion" Format="urn:oasis:names:tc:SAML:2.0:nameid-format:entity">http://www.test-rp.gov.uk/SAML2/MD</saml2:Issuer>
        <ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
          <ds:SignedInfo>
            <ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
            <ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
            <ds:Reference URI="#_60f75dc5-f9eb-43cf-adfc-5814016a626c">
              <ds:Transforms>
                <ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>
                <ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
              </ds:Transforms>
              <ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
              <ds:DigestValue>O+LkTbydEWNPSLThcblzSqd/BvlGAI0dWwGVgd6ixkE=</ds:DigestValue>
            </ds:Reference>
          </ds:SignedInfo>
          <ds:SignatureValue>
      O8x8ILlqoiCKg8LMSqlajyX5JhLDxHSltUXYAalGnFb0L41Up5hQuFrEXBNxfNiUo3ChlZA+FIWw
      WkK5OSSqqJQ9IqgUFUapDVZUewerOGLQ/Qw80linrbc24w21JIWDnpoT8qrdt+c9EgkQTvKrwDmf
      JfXUcbTCvuhnOTVrG/5Fv64sruBu9CVTSnvj/Jvy1bwK2HsvMmxrAO8og+iFvMx1KB7YCG1Puj/Z
      frJRKYU3QgAehUR0hrUj1ReVGV4cx1Yy7FhUKnYpdsYRVxpv1McwkDXHVs5iao+0vv7rLGLw9U1d
      a7lBaFhC2AT1wi+ogaO8nzZ/d3G6p0tHrMSqQA==
          </ds:SignatureValue>
        </ds:Signature>
      </saml2p:AuthnRequest>


6. If the result contains ``PASSED``, access the URI provided in ``responseGeneratorLocation``. A list of test scenarios is displayed.
7. Access the ``executeUri`` for each test scenario you want to execute. :ref:`The Compliance Tool test scenarios <samlComplianceToolScenarios>` are the possible responses for step 8 in the :ref:`SAML message flow <samlWorks>`.
8. Send proof that your service can handle all the applicable scenarios to `the GOV.UK Verify team <mailto:idasupport+onboarding@digital.cabinet-office.gov.uk>`_. You can send the proof as a series of screenshots or a recording of the screen as the tests were performed.

.. _samlCThubMSA:

Test your matching service with the SAML Compliance Tool
--------------------------------------------------------------------

1. To set up the SAML Compliance Tool for matching service tests, POST the following JSON (via curl or Postman, for example) to the SAML Compliance Tool URL (`https://compliance-tool-reference.ida.digital.cabinet-office.gov.uk/matching-service-test-run <https://compliance-tool-reference.ida.digital.cabinet-office.gov.uk/matching-service-test-run>`_):

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
  If you do not provide a value, the Compliance Tool will make a matching request to your ``"matchingServiceEndpoint"``.

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
