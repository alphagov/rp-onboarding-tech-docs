.. _samlWorks:

How SAML works with GOV.UK Verify
----------------------------------

SAML messages take the form of requests and responses. Messages can contain assertions about the user's identity. GOV.UK Verify uses the following types of assertion:

* identity assertions – contain information about the user
* authentication context assertions – contain information related to how authentication was carried out, for example, the :ref:`level of assurance <gloss_loa>`
* fraud event assertions – contain identifiers related to an identified fraud detected by the identity provider

The SAML profile defines these assertions. See the :ref:`list of documents defining the SAML profile <saml_docs>`.

All SAML messages that pass between the government service, the hub, and identity providers are sent via the user's browser.

This diagram shows the SAML message flow within the GOV.UK Verify federation. The numbers identify each stage in the flow. See below for explanations.

.. _samlflow_diagram:

.. csv-table::
   :widths: 80, 15
   :name: flow-diagram

   ".. figure:: samlFlow.svg
     :alt: Diagram showing a SAML message flow in GOV.UK Verify architecture. Communication between government service, the hub, and identity providers is via SAML and passes through the user's browser. Communication between the hub and the Matching Service Adapter is via SAML using SOAP. Communication between the Matching Service Adapter, the local matching service, and the local matching data store is not SAML. The text below the image describes the SAML messages sent between entities in the federation.","For more details, see:

   * :ref:`GOV.UK Verify architecture <arch>`
   * :ref:`matching cycles <matchingcycles>`
   * :ref:`create user accounts <createnewaccounts>`"

1. The user initiates the Verify process from their browser when they request to log into the government service.

2. The government service sends a JSON authentication request to the Verify Service Provider (VSP). The VSP converts the JSON request into a SAML authentication request.

3. The VSP sends the SAML authentication request back to the government service. The government service then signs the SAML request and forwards it to the GOV.UK Verify hub. The request shows that a user wants to access the government service and needs to prove their identity using GOV.UK Verify.

 .. image:: step1.svg
     :alt: Diagram showing a SAML authentication request signed by the government service


4. The GOV.UK Verify hub prompts the user to select an identity provider to authenticate them. The GOV.UK Verify hub anonymises the government service and forwards the SAML authentication request to the identity provider the user chose. The identity provider authenticates the user based on the required :ref:`level of assurance <gloss_loa>`

 .. image:: step2.svg
      :alt: Diagram showing a SAML authentication request signed by the hub


5. The identity provider then :ref:`signs <pki_sign_cert>` and sends a SAML response to the GOV.UK Verify hub. The SAML response contains an authentication context assertion and an identity assertion, both signed by the identity provider and :ref:`encrypted <pki_encrypt_cert>` for the GOV.UK Verify hub. The authentication context assertion validates the user's authentication and contains the :ref:`level of assurance <gloss_loa>`. The identity assertion contains the user's :ref:`matching dataset <gloss_mds>` and the :ref:`persistent identifier <gloss_persid>`.

 .. image:: step3.svg
      :alt: Diagram showing a SAML response signed by the identity provider. It contains an authentication context assertion signed by the identity provider and encrypted for the hub. It also contains an identity assertion signed by the identity provider and encrypted for the hub.

 To learn more about the contents of the assertions, see :ref:`matching cycles <matchingcycles>` and :ref:`user account creation <createnewaccounts>`.


6. The GOV.UK Verify hub signs and sends a SAML attribute query to the government service’s Matching Service Adapter. The SAML attribute query is encrypted for the Matching Service Adapter and contains the identity assertion signed by the identity provider.

 .. image:: step4.svg
      :alt: Diagram showing a SAML attribute query signed by the hub. It contains an identity assertion signed by the identity provider and encrypted for the Matching Service Adapter.


7. The Matching Service Adapter anonymises the identity provider, translates the SAML attribute query into a JSON matching request, and forwards it to the service’s Local Matching Service. The Local Matching Service tries to :ref:`match<matching>` the user with a record in the government service’s database.


8. The Local Matching Service returns a ``match`` or ``no-match`` JSON response to the Matching Service Adapter.


9. If the response is ``match``, the Matching Service Adapter translates the JSON response into a SAML attribute query response, signs it, and forwards it to the GOV.UK Verify hub. The attribute query response contains an assertion signed by the Matching Service Adapter and encrypted for the GOV.UK Verify hub. The assertion contains the hashed persistent identifier, the ID of the matched record from the government service database, and level of assurance.

 .. image:: step7.svg
       :alt: Diagram showing a SAML attribute query response signed by the Matching Service Adapter. It contains an assertion signed by the Matching Service Adapter and encrypted for the hub.


10. The GOV.UK Verify hub signs and sends a SAML response to the government service, completing user authentication. The SAML response contains an assertion signed by the Matching Service Adapter and is encrypted for the government service. The government service forwards it to the VSP for verification and translation to JSON.

 .. image:: step8.svg
      :alt: Diagram showing a SAML response signed by the hub. It contains an assertion signed by the Matching Service Adapter and encrypted for the government service.


11. The VSP returns a JSON response to the government service, forarding the record ID for the matched identity.

12. The government service gets the user's record from the datastore based on the record ID. This allows the government service to interact with the user.
