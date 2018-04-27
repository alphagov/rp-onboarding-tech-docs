.. _samlComplianceToolScenarios:

Compliance tool scenarios
=========================

These are the scenarios your service needs to be able to handle

* :ref:`Basic Successful Match Response <CTscenarioMatch>`
* :ref:`Basic No Match Response <CTscenarioNoMatch>`
* :ref:`No Authentication Context Response <CTscenarioNoAuthnContext>`
* :ref:`Authentication Failed Response <CTscenarioAuthnFailed>`
* :ref:`Account Creation Response <CTscenarioAccountCreation>`
* :ref:`Fraudulent match response with assertions signed by hub <CTscenarioFraud>`

.. _CTscenarioMatch:

Basic Successful Match Response
------------------------------------------------
The user has been verified successfully at the required level of assurance (LoA). Users with higher LoA identity accounts should be allowed to access services requiring lower LoA, but not the other way around.

In this case, you should make sure that the user arrives to a page useful to them, for example the service home page.

.. _CTscenarioNoMatch:

Basic No Match Response
------------------------------------------------
A match was not found by the :ref:`Local Matching Service <localmatchingservice>`. Depending on your service, you could:

* :ref:`Tell the user about alternatives <CTscenarioMatchAlternatives>`
* :ref:`Take the user to their new account page <CTscenarioMatchAccount>`

.. _CTscenarioMatchAlternatives:

Tell the user about alternatives
````````````````````````````````
Because there was no match in the service database, the user cannot access the service.

In this case, let the user know what their alternatives are, for example, "We could not match your identity with an entry from our database. You can still apply for a vehicle operator licence by post."

.. _CTscenarioMatchAccount:

Take the user to their new account page
```````````````````````````````````````
Some services choose to create a new account if they found no match in their database. If account creation is implemented, the Verify Team need to see that the user arrives to a page that is useful to them, for example the service home page.

.. _CTscenarioNoAuthnContext:

No Authentication Context Response
------------------------------------------------
This response can happen for a number of reasons, but the most common cases  are:

* :ref:`Session timeout <CTscenarioNoAuthnContextTimeout>`
* :ref:`Cancellation by the user <CTscenarioNoAuthnContextCancel>`
* :ref:`Failure to authenticate at an appropriate LoA <CTscenarioNoAuthnContextLoA>`

.. _CTscenarioNoAuthnContextTimeout:

Session timeout
````````````````````````````````
Before completing the verification process with the identity provider, the user became inactive. In this case the user has to restart the verification process.

.. _CTscenarioNoAuthnContextCancel:

Cancellation by the user
````````````````````````````````
During the identification process with the identity provider, the user selected **Cancel**. In this case, send the user back to the page where they start answering questions to help them choose the identity provider.

.. _CTscenarioNoAuthnContextLoA:

Failure to authenticate at an appropriate LoA
`````````````````````````````````````````````````````````````
This happens when there is an attempt to authenticate with a lower LoA than required by your service. This would be a fraudulent attempt rather than a real user.

In this case, show a generic error saying something went wrong and suggest alternatives, for example "Something went wrong. We’re working on fixing this problem so please try again later. You can also apply for a vehicle operator licence by post."

.. _CTscenarioAuthnFailed:

Authentication Failed Response
------------------------------------------------
The user was not authenticated successfully when trying to sign into their account with the identity provider. The identity provider should help the user continue their journey.

.. _CTscenarioAccountCreation:

Account Creation Response
------------------------------------------------
This is only relevant if your service creates new user accounts.

The response contains a hashed persistent identifier (PID) and attributes of the user that can be used to identify or create an account.

In this case, the user successfully created an account with your government service and you should make sure they arrive at a page useful to them, for example a personal account.

.. _CTscenarioFraud:

Fraudulent match response with assertions signed by hub
-------------------------------------------------------
Your service should only trust assertions signed by your matching service adapter, but in case of a fraudulent match, the response has an assertion signed with the Verify Hub's private key.

In this case, the user should see a generic error saying something went wrong, for example "Something went wrong. We’re working on fixing this problem so please try again later or apply for a vehicle operator licence by post".
