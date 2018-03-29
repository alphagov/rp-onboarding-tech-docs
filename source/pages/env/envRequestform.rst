.. _envRequestform:

Request access to environments
===============

GOV.UK Verify provides 2 identical, secure environments:

- Integration
- Production

Integration allows you to test your prototype service with dummy user data.

Production allows you to host your fully-developed beta or live service with real user data.

You must complete a short form with information about your service so GOV.UK Verify can set up each environment for you. This can take up to 5 working days.

You’ll need to submit a form for each environment you need.

`Submit form. <https://verify-environment-access.cloudapps.digital/>`_

**Before you start**

The form does not store data between sessions. You must make sure you have all the information available to submit the form within a single session.

To complete the form you’ll need to share URLs for your:

- service and `Matching Service Adapter <http://alphagov.github.io/rp-onboarding-tech-docs/pages/msa/msa.html?highlight=matching%20service%20adapter>`_
- service start point or page, `Verify SAML response <http://alphagov.github.io/rp-onboarding-tech-docs/pages/saml/samlIntegration.html?highlight=saml%20response>`_ and Matching Service

You’ll need to provide web content to personalise the Verify Hub for your end users, including:

- your agency or department name (as you need it to appear to the user)
- a display name for your Verify service (as you need it to appear to the user)
- contact details for your service
- a description of other ways users can access your service

You’ll need to provide `valid, signed IDAP X.509 Public certificates <http://alphagov.github.io/rp-onboarding-tech-docs/pages/pki/pkiRequestCert.html#pkirequestcert>`_ for:

- service signature validation
- service encryption
- Matching Service Adapter signature validation
- Matching Service Adapter encryption

If applicable to your service, you’ll need to provide:

- `Cycle 3 attributes <http://alphagov.github.io/rp-onboarding-tech-docs/pages/ms/msWorks.html?highlight=cycle#ms-mc3>`_, for example driving licence or passport number
- `‘New User’ account <http://alphagov.github.io/rp-onboarding-tech-docs/pages/ms/msWorks.html?highlight=cycle#ms-mc3>`_ attributes, for example first name, middle name, surname, date of birth, current address

For Integration environments, you’ll also need to provide a username and 8 character password to manage the test user data.

`Submit form to request an environment. <https://verify-environment-access.cloudapps.digital/>`_
