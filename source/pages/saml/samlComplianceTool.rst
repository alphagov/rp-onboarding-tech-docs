.. _samlComplianceTool:

Run SAML compliance tests
===========================

The purpose of SAML compliance tests is to ensure that the service you're building is compliant with the `SAML profile <https://www.gov.uk/government/publications/identity-assurance-hub-service-saml-20-profile>`_. This guarantees that:

* your service will work with GOV.UK Verify
* user data will remain secure within the GOV.UK Verify federation

Your service and matching service need to consume and produce SAML messages in a variety of different scenarios. The SAML Compliance Tool allows you to test and prove that your service and matching service can consume and produce all required SAML messages.


The Compliance Tool provides clear error messages. These will help with iterative development of your service.  We advise you to use the Compliance Tool as part of your continuous integration pipeline. This ensures that any changes maintain backwards compatibility.

Before running SAML compliance tests, :ref:`install <msa_install_msa>` and :ref:`configure  <ConfigureMSA>` your MSA.


Use the SAML compliance test to:

* :ref:`test your service <samlCTservicehub>`
* :ref:`test your matching service <samlCThubMSA>`

After running SAML compliance tests, you can run :ref:`end-to-end testing <envEndToEndTests>` in the integration environment.



.. _samlCTservicehub:

Test your service with the SAML Compliance Tool
-----------------------------------------------------------------

To use the Compliance Tool:


.. _samlCTselfsigncert:

1. :ref:`Generate self-signed certificates <generateSelfSignedCertificates>` for use with the Compliance Tool only.

2. POST the following JSON to the SAML Compliance Tool URL before every test run (`https://compliance-tool-reference.ida.digital.cabinet-office.gov.uk/service-test-data <https://compliance-tool-reference.ida.digital.cabinet-office.gov.uk/service-test-data>`_)::


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

  * ``matchingServiceSigningPrivateKey``: this is required because the Compliance Tool sends a response to your service which contains an assertion signed by the MSA.

    This key must be a Base-64 encoded version of your PKCS#8 signing key. To convert a key named ``test_primary_signing.pk8``, run:

    ::

     openssl base64 -A -in test_primary_signing.pk8

  * ``userAccountCreationAttributes``: provide this only if you want to test :ref:`new user account creation <createnewaccounts>` – select from the full :ref:`list of attributes <list_cua_attributes>`

  * ``useSimpleProfile``: set this to true only if you use Shibboleth-SP (Service Provider). By default this is set to false.

The Compliance Tool is deployed regularly and does not hold historical configuration data. You should POST the configuration data before every test run so the tool has the information it needs to run compliance tests.

3. You receive an empty response with ``200 OK`` status.

4. Make sure that your MSA is pointing at the URLs for the Compliance Tool (``metadata:`` ``url``) and and hub (``hub:`` ``ssoUrl``). These are the defaults in the ``test-config.yml`` file for non-production environments.

5. Generate a SAML authentication request and POST it to the Compliance Tool's SSO URI. Follow the redirect in the response to retrieve the result.

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

Test your matching service with the SAML Compliance Tool
--------------------------------------------------------------------

You can also use the Compliance Tool to test your Local Matching Service and Matching Service Adapter. The exact test scenarios will depend on your matching strategy. For more information, refer to the guidance on :ref:`testing your matching service <testmatching>`.
