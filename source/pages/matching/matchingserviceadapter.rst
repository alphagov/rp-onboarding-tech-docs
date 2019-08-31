.. _msaUse:

.. _msa_install_msa:

Install and configure the Matching Service Adapter
==============================================================

The Matching Service Adapter (MSA) is a software tool supplied free of charge by the GOV.UK Verify team. It simplifies communication between your Local Matching Service and the GOV.UK Verify Hub.

The MSA handles complex matching requirements. We recommend that you use the MSA and always make sure you have the latest version.

You need to host the MSA so the GOV.UK Verify Hub can make requests to it.

If you do not want to use the MSA, `contact the GOV.UK Verify team <mailto:idasupport+onboarding@digital.cabinet-office.gov.uk>`_ to discuss your alternatives.

**Prerequisites**

To run the Matching Service Adapter (MSA) you need:

* Java Runtime Environment (JRE) version 8
* 512 MB to 1 GB of RAM, on top of what you need to run your operating system

1. `Download the latest release of the MSA <https://github.com/alphagov/verify-matching-service-adapter/releases/latest>`_. It contains:

  * a JAR (Java Archive) file containing the MSA implementation, as well as the trust stores ``prod_ida_idp_metadata.ts``, ``prod_ida_hub_metadata.ts``, ``test_ida_idp_metadata.ts``, and ``test_ida_hub_metadata.ts``
  * a truststore metadata file for non-production environments (the SAML compliance tool and the integration environment) - ``test_ida_metadata.ts``
  * a truststore metadata file for the production environment - ``prod_ida_metadata.ts``
  * a sample YAML configuration file for non-production environments  - ``test-config.yml``
  * a sample YAML configuration file for the production environment  - ``prod-config.yml``

2. To extract the files, run the following command::

    unzip verify-matching-service-adapter-[build number].zip

Versioning
-----------

Typically, GOV.UK Verify releases a new version of the MSA every 2 or 3 months. Some releases are essential updates and we may remove support for older versions. To keep updated, contact the `GOV.UK Verify support team <mailto:idasupport+onboarding@digital.cabinet-office.gov.uk>`_ to ensure you are on the MSA email distribution list.


.. _msa_certs:

Obtain certificates for your Matching Service Adapter
---------------------------------------------------------------------------------

Your MSA needs a signing certificate and an encryption certificate. You must use different certificates for each environment.

To obtain certificates:

* :ref:`generate self-signed certificates <generateSelfSignedCertificates>` for the SAML compliance tool
* :ref:`request certificates <pkiRequestCert>` from the IDAP certificate authority for the integration and production environments


.. _ConfigureMSA:

Configure the Matching Service Adapter
---------------------------------------------------------------------------------

Create a YAML configuration file
------------------------------------------------------------------------------

When you :ref:`start the MSA <msa_test_msa>`, you need to supply a YAML configuration file.

The MSA zip file contains two sample YAML configuration files:

* ``test-config.yml`` for the SAML compliance tool and the integration environment
* ``prod-config.yml`` for the production environment

:ref:`Adapt the YAML configuration file <msa_adapt_YAML>` where required.



Below is the ``test-config.yml`` file:

.. _yamlfile:

