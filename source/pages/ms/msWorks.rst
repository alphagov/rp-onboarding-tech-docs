.. _msWorks:

How a matching service works
============================

.. caution:: This documentation is no longer maintained. :ref:`View the latest documentation on matching. <matching>`.

.. _ms_matchcycles:

Matching cycles
---------------

The matching process consists of 3 matching cycles. The cycles are progressive attempts to match the user to the correct record in the government service's data sources:

* :ref:`Cycle 0: persistent identifier match <ms_mc0>`
* :ref:`Cycle 1: matching dataset match <ms_mc1>`
* :ref:`Cycle 3: additional information match <ms_mc3>`


Cycle 2 is not currently implemented.

The GOV.UK Verify hub issues a single call for matching cycles 0 and 1, then a subsequent call for matching cycle 3. In your :ref:`matching strategy <ms_strat>`, you can run cycle 0 first. Then, if there is no match, you can run cycle  1 before returning the response to the Matching Service Adapter.

If there's no match after the 3 cycles, you can :ref:`create a new account <ms_cua>` for the user. Some services may decide to create a new account after only 1 matching cycle. This applies to services where users are creating new digital accounts rather than relying on existing government service data sources.

When an identity provider verifies a user's identity, they send an assertion to the :ref:`Matching Service Adapter<MSA>` via the hub. This assertion contains information about the user's identity used in the different matching cycles, including the :ref:`persistent identifier <gloss_persid>` (PID) and the :ref:`matching dataset <gloss_mds>`.

.. _ms_mc0:

Cycle 0: persistent identifier match
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

This cycle works when a user has previously verified their identity with the same identity provider.

When an identity provider verifies a user's identity, they assign a unique PID to that user. The identity provider sends the PID to the Matching Service Adapter, via the hub. The Matching Service Adapter then hashes the PID.


Cycle 0 matches the user's :ref:`hashed PID <gloss_hashpid>` to an existing hashed PID in the local matching datastore. This succeeds only if the user has previously been matched by your service with the same identity provider. The first time a new user is matched (with cycle 1), the hashed PID is written to the local matching datastore. It is then used for subsequent cycle 0 matches.

.. _ms_mc1:

Cycle 1: matching dataset match
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

This cycle uses a limited set of information called the :ref:`matching dataset <gloss_mds>` to check for a match between the user and the correct record.

The identity provider verifies the information in the matching dataset (except gender).

The identity provider that verified the user’s identity provides the matching dataset. The identity provider verifies the information in the matching dataset (except gender). Your local matching service can use any or all the details in the matching dataset to confirm a match between the user and their existing record. Your service’s :ref:`matching strategy <ms_strat>` specifies which details to use.

If the local matching service finds a match, it creates a correlation between the hashed PID and the existing record. This enables cycle 0 matching to occur during subsequent transactions.


Cycle 2: (not used)
^^^^^^^^^^^^^^^^^^^

Cycle 2 uses trusted attributes related to identity, for example, being a disabled badge holder, to enhance the matching process.

..  note:: Cycle 2 is not currently supported by GOV.UK Verify.


.. _ms_mc3:

Cycle 3: additional information match
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

If cycle 1 finds more than 1 potential match, cycle 3 asks the user for some additional information, for example driving licence number. The hub collects the additional information and sends it to the matching service. The local matching service then uses it to refine the match. When the local matching service finds a match, it saves the hashed PID in the matching datastore.

This cycle is defined in the government service policy and may not be required for all matches. The government service defines the information the hub collects and how to use it for matching. For example, you decide how many pieces of additional information to request. If you request 2 pieces of information and the user can only provide 1 of them, your matching rules specify whether to match this user.

Use this cycle to enhance cycle 1 and not as an alternative to cycle 1.


Matching cycles: message flow
-----------------------------

This diagram shows the message flow for matching cycles 0, 1, and 3. The numbers identify each stage in the flow. See below for explanations.

.. _ms_matchcyles_diagram:

.. csv-table::
   :widths: 80, 15
   :name: flow-diagram

   ".. figure:: matchingcycles.svg
     :alt: Diagram showing the three matching cycles, 0, 1 and 3. The Matching Service Adapter converts between SAML and JSON. The text below the image describes the steps.

     Matching cycles 0, 1, and 3","For more details, see the diagrams:

   * :ref:`GOV.UK Verify architecture <arch>`
   * :ref:`SAML message flow <samlflow_diagram>`
   * :ref:`user account creation <ms_cua_diagram>`"


.. Note:: In this example, an identity provider has already verified a user's identity. For more details of this process, see the :ref:`SAML message flow diagram <samlWorks>`.


1. The identity provider sends the following information to the hub:

  * the user's identity information, known as the :ref:`matching dataset <gloss_mds>`
  * a unique :ref:`PID <gloss_persid>` for the identity, created by the identity provider

 The hub forwards the matching dataset and PID to the Matching Service Adapter.

2. The MSA hashes the PID to make it meaningless to other services. The MSA sends the :ref:`hashed PID <gloss_hashpid>` and the matching dataset to the local matching service.
3. The local matching service runs cycle 0:

 The local matching service tries to find a match between the user's hashed PID and a hashed PID in the local matching datastore.

 **If cycle 0 finds a match go to step 4, otherwise go to step 5.**

4. The local matching service sends a ``match`` response to the MSA and forwards it and the hashed PID to the government service via the GOV.UK Verify hub.

  The local matching service tries to find a match between the user's matching dataset and a record in government service data sources. If cycle 1 finds a match, go to step 8.

5. The local matching service runs cycle 1:

  The local matching service tries to find a match between the user's matching dataset and a record in government service data sources.

  **If cycle 1 finds a match go to step 6, otherwise go to step 8.**

6. The local matching service saves the hashed PID in a datastore along with the user's record. Future matches with cycle 0 will use this data when the same user returns, having been verified by the same identity provider.

7. The local matching service sends a ``match`` response to the MSA and forwards it and the hashed PID to the government service via the GOV.UK Verify hub.

8. The local matching service sends a ``no-match`` response to the MSA, which forwards it to the GOV.UK Verify hub.

9. The hub asks the user to provide additional information, for example, their driving licence number and sends it to the MSA.

10. The local matching service runs cycle 3:

  The local matching service tries to find a match between the user's additinal information and a record in government service data sources.

  **If cycle 3 finds a match, go to step 11, otherwise go to step 13.**

11. The local matching service saves the hashed PID in a datastore along with the user's record. Future matches with cycle 0 will use this data when the same user returns, having been verified by the same identity provider.

12. The local matching service sends a `match` response to the MSA, which forwards it and the hashed PID to the government service via the GOV.UK Verify hub.

13. The local matching service sends a `no-match` response to the MSA, which forwards it to the GOV.UK Verify hub.  In this case, the matching service can :ref:`create a new account <ms_cua>` for the user, provided your matching service supports this feature and your user journey seeks explicit user consent.
