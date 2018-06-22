.. _samlWorks:

How SAML works with GOV.UK Verify
----------------------------------

SAML messages take the form of requests and responses. Messages can contain assertions about the user's identity. GOV.UK Verify uses the following types of assertion:

* identity assertions – contain information about the user
* authentication context assertions – contain information related to how authentication was carried out, for example, the level of assurance
* fraud event assertions – contain identifiers related to an identified fraud detected by the identity provider

The SAML profile defines these assertions. See the :ref:`list of documents defining the SAML profile <saml_docs>`.

All SAML messages that pass between the government service, the hub, and identity providers are sent via the user's browser.

This diagram shows the SAML message flow within the GOV.UK Verify federation. The numbers identify each stage in the flow. See below for explanations.

.. _samlflow_diagram:

.. csv-table::
   :widths: 80, 15
   :name: flow-diagram

   ".. figure:: samlFlow.png
     :alt: Diagram showing a SAML message flow in GOV.UK Verify architecture. Communication between government service, the hub, and identity providers is via SAML and passes through the user's browser. Communication between the hub and the Matching Service Adapter is via SAML using SOAP. Communication between the Matching Service Adapter, the local matching service, and the local matching data store is not SAML. The text below the image describes the SAML messages sent between entities in the federation.

     SAML message flow in the GOV.UK Verify federation","For more details, see:

   * :ref:`GOV.UK Verify architecture <arch>`
   * :ref:`matching cycles <matchingcycles>`
   * :ref:`create user accounts <createnewaccounts>`"

1. The user initiates the Verify process from their browser.

2. The government service sends a JSON authentication request to the Verify Service Provider (VSP)

3. The VSP returns a SAML authentication request to the government service, which forwards it to the GOV.UK Verify hub. The request indicates that a user wants to access the service and needs to prove their identity using GOV.UK Verify.

 .. image:: step1.svg
     :alt: Diagram showing a SAML authentication request signed by the government service


4. The GOV.UK Verify hub prompts the user to select an identity provider to authenticate them. The GOV.UK Verify hub forwards the SAML authentication request to the chosen identity provider.

 .. image:: step2.svg
      :alt: Diagram showing a SAML authentication request signed by the hub


5. The chosen identity provider authenticates the user based on the required :ref:`level of assurance <gloss_loa>`. The identity provider then sends a SAML response to the GOV.UK Verify hub:

 .. image:: step3.svg
      :alt: Diagram showing a SAML response signed by the identity provider. It contains an authentication context assertion signed by the identity provider and encrypted for the hub. It also contains an identity assertion signed by the identity provider and encrypted for the hub.

 * SAML response :ref:`signed <pki_sign_cert>` by the identity provider
 * authentication context assertion signed by the identity provider and :ref:`encrypted <pki_encrypt_cert>` for the GOV.UK Verify hub – this asserts that the user's identity is authenticated; it also contains contextual information, including the :ref:`level of assurance <gloss_loa>`
 * identity assertion signed by the identity provider and encrypted for the GOV.UK Verify hub – this contains the user's :ref:`matching dataset <gloss_mds>` and the :ref:`persistent identifier <gloss_persid>`

 .. note:: For more information on the contents of the assertions, see :ref:`matching cycles <matchingcycles>` and :ref:`user account creation <createnewaccounts>`.


6. The GOV.UK Verify hub sends a SAML attribute query to the government service’s Matching Service Adapter:

 .. image:: step4.svg
      :alt: Diagram showing a SAML attribute query signed by the hub. It contains an identity assertion signed by the identity provider and encrypted for the Matching Service Adapter.

 * SAML attribute query signed by the GOV.UK Verify hub
 * identity assertion signed by identity provider and encrypted for the Matching Service Adapter


7. The Matching Service Adapter translates the SAML attribute query into a JSON (JavaScript Object Notation) matching request and forwards it to the service’s local matching service.


 The local matching service tries to match the user with a record in the government service’s database.


8. The local matching service returns a JSON response (``match`` or ``no match``) to the Matching Service Adapter.
9. In the case of a ``match`` response, the Matching Service Adapter translates the JSON response into a SAML attribute query response and forwards it to the GOV.UK Verify hub:

 .. image:: step7.svg
       :alt: Diagram showing a SAML attribute query response signed by the Matching Service Adapter. It contains an assertion signed by the Matching Service Adapter and encrypted for the hub.

 * SAML attribute query response signed by the Matching Service Adapter
 * assertion signed by the Matching Service Adapter and encrypted for the GOV.UK Verify hub – this assertion contains the hashed persistent identifier


10. The GOV.UK Verify hub sends a SAML response to the service, authenticating the user; the service hands it to the VSP for verification and translation to JSON:

 .. image:: step8.svg
      :alt: Diagram showing a SAML response signed by the hub. It contains an assertion signed by the Matching Service Adapter and encrypted for the government service.

 * SAML response signed by the GOV.UK Verify Hub
 * assertion signed by the Matching Service Adapter and encrypted for the government service


11. The VSP returns a JSON response to the service authenticating the user.

12. The government service gets the user's record from the datastore. This allows the government service to interact with the user.