.. code-block:: yaml

    # Configure the matching service adapter's server settings here.
    server:
      # Ports on which to listen for normal connections.
      # See http://www.dropwizard.io for information on HTTPS and TLS connections.
      applicationConnectors:
        - type: http
          port: 8080
      # Ports on which to listen for admin tasks.
      # This can probably be set to the above port+1.
      adminConnectors:
        - type: http
          port: 8081

    # Add information about your matching service adapter (MSA) here.
    matchingServiceAdapter:
      # The entityId is used for SAML communication with Verify.
      entityId: my-entity-id
      # The externalUrl is the internet-facing URL for your MSA.
      externalUrl: http://service.gov.uk/matching-service/POST

    # Configure the URLs for your local matching service here.
    localMatchingService:
      # The matchUrl is where the MSA should post user attributes on a successful match
      matchUrl: http://service.gov.uk/local-matching/match
      # The accountCreationUrl is where the MSA should post attributes for unknown users
      accountCreationUrl: http://service.gov.uk/local-matching/create-account

    # Configure the key pairs used by your MSA for signing SAML messages here.
    signingKeys:
      # The primary signing key is used to sign all messages to Verify.
      primary:
        publicKey:
          # The certificate (.crt) containing the primary public signing key:
          certFile: test_primary_signing.crt
          # The common name (CN) of that certificate:
          name: Test MSA Signing
        privateKey:
          # The PK8 (.pk8) containing the primary private signing key:
          keyFile: test_primary_signing.pk8
      # The public part of the secondary signing key is published in the MSA's metadata
      # during key rollovers but is otherwise unused by the MSA.
      secondary:
        publicKey:
          certFile: test_secondary_signing.crt
          name: Test Another MSA Signing
        privateKey:
          keyFile: test_secondary_signing.pk8

    # Configure the key pairs used by your MSA for encrypting and decrypting SAML
    # messages here. You can configure up to 2 encryption keys at a time and the MSA
    # will attempt decryption with both. Only the first key will be used for encryption.
    encryptionKeys:
      - publicKey:
          certFile: test_msa_encryption_1.crt
          name: Test MSA Encryption 1
        privateKey:
          keyFile: test_msa_encryption_1.pk8
      - publicKey:
          certFile: test_msa_encryption_2.crt
          name: Test MSA Encryption 2
        privateKey:
          keyFile: test_msa_encryption_2.pk8

    # Settings for connecting with the hub can be configured here
    # if necessary.
    hub:
      ssoUrl: https://compliance-tool-reference.ida.digital.cabinet-office.gov.uk/SAML2/SSO

    # Settings for obtaining Verify's metadata can be configured here.
    metadata:
      environment: INTEGRATION
      url: https://compliance-tool-reference.ida.digital.cabinet-office.gov.uk/SAML2/metadata/federation
      trustStore:
        path: test_ida_metadata.ts
        password: puppet
    # To override the `hub` and `idp` trust stores, i.e. for testing or manual modifications,
    # you can extract them from the MSA JAR file to a local disk, modify them, and then un-comment the following section:
      # hubTrustStore:
        # path: test_hub.ts
        # password: puppet
      # idpTrustStore:
        # path: test_idp.ts
        # password: puppet

    # This is a required section if your service needs to consume European identities.
    europeanIdentity:
      enabled: ${EUROPEAN_IDENTITY_ENABLED} # true or false
      hubConnectorEntityId: https://connector-node-integration.london.verify.govsvc.uk/ConnectorMetadata # The URL of the metadata for the node that requests and receives identities from European countries.
      # Configure metadata for European countries.
      aggregatedMetadata:
        trustAnchorUri: https://www.integration.signin.service.gov.uk/SAML2/metadata/trust-anchor # The location of the trust anchor used to validate country metadata
        metadataSourceUri: https://www.integration.signin.service.gov.uk/SAML2/metadata/aggregator # The location of the aggregated country metadata
        trustStore: # The location and password for the truststore
          path: test_ida_metadata.ts
          password: puppet

    ## Options to add additional logging. By default, logs will be output to console.
    ## See http://www.dropwizard.io for more information.
    #logging:
    #  level: INFO
    #  appenders:
    #    - type: file
    #      currentLogFilename: apps-home/test-rp-msa.log
    #      archivedLogFilenamePattern: apps-home/test-rp-msa.log.%d.gz
    #      logFormat: '%-5p [%d{ISO8601,UTC}] %c: %X{logPrefix}%m%n%xEx'
    #    - type: console
    #      logFormat: '%-5p [%d{ISO8601,UTC}] %c: %X{logPrefix}%m%n%xEx'
    #
    #
    ## By default the MSA signs messages using SHA-256.
    ## Switch the flag below to `true` if you need to revert to SHA-1 signing:
    #shouldSignWithSHA1: false


.. _msa_adapt_YAML:

