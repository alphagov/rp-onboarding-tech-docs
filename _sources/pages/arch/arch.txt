.. _arch:

Architecture
============

GOV.UK Verify lets users prove their identity online so they can access government services. When a user wants to access a government service, a trusted identity provider performs the checks needed to prove the user’s identity. 


Below is a high-level diagram of the GOV.UK Verify architecture.


.. csv-table:: 
   :widths: 75, 20
   :name: flow-diagram

   ".. figure:: ../arch/arch_overview.svg
     :alt: Diagram showing GOV.UK Verify architecture. The hub is at the centre. It is connected to the government service, identity providers, and the Matching Service Adapter (MSA). Communication with the hub is via SAML with PKI. The MSA is connected to a local matching service, which is connected to a local matching datastore. Communication between these elements is not via SAML. The text below the image describes all elements in the architecture.

     GOV.UK Verify architecture","For more details, see the diagrams:

   * :ref:`SAML message flow <samlflow_diagram>`
   * :ref:`matching cycles <ms_matchcyles_diagram>`
   * :ref:`user account creation <ms_cua_diagram>`"


The main elements in GOV.UK Verify architecture are:

**GOV.UK Verify hub**

  The GOV.UK Verify hub is the infrastructure that manages interactions between users, government services, identity providers, and matching services for the purpose of authenticating a user who wants to use a government service.

  The hub is at the centre of the GOV.UK Verify federation, providing a clear divide between identity providers and government services. This means your service has to integrate with the GOV.UK Verify hub only. It doesn't have to integrate with several identity providers.

  The hub is stateless, which means that it doesn't store any part of the message exchange any longer than a session. Also, it ensures privacy as it doesn't hold any identity data.

  The hub ensures that the required :ref:`level of assurance <gloss_loa>` is observed. 

|

**Identity provider**

  A private sector organisation paid by government to verify a user’s identity and assert verified data that identifies them to the government service.

  The organisations are certified as meeting relevant industry security standards and the `Identity Assurance Principles <https://www.gov.uk/government/consultations/draft-identity-assurance-principles/privacy-and-consumer-advisory-group-draft-identity-assurance-principles#the-nine-identity-assurance-principles>`_ published by the Cabinet Office and the `National Cyber Security Centre <https://www.ncsc.gov.uk/>`_ (NCSC).

|

**Government service**

  A transactional government service that needs proof of a person’s identity to complete a transaction, for example:

    * view or share your driving licence information (Driver and Vehicle Licensing Agency)
    * claim a redundancy payment (Insolvency Service)

|

**Matching Service**

   The function of finding a match between a user’s verified identity and a record in a government service’s data sources. The matching service is composed of the Matching Service Adapter (MSA) and the local matching service. 

|

**Matching Service Adapter (MSA)**
 
    The :ref:`MSA <msa>` is a software tool provided by GOV.UK Verify. It simplifies communication between your local matching service and the GOV.UK Verify hub. The MSA converts Security Assertion Markup Language (SAML) into JSON (JavaScript Object Notation) and vice versa. 

|

**Local matching service**

     A local matching service finds a match between a user’s assured identity and a record in the government service's data sources, to allow the user to access the service. Because there’s no unique identifier for UK citizens, locating the record involves matching user information (for example name, address, date of birth) against the service’s records. 

**Security Assertion Markup Language (SAML)**

 :ref:`SAML <saml>` is a data format for exchanging information securely. All exchanges between the entities in the GOV.UK Verify federation use SAML but the local matching service managed by the government service usually uses JSON. 

 For more information, see the :ref:`diagram showing the SAML message flow <samlWorks>` within the GOV.UK Verify federation.

**Public key infrastructure (PKI)**

 :ref:`PKI <pki>` implements secure electronic transactions between the entities in the GOV.UK Verify federation. 




   

