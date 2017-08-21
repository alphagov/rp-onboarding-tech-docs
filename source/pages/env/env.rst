
.. _env:

GOV.UK Verify environments
================================================

An environment is a fully-working deployment of the GOV.UK Verify hub. GOV.UK Verify maintains a number of environments for development, testing, and operational purposes. As a government service you need to work in the integration and production environments. 

.. rubric:: What is the integration environment?


The integration environment is a production-sized deployment of the GOV.UK Verify hub. It's a restricted environment for security reasons. 

The purpose of the integration environment is to make sure that your service operates with the GOV.UK Verify hub. The integration environment is designed to test full end-to-end flows and to showcase a working system. It's not a development environment. Each government service usually has a single connection to the integration environment. 


.. rubric::  What is the production environment?


The production environment is where you deploy your live end-to-end service. It's a restricted environment for security reasons. 

.. rubric:: What do you need to do?

Before you access the integration environment, run :ref:`SAML compliance tests <samlComplianceTool>` to make sure that your service is compliant with the SAML profile.  On successful completion of compliance tests, you'll access the integration environment.

For more information, see :ref:`steps`.

To access the integration environment: 

#. Obtain :ref:`signed certificates <pkiRequestCert>` for the integration environment from the appropriate IDAP certificate authority. 

#. Provide additional details of your service in the ':ref:`Request access to an environment <envRequestform>`' form.

In the integration environment, you'll run :ref:`end-to-end testing <envEndToEndTests>`. On successful completion of end-to-end testing you'll access the production environment. To access the production environment use the same procedure as above.

.. toctree::
   :hidden:

   envRequestform
   envEndToEndTests
  