Adapt the YAML configuration file
------------------------------------

Make the following changes to the YAML configuration file according to the environment where you want to use the MSA. Variations are indicated for the SAML compliance tool and integration and production environments.

In the field ``server:``
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

1. Enter port numbers for the server application (``applicationConnectors``) and admin ports (``adminConnectors``).

 .. note:: If the MSA will be handling SSL termination (typically this will be handled by a proxy or load balancer like HAProxy), or if you don't trust the network between the SSL termination endpoint and the MSA, then specify ``https`` rather than ``http`` for the type of connection. For more information, see the guidance in the `DropWizard configuration manual <http://dropwizard.github.io/>`_.

In the field ``matchingServiceAdapter:``
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

2. Enter the entityID for the MSA in ``entityId``. This should reflect the name of your service, for example ``https://<service name>/MSA``

  .. note:: It's good practice to use the MSA's URI (where the hub will send matching requests) as its entityID, but this isn't mandatory.

3. Enter the URI for your MSA in ``externalUrl:``

In the field ``localMatchingService:``
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

4. Enter the URI for your local matching service in ``matchUrl:``

5. If you're creating new user accounts when a match isn't found (see :ref:`create new user accounts <createnewaccounts>`), enter the user account creation URI in ``accountCreationUrl:``

In the field ``signingKeys:``
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

6. Enter the paths of the primary SAML signing keys and certificates for your MSA in ``primary:``

 * for the compliance tool, :ref:`generate self-signed certificates <generateSelfSignedCertificates>`

 * you'll use different keys and certificates for the integration and production environments - see :ref:`pkiRequestCert`.

 .. note:: To convert a private key to PKCS#8 DER format, run the following command: ``openssl pkcs8 -topk8 -nocrypt -in server.key -out server.pk8 -outform DER``


In the field ``encryptionKeys:``
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

7. Enter the paths and names of the encryption keys and certificates for your MSA in ``encryptionKeys``.  The names are used to identify the certificates in the metadata so should be meaningful and unique, for example, ``signing_1`` and ``encryption_1``.

In the field ``metadata:``
^^^^^^^^^^^^^^^^^^^^^^^^^^

8. Edit the ``url:`` value and specify the location where the MSA accesses the SAML metadata:

  * for the SAML compliance tool, use the default setting in the ``test-config.yml`` file

  * for the integration environment, enter: ``https://www.integration.signin.service.gov.uk/SAML2/metadata/federation`` in the ``test-config.yml`` file

  * for the production environment, use the default setting in the ``prod-config.yml`` file

9. In ``trustStore:`` ``path:``, specify the path to your metadata truststore file for the appropriate environment:

  * for the SAML compliance tool and the integration environment, use the provided ``test_ida_metadata.ts`` file (this is the default setting in the ``test-config.yml`` file)

  * for the production environment, use the provided ``prod_ida_metadata.ts`` file (this is the default setting in the ``prod-config.yml`` file)

 10. Set ``environment`` to either ``PRODUCTION`` or ``INTEGRATION``. This ensures that the MSA uses the correct ``hub`` and ``idp`` truststores for each release. If you need to override the default truststores during testing, add ``hubTrustStore`` and ``idpTrustStore`` to the ``metadata`` section.

.. _msaeidas:

In the field ``europeanIdentity``
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

11. Configure according to the needs of your service:

  If your service needs to consume European identities, set ``enabled: true``.
  You also need to configure the URLs for the environments you want to use, for example integration or production. Enabling your service to consume European identities also implies that it will be using :ref:`the universal JSON matching schema<JSONschema>`. The schema will apply to datasets from both European countries, as well as GOV.UK Verify identity providers.

  If if you need to disable European identities, set ``enabled: false`` in this section. This setting also implies your MSA will be using :ref:`the legacy JSON matching schema<legacyJSONschema>`.



.. _msa_test_msa:

Start the Matching Service Adapter
---------------------------------------------------------------------------------

To start using the MSA, run the following command, supplying the path to your configuration file:

