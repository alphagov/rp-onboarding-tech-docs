===================================
Open components and contribution
===================================

The majority of GOV.UK Verify's code is public and freely available under an MIT Licence. Wherever possible, the GOV.UK Verify team codes in the open on GitHub under the `alphagov organisation <https://github.com/alphagov/>`_.

We welcome contributions from outside the GOV.UK Verify team. You can raise a pull request or submit an issue against any open repository. To discuss more detailed feature requests or feedback, contact the GOV.UK Verify team at idasupport+onboarding@digital.cabinet-office.gov.uk.

**Responsible disclosure of security issues**

If you think you've discovered a security issue in any Verify code please email disclosure@digital.cabinet-office.gov.uk with details.

For open use
===================

**Frontend**

+-------------------+----------------------------------------+
| Component         | Description                            |
+===================+========================================+
| verify-frontend_  | The frontend service for Verify        |
+-------------------+----------------------------------------+

.. _verify-frontend: https://github.com/alphagov/verify-frontend

**Connecting to Verify**

+---------------------------------------+--------------------------------------------------------------------------------------------------------------------------------+
| Component                             | Description                                                                                                                    |
+=======================================+================================================================================================================================+
| passport-verify-stub-relying-party_   | A test Relying Party that integrates with Verify using the passport-verify library                                             |
+---------------------------------------+--------------------------------------------------------------------------------------------------------------------------------+
| passport-verify_                      | A passport.js strategy for Verify implementation in node.js and passport.js to integrate with Verify                           |
+---------------------------------------+--------------------------------------------------------------------------------------------------------------------------------+
| verify-compliance-tool-gui_           | A graphical user interface for the Verify compliance tool                                                                      |
+---------------------------------------+--------------------------------------------------------------------------------------------------------------------------------+
| verify-matching-service-adapter_      | An application that a Relying Party must operate to facilitate user matching requests from Verify                              |
+---------------------------------------+--------------------------------------------------------------------------------------------------------------------------------+
| verify-service-provider_              | A Dropwizard application to generate and translate SAML requests and responses                                                 |
+---------------------------------------+--------------------------------------------------------------------------------------------------------------------------------+
| verify-stub-matching-service_         | A test implementation of a local matching service                                                                              |
+---------------------------------------+--------------------------------------------------------------------------------------------------------------------------------+
| verify-hub_                           | A system of microservices to manage interactions between users, government services, identity providers, and matching services |
+---------------------------------------+--------------------------------------------------------------------------------------------------------------------------------+
| verify-stub-idp_                      | A stub Identity Provider and stub EU Country used for testing GOV.UK Verify and eIDAS integration.                             |
+---------------------------------------+--------------------------------------------------------------------------------------------------------------------------------+
| verify-test-rp_                       | A stub Relying Party used when testing the GOV.UK Verify Hub.                                                                  |
+---------------------------------------+--------------------------------------------------------------------------------------------------------------------------------+

.. _passport-verify-stub-relying-party: https://github.com/alphagov/passport-verify-stub-relying-party
.. _passport-verify: https://github.com/alphagov/passport-verify
.. _verify-compliance-tool-gui: https://github.com/alphagov/verify-compliance-tool-gui
.. _verify-matching-service-adapter: https://github.com/alphagov/verify-matching-service-adapter
.. _verify-service-provider: https://github.com/alphagov/verify-service-provider
.. _verify-stub-matching-service: https://github.com/alphagov/verify-stub-matching-service
.. _verify-hub: https://github.com/alphagov/verify-hub
.. _verify-stub-idp: https://github.com/alphagov/verify-stub-idp
.. _verify-test-rp: https://github.com/alphagov/verify-test-rp

**Libraries**

+----------------------------+----------------------------------------------------------------------------------------------------------------+
| Component                  | Description                                                                                                    |
+============================+================================================================================================================+
| dropwizard-logstash_       | Dropwizard extension that supports logstash format with various appenders                                      |
+----------------------------+----------------------------------------------------------------------------------------------------------------+
| dropwizard-jade_           | Dropwizard extension to use Jade templating engine in Views used by Verify code                                |
+----------------------------+----------------------------------------------------------------------------------------------------------------+
| dropwizard-infinispan_     | Dropwizard bundle and configuration for Infinispan                                                             |
+----------------------------+----------------------------------------------------------------------------------------------------------------+
| eager-dropwizard-guice_    | Dropwizard-guice library                                                                                       |
+----------------------------+----------------------------------------------------------------------------------------------------------------+

.. _dropwizard-logstash: https://github.com/alphagov/dropwizard-logstash
.. _dropwizard-jade: https://github.com/alphagov/dropwizard-jade
.. _dropwizard-infinispan: https://github.com/alphagov/dropwizard-infinispan
.. _eager-dropwizard-guice: https://github.com/alphagov/eager-dropwizard-guice

