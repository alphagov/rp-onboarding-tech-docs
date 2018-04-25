.. _samlComplianceTool:

Run SAML compliance tests
===========================

The purpose of SAML compliance tests is to ensure that the service you're building is compliant with the `SAML profile <https://www.gov.uk/government/publications/identity-assurance-hub-service-saml-20-profile>`_. This guarantees that:

* your service will work with GOV.UK Verify
* user data will remain secure within the GOV.UK Verify federation

Your service and matching service need to consume and produce SAML messages in a variety of different scenarios. The SAML compliance tool allows you to test and prove that your service and matching service can consume and produce all required SAML messages.


The compliance tool provides clear error messages. These will help with iterative development of your service.  We advise you to use the compliance tool as part of your continuous integration pipeline. This ensures that any changes maintain backwards compatibility.

Before running SAML compliance tests, :ref:`install <msa_install_msa>` and :ref:`configure  <ConfigureMSA>` your MSA.


Use the SAML compliance test to:

* :ref:`test your service <samlCTservicehub>`
* :ref:`test your matching service <samlCThubMSA>`

After running SAML compliance tests, you can run :ref:`end-to-end testing <envEndToEndTests>` in the integration environment.



.. _samlCTservicehub:

Test your service with the SAML compliance tool
-----------------------------------------------------------------

To use the compliance tool:


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
7. Access the ``executeUri`` for each test scenario you want to execute. The following test scenarios are provided:

  * Basic successful match
  * Basic no match
  * No authentication context (this is when the user cancels the process)
  * Authentication failed
  * Requester error (this is when the request is invalid)
  * Account creation
  * Fraudulent match response with assertions signed by hub

  The above scenarios are the possible responses for step 8 in the :ref:`SAML message flow <samlWorks>`.


.. _samlCThubMSA:

Test your matching service with the SAML compliance tool
--------------------------------------------------------------------

1. To set up the SAML compliance tool for matching service tests, POST the following JSON (via curl or Postman, for example) to the SAML compliance tool URL (`https://compliance-tool-reference.ida.digital.cabinet-office.gov.uk/matching-service-test-run <https://compliance-tool-reference.ida.digital.cabinet-office.gov.uk/matching-service-test-run>`_):

  ::


    Content-Type: application/json
     {
     "matchingServiceEntityId": "[entityID of the matching service]",
     "serviceEntityId": "[entityID of the transaction (service)]",
     "matchingServiceEndpoint": "[the matching service's endpoint]",
     "matchingServiceSigningCertificate": "[signing certificate to verify the response]",
     "matchingServiceEncryptionCertificate": "[encryption certificate to encrypt the assertions]",
     "userAccountCreationEndpoint": "[optionally the matching service adapter's user account creation encpoint]"
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

  If you provide a value for ``"userAccountCreationAttributes"`` the compliance tool will make a user account creation request to the ``"userAccountCreationEndpoint"`` configured in the POST request to /matching-service-test-run.
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


4. When the SAML compliance tool receives your test matching dataset, it will POST an attribute query to your MSA. This corresponds to step 4 in the :ref:`SAML message flow <samlWorks>`.

5. Your MSA validates the query and sends a POST with a JSON request containing your test matching dataset to your local matching service. This corresponds to step 5 in the :ref:`SAML message flow <samlWorks>`.
