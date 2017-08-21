.. _steps:

Steps to integrate GOV.UK Verify into your service
===================================================

Development
~~~~~~~~~~~~~~

Prerequisites:

*  :ref:`choose a product and framework <ChooseProductFramework>` to integrate your service with GOV.UK Verify
*  decide how to :ref:`store and manage keys <pki_store_private_key>` and certificates so you can :ref:`rotate your keys <pkiRotate>` when needed

.. note:: You only need to deploy your code to a server at the end of the development phase, when you test your matching service with the SAML compliance tool. You can do all development steps until this point on a development machine. 


.. csv-table:: 
   :header: "Step", "What you need to do"
   :name: "stepsdev"
   :widths: 1, 10


   "1.", "**Set up the Matching Service Adapter for the SAML compliance tool.** 

   To do this: 

    1. :ref:`Download and install the Matching Service Adapter <msa_install_msa>`.
    2. :ref:`Generate self-signed certificates for the SAML compliance tool <samlCTselfsigncert>`.
    3. :ref:`Configure the Matching Service Adapter for the SAML compliance tool <ConfigureMSA>`.

   Outcome:  you can start building your service.

   .. _step-build-lms: 

   For more information, see :ref:`msa`."
   "2.", "**Build a local matching service.** 

   To do this:

    1. :ref:`Define your matching strategy <ms_strat>` with your service manager.
    2. Use the :ref:`example JSON matching request <RespondJSONmr>` and the :ref:`JSON schema <JSONschema>` to help build your local matching service.

   Outcome: your service can match users’ verified identities to your data sources.

   .. _step-setup-msaforsaml: 

   For more information, see :ref:`msWorks`."
   "3.", "**Build a service that produces and consumes SAML.** 

   To do this: 

    1. :ref:`Connect your service to the Matching Service Adapter metadata <ConfigureAdaptTechnology>`.
    2. :ref:`Send an authentication request to the GOV.UK Verify hub <saml_consume_responses>`.
    3. :ref:`Handle the SAML response from the GOV.UK Verify hub <saml_handle_responses>` . 

   Outcome: you're ready to run SAML compliance tests.

   .. _step-run-saml-tests:

   For more information, see :ref:`samlWorks` and the '`Identity Assurance Hub Service SAML 2.0 Profile <https://www.gov.uk/government/publications/identity-assurance-hub-service-saml-20-profile>`_' ."
   "4.", "**Run SAML compliance tests.** 

   To do this: 

    1. :ref:`Test your service with the SAML compliance tool <samlCTservicehub>`.
    2. :ref:`Test your matching service with the SAML compliance tool <samlCThubMSA>`.

   Outcome: your service and matching service can consume and produce valid SAML.

   For more information, see see :ref:`samlWorks`."

Integration
~~~~~~~~~~~~~~   

.. csv-table:: 
   :header: "Step", "What you need to do"
   :name: "stepsinteg"
   :widths: 1, 10

   "1.", "**Request access to the integration environment.** 

   To do this:

    1. Obtain :ref:`signed certificates <pkiRequestCert>` for the integration environment from the IDAP test certificate authority. 

    2. Fill in the ':ref:`Request access to an environment <envRequestform>`' form.

   Outcome: you're ready to connect the Matching Service Adapter and your service to the integration environment.
 
   .. _step-connect-msa-int-env:

   For more information, see :ref:`env` and :ref:`pkiWorks`."
   "2.", "**Connect the Matching Service Adapter and your service to the integration environment.** 

   To do this:

    1. :ref:`Download and install the Matching Service Adapter <msa_install_msa>`.
    2. :ref:`Configure the Matching Service Adapter for the integration environment <ConfigureMSA>`.

   Outcome: you're ready to run end-to-end testing with test users.

   .. _step-run-end-to-end-tests:

   For more information, see :ref:`msa` and :ref:`env`."
   "3.", "**Run end-to-end testing of all your user journeys in the integration environment.** 

   To do this:

    1. :ref:`Set up authentication to manage test users <CreateAuth>`.
    2. :ref:`Create test users <CreateTestUsers>`.
    3. :ref:`Run end-to-end tests <RunEtoEtest>`.

   Outcome: your service can handle all the possible outcomes of end-to-end user journeys.

   .. _step-request-prod-env:

   For more information, :ref:`env`."
   "4.", "**Request access to the production environment.** 

   To do this:

    1. Obtain :ref:`signed certificates <pkiRequestCert>` for the production environment from the IDAP certificate authority. 

    2. Fill in the ':ref:`Request access to an environment <envRequestform>`' form.

   Outcome: you're ready to connect the Matching Service Adapter and your service to the production environment.

   .. _step-connect-MSA-prod-env:

   For more information, see :ref:`env` and :ref:`pkiWorks`."
   "5.", "**Connect the Matching Service Adapter and your service to the production environment.** 

   To do this:
 
    1. :ref:`Download and install the Matching Service Adapter <msa_install_msa>`.
    2. :ref:`Configure the Matching Service Adapter for the production environment <ConfigureMSA>`.

   Outcome: your service is ready to go live.

   For more information, see :ref:`msa` and :ref:`env`."

Maintenance
~~~~~~~~~~~~~~

.. csv-table:: 
   :header: "Step", "For more information"
   :name: "stepsmaint"
   :widths: 1, 10

   "1.", "**Rotate your keys**.

    When the certificates containing your public keys are due to expire, :ref:`replace your keys and certificates <pkiRotate>`.

    Outcome: the encryption and signing certificates for your service and Matching Service Adapter are up to date.

    For more information, see :ref:`pkiWorks`."