::

 java -jar [filename].jar server [path to configuration file].yml

You can now run :ref:`SAML compliance tests between the hub and your MSA <samlCThubMSA>`. To help :ref:`build your local matching service <buildmatchingservice>`, you can use the :ref:`example of the JSON request <RespondJSONmr>` that the MSA posts to your service.

**Signature verification failed**

When starting the MSA, you may receive an error message with the phrase ‘signature verification failed’. This is expected behaviour and is logged from a third-party library.

The Verify hub metadata contains multiple signing certificates, but only one private key is in use at a time. The metadata refreshes automatically approximately every 10 minutes.

The MSA checks each of the certificates in turn. The MSA will return ‘Signature verification failed’ if it checks an unused certificate. It will then continue to check each certificate until it finds a valid certificate.

Monitoring
---------------------------------------------------------------------------------

When the MSA is installed in your :ref:`integration or production environment <env>`, health checks run every 60 seconds to ensure that the MSA is functioning correctly. They test:

* connectivity
* that the MSA accepts the hub signature
* that the hub accepts the MSA signature


Configure HTTPS Proxies
---------------------------------------------------------------------------------

The MSA supports HTTP and HTTPS proxies configured by Java properties.

For information on configuring HTTPS proxies, refer to the `Java documentation <http://docs.oracle.com/javase/8/docs/technotes/guides/net/proxies.html>`_.


Secure your Matching Service Adapter
---------------------------------------------------------------------------------

Matching Service Adapter TLS certificates
-------------------------------------------

The table below shows the root certificate authorities that GOV.UK Verify trusts for HTTPS connections to your matching service in the :ref:`integration and production environments <env>`.

+----------------------------+---------------------------+-------------------------------------------------------------+
| Root certificate authority | Common name               | X509v3 subject key identifier                               |
+============================+===========================+=============================================================+
| AddTrust External CA Root  | AddTrust External CA Root | AD:BD:98:7A:34:B4:26:F7:FA:C4:26:54:EF:03:BD:E0:24:CB:54:1A |
+----------------------------+---------------------------+-------------------------------------------------------------+
| GeoTrust Global CA         | GeoTrust Global CA        | C0:7A:98:68:8D:89:FB:AB:05:64:0C:11:7D:AA:7D:65:B8:CA:CC:4E |
+----------------------------+---------------------------+-------------------------------------------------------------+
| QuoVadis Root CA 2         | QuoVadis Root CA 2        | 1A:84:62:BC:48:4C:33:25:04:D4:EE:D0:F6:03:C4:19:46:D1:94:6B |
+----------------------------+---------------------------+-------------------------------------------------------------+

.. note:: For the SAML compliance tool, use :ref:`self-signed certificates <generateSelfSignedCertificates>`.

If you want to use a root certificate authority for your matching service that isn’t in the above table, raise a ticket with us by sending an email to idasupport+onboarding@digital.cabinet-office.gov.uk. We’ll review your chosen root certificate authority before adding it to this list.

When you raise a ticket, indicate the chain of trust with your SSL/TLS certificate. You'll also need the chain of trust when you configure your server.


Connect your Matching Service Adapter to the internet securely
-----------------------------------------------------------------

Your MSA must only respond to matching requests from the GOV.UK Verify hub, otherwise there’s a risk of user data being compromised.

The MSA checks that matching service requests are genuine by checking their cryptographic signatures.

To ensure that only the GOV.UK Verify hub can access the MSA, make sure your MSA:

* is only exposed as HTTPS endpoints
* only uses strong recent versions of TLS (for example TLS 1.2); turn off obsolete and insecure versions (for example SSLv1, SSLv2, and SSLv3)
* supports multiple strong cipher suites

  .. note:: GOV.UK Verify will remove support for TLS cipher suites if serious weaknesses become known. Having multiple suites provides resilience.

* allows requests and health checks only from the IP addresses of hub services provided by your engagement lead

  .. note:: Each MSA should communicate with only 1 hub service (SAML compliance tool, integration environment, or production environment).
