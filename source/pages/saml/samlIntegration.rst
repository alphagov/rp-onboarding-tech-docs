.. _samlIntegration:


Build your service
=======================

.. _samlIntegrationtool:


Use extended validation certificates
-------------------------------------

You must use extended validation (EV) certificates for all public interactions with your service. When you use EV certificates, the user's web browser clearly indicates the name of the organisation they are interacting with.


Using EV certificates is one of a range of measures to protect your users from sites pretending to be you. See best practices for `using TLS to protect data <https://www.ncsc.gov.uk/guidance/tls-external-facing-services>`_ from the National Cyber Security Centre (NCSC).


.. _ChooseProductFramework:

Choose a product and framework
--------------------------------------

Your government service must be able to send SAML authentication requests to, and receive SAML responses from, the GOV.UK Verify hub. 

You can choose from a wide range of off-the-shelf products and frameworks to integrate your service with GOV.UK Verify. 

GOV.UK Verify has experience integrating and supporting services using Shibboleth-SP (Service Provider) and OpenSAML libraries. This has worked well for teams using Java. However, please use the most appropriate products and frameworks for your team.  See `Choosing technology <https://www.gov.uk/service-manual/making-software/choosing-technology.html>`_ in the Government Service Design Manual. 

Contact your engagement lead if you need further information.


.. _ConfigureAdaptTechnology:

.. _saml_access_metadata:


Connect your service to the Matching Service Adapter metadata
----------------------------------------------------------------

To integrate GOV.UK Verify into your service, you need to connect your service to the Matching Service Adapter (MSA) metadata. 


The MSA metadata:

* indicates the URL where your service will send users with their authentication requests - this is the GOV.UK Verify hub 

* lists one or more MSA signing certificates, so your service can validate messages that are sent by your MSA

* describes the MSA as an identity provider




The MSA metadata is located in your MSA at /matching-service/SAML2/metadata

Your service must poll the MSA metadata every 10 minutes. 



.. _saml_consume_responses:

Send a SAML authentication request to the GOV.UK Verify hub
----------------------------------------------------------------

1. Use your chosen :ref:`product and framework <ChooseProductFramework>` to build a SAML authentication request in XML:

  .. code-block:: yaml

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


2. Send the authentication request to the URL indicated in the element ``SingleSignonService`` in the MSA metadata.


.. _saml_handle_responses:

Handle SAML responses using SAML metadata
----------------------------------------------------------------

To consume SAML responses that are issued by the GOV.UK Verify hub:
 
1. Decrypt the assertion.

2. Validate the signature on the assertion contained in the response. This assertion is generated and signed by your MSA. 

   You can use the X509 signing certificate contained in the MSA metadata to validate this signature.

.. caution:: Use this procedure with care. You must trust assertions signed by the MSA only. The GOV.UK Verify hub never issues assertions for consumption by the service endpoint, so make sure that it’s *not* possible to trust the hub to issue assertions.




