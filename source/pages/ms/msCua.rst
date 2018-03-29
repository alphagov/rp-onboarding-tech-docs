
Create user accounts
====================

.. caution:: This documentation is no longer maintained. :ref:`View the latest documentation on creating user accounts. <createnewaccounts>`.

If Verify fails to identify the user, you can enable your service to create a new user account.

You must obtain explicit user consent before creating a user account.

Create new user accounts using the ':ref:`hashed persistent identifier <gloss_hashpid>`' (PID) and a subset of attributes from the ':ref:`matching dataset <gloss_mds>`', listed below.




Prerequisites
-------------

1.	Configure your MSA to create user accounts.

  - In the :ref:`YAML configuration file <ConfigureMSA>`, enter your local matching service '`accountCreationUrl:`'

2. On the :ref:`Request access to an environment <envRequestform>` form:

  - Enter the fully qualified URL that will receive your *Unknown User Attribute* requests from the environment

  - Select any of the following user attributes you require for your service


  ::

   FIRST_NAME
   FIRST_NAME_VERIFIED
   MIDDLE_NAME
   MIDDLE_NAME_VERIFIED
   SURNAME
   SURNAME_VERIFIED
   DATE_OF_BIRTH
   DATE_OF_BIRTH_VERIFIED
   CURRENT_ADDRESS
   CURRENT_ADDRESS_VERIFIED
   ADDRESS_HISTORY
   CYCLE_3

  .. note:: User Accounts can only be created with the user's current 'NAME' and 'Date of Birth' data.  ADDRESS_HISTORY will return any address known to be associated with the user, within the last three years.

Message flow
------------

This diagram shows the message flow for creating user accounts. In this example, the service has been set up to create user accounts when matching fails.

.. csv-table::
   :widths: 80, 15
   :name: flow-diagram

   ".. figure:: createanaccount.svg
     :alt: Diagram showing user account creation. The MSA converts between SAML and JSON. The MSA contains a fully qualified URL to which the hub makes unknown user attribute query requests. The text below the image describes the steps.

     User account creation","For more details, see the diagrams:

   * :ref:`GOV.UK Verify architecture <arch>`
   * :ref:`SAML message flow <samlflow_diagram>`
   * :ref:`matching cycles <ms_matchcyles_diagram>`"

.. note:: In this example, all 3 :ref:`matching cycles <ms_matchcycles>` previously failed to find a match for the user in the government service records. See the :ref:`diagram for matching cycles <ms_matchcyles_diagram>`.

1.	Your local matching service sends a ``no-match`` response to the hub via the MSA.
2.	The GOV.UK Verify hub:

  * checks that your matching service supports the creation of user accounts
  * identifies the attributes you previously said your service needs to create a user account

3. If your service supports the creation of user accounts, the hub sends a query to the MSA. It contains the:

  * :ref:`matching dataset <gloss_mds>`
  * :ref:`hashed PID <gloss_hashpid>`
  * :ref:`level of assurance <gloss_loa>`
  * list of attributes to extract from the matching dataset

4. The MSA POSTs the following JSON to the local matching service's account creation URI endpoint:

  ::

   [{
    "hashedPid": "<string value>",
    "levelOfAssurance": "<the level of assurance, e.g. LEVEL_1>"
   }]

5. Optionally, the local matching service stores the hashed PID and level of assurance in the local matching datastore.

   You'll need to create a correlation between the user account and the hashed PID, so a returning user can match with :ref:`cycle 0 <ms_mc0>`. You can choose to store the hashed PID at this point and create a correlation between the user account and the hashed PID at step 9. Alternatively, you can create the user account, store the hashed PID and set up the correlation at step 9.

6. The local matching service sends a JSON response to the MSA:


   ::

     { "result": "success" }

   or

   ::

     { "result": "failure" }

  .. note:: As shown above, ``success`` and ``failure`` must be in lower case.

  .. note:: A user account isn't created at this point. The final response the hub sends to your service will contain the attributes you need to create a user account.

  The local matching service may return ``{ "result": "failure" }`` if:

  * the level of assurance in the JSON request sent by the MSA is lower than the level of assurance required by the service
  * there are exceptional circumstances, such as maintenance, when you want to suspend user account creation

7. The MSA extracts the required attributes from the matching dataset.

8. The MSA sends the extracted attributes, the hashed PID and the level of assurance to your service via the GOV.UK Verify hub.

  .. note:: The MSA must send this data via the GOV.UK Verify hub, to respect the following identity assurance principles:

    * user control - users must give informed consent for their information to be used to create an account; they must also be allowed to check their information before you create the account
    * data minimisation – the service receives only the restricted set of attributes it needs, not the full matching dataset.

    For more information see the `Identity Assurance Principles <https://www.gov.uk/government/consultations/draft-identity-assurance-principles/privacy-and-consumer-advisory-group-draft-identity-assurance-principles#the-nine-identity-assurance-principles>`_.

9. The government service:

   * creates a user account using the attributes extracted from the matching dataset
   * sets up a correlation between the user account and the user's hashed PID

  .. important:: If you create a user account you must gain consent from the user first.