For information only
=====================

The code listed below is provided for informational purposes only and not yet intended for use outside GOV.UK Verify.

**Connecting to Verify**

+-----------------------------------------+--------------------------------------------------------------------------------------+
| Component                               | Description                                                                          |
+=========================================+======================================================================================+
| verify-sample-local-matching-services_  | A test project with a variety of sample local matching services in various languages |
+-----------------------------------------+--------------------------------------------------------------------------------------+

.. _verify-sample-local-matching-services: https://github.com/alphagov/verify-sample-local-matching-services

**SAML Libraries**

+---------------------------------+-----------------------------------------------------------------------------------------------+
| Component                       | Description                                                                                   |
+=================================+===============================================================================================+
| verify-hub-saml_                | SAML behaviours specific to the Verify Hub                                                    |
+---------------------------------+-----------------------------------------------------------------------------------------------+
| verify-saml-domain-objects_     | Library of Java classes that represent Verify domain objects and transformations (deprecated) |
+---------------------------------+-----------------------------------------------------------------------------------------------+
| verify-saml-extensions_         | Libraries containing implementations of the SAML extensions defined in the IDA SAML profile   |
+---------------------------------+-----------------------------------------------------------------------------------------------+
| verify-saml-metadata-bindings_  | Library for consuming SAML metadata                                                           |
+---------------------------------+-----------------------------------------------------------------------------------------------+
| verify-saml-security_           | Library for security-related SAML operations                                                  |
+---------------------------------+-----------------------------------------------------------------------------------------------+
| verify-saml-serializers_        | Library for (de)serialization of SAML objects                                                 |
+---------------------------------+-----------------------------------------------------------------------------------------------+
| verify-saml-test-utils_         | Utility libraries for testing SAML                                                            |
+---------------------------------+-----------------------------------------------------------------------------------------------+
| verify-saml-utils_              | SAML Libraries used for SAML transformation, validation, generation and error formatting      |
+---------------------------------+-----------------------------------------------------------------------------------------------+

.. _verify-hub-saml: https://github.com/alphagov/verify-hub-saml
.. _verify-saml-domain-objects: https://github.com/alphagov/verify-saml-domain-objects
.. _verify-saml-extensions: https://github.com/alphagov/verify-saml-extensions
.. _verify-saml-metadata-bindings: https://github.com/alphagov/verify-saml-metadata-bindings
.. _verify-saml-security: https://github.com/alphagov/verify-saml-security
.. _verify-saml-serializers: https://github.com/alphagov/verify-saml-serializers
.. _verify-saml-test-utils: https://github.com/alphagov/verify-saml-test-utils
.. _verify-saml-utils: https://github.com/alphagov/verify-saml-utils

**Libraries**

+--------------------------------+----------------------------------------------------------------------------------------------------------------+
| Component                      | Description                                                                                                    |
+================================+================================================================================================================+
| verify-test-utils_             | Libraries to help write Java Unit and Integration tests                                                        |
+--------------------------------+----------------------------------------------------------------------------------------------------------------+
| verify-utils-libs_             | Libraries used for REST, security and common utilities                                                         |
+--------------------------------+----------------------------------------------------------------------------------------------------------------+
| verify-dev-pki_                | Contains keys and certificates for Verify integration tests                                                    |
+--------------------------------+----------------------------------------------------------------------------------------------------------------+
| verify-stub-idp-saml_          | SAML library for a dummy Identity Provider IDP                                                                 |
+--------------------------------+----------------------------------------------------------------------------------------------------------------+
| verify-shibboleth-sp-example_  | An example configuration for a Shibboleth SP instance that works with Verify                                   |
+--------------------------------+----------------------------------------------------------------------------------------------------------------+
| verify-dropwizard-saml_        | Library for providing a SAML configuration object                                                              |
+--------------------------------+----------------------------------------------------------------------------------------------------------------+
| verify-metadata-generator_     | Produces unsigned SAML metadata that can be used to describe the entities within the GOV.UK Verify federation. |
+--------------------------------+----------------------------------------------------------------------------------------------------------------+

.. _verify-test-utils: https://github.com/alphagov/verify-test-utils
.. _verify-utils-libs: https://github.com/alphagov/verify-utils-libs
.. _verify-dev-pki: https://github.com/alphagov/verify-dev-pki
.. _verify-stub-idp-saml: https://github.com/alphagov/verify-stub-idp-saml
.. _verify-shibboleth-sp-example: https://github.com/alphagov/verify-shibboleth-sp-example
.. _verify-dropwizard-saml: https://github.com/alphagov/verify-dropwizard-saml
.. _verify-metadata-generator: https://github.com/alphagov/verify-metadata-generator
