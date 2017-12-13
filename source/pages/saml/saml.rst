.. _saml:

SAML
====

:ref:`Security Assertion Markup Language <glosssaml>` (SAML) is an open standard for securely exchanging information about identities.

Your service must use a system to send SAML messages to the Verify Hub and receive SAML responses in return. This system is known as a Service Provider.

You can either:

- use a Service Provider built by Verify, known as the `Verify Service Provider <https://github.com/alphagov/verify-service-provider>`_ (recommended)
- configure an off-the-shelf product to use as a Service Provider
- build your own Service Provider

.. _saml_docs:

.. rubric:: Verify Service Provider

Refer to the `documentation on GitHub to find out how to download, configure and use the Verify Service Provider <https://github.com/alphagov/verify-service-provider>`_.

You can use the Verify Service Provider to:

- generate a SAML (AuthnRequest) request to send to the Verify Hub
- translate the SAML response from the Verify Hub into JSON

You must host the Verify Service Provider on your own infrastructure. You can connect multiple services to one instance.

To use the Verify Service Provider, you need to have:

- Java 8
- a working :ref:`Matching Service Adapter <msa>`

.. rubric:: Use or build a different Service Provider

If you choose to configure an off-the-shelf product or build your own Service Provider, you need to:

- understand :ref:`how SAML works with GOV.UK Verify <samlWorks>`
- decide how to :ref:`add the SAML functionality to your service <ChooseProductFramework>`

You must also follow:

* '`Identity Assurance Hub Service SAML 2.0 Profile <https://www.gov.uk/government/publications/identity-assurance-hub-service-saml-20-profile>`_' – describes the SAML specifications you must respect to connect to the GOV.UK Verify hub
* '`Identity Assurance Hub Service Profile – Authentication Contexts <https://www.gov.uk/government/publications/identity-assurance-hub-service-profile-authentication-contexts>`_' – describes how the level of assurance is specified
* '`Identity Assurance Hub Service Profile – SAML Attributes <https://www.gov.uk/government/publications/identity-assurance-hub-service-profile-saml-attributes>`_' – describes the matching dataset attributes and fraud event assertion attributes

You must also :ref:`run SAML compliance tests <samlComplianceTool>`.

The SAML profile used by GOV.UK Verify builds on the `OASIS documentation for the SAML 2.0 standard <https://www.oasis-open.org/standards#samlv2.0>`_.


.. toctree::
   :hidden:

   samlWorks
   samlIntegration
   samlComplianceTool
   generateSelfSignedCertificates
