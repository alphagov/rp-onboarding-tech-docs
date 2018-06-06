.. _matchingstrategy:

Decide your matching strategy
=====================================

Your matching strategy should define your rules for matching and what should happen when:

- a matching record is found
- multiple records are found that could be a match
- no match is found

It’s up to each service to decide their own matching strategy, but this guidance provides an overview of things to consider.

`Contact the GOV.UK Verify team <mailto:idasupport+onboarding@digital.cabinet-office.gov.uk>`_ for help deciding and implementing your matching strategy.

.. rubric:: Common matching difficulties

.. _commondifficulties:

You need a matching strategy because matching an identity to a record is often affected by problems such as:

- spelling mistakes
- transcription errors
- twins with very similar information
- incorrect or outdated information in your service’s data sources, for example, if someone has moved house or changed their last name
- inconsistent use of upper and lower case letters in names, for example McDonald, MacDonald, and Macdonald
- variations with special characters, for example the difference between an apostrophe and single quotation mark in O’Reilly
- the use of shortened names or nicknames for the same person, for example, William Smith, Bill Smith and David William Smith
- date transposition for birth date, for example 02/07/1962 and 07/02/1962 or typos such as 1989 and 1998
- phonetic spellings, for example if the data was collected in phone calls
- an individual removing diacritical marks from their data, for example inputting Günther as Gunther

Matching can also be affected by changes to the data since it was collected. For example, if the schema for the datasource changes.

Different identity providers will use different data sources to check an individual’s identity. Because of this, the data you receive from one identity provider through the GOV.UK Verify Hub may look different to data from another identity provider. For example, if an individual does not have a middle name, one identity provider might list it as 'null' when another identity provider might leave the attribute blank.

^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Decide rules for matching and confidence scores
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. _matchingrules:

You should decide, and clearly document, what rules you will use for matching. For example, whether you will allow synonyms for first names such as William and Bill and how you will deal with :ref:`common difficulties <commondifficulties>`.

You should also decide which extra attributes to use to increase confidence in your matches. For example, passport number. You can then design your matching service to prompt the GOV.UK Verify Hub to request additional attributes from the identity provider.

Your matching rules should aim to reduce the number of false positives and negatives. A false positive is where your matching service returns a match that is wrong. A false negative is where your matching service returns no match, but a record for the individual does exist in the datasource(s).

You can minimise false positives by :ref:`making sure your datasource(s) are clean and accurate before using them for matching <preparedata>`.

You can minimise false negatives by thoroughly testing your matching strategy on your datasource(s), analysing the results, and iterating your matching rules.

.. rubric:: Fuzzy matching

.. _fuzzymatching:

As well as looking for exact matches, you should consider looking for records that are an approximate match. The process for finding approximate matches is known as `fuzzy or probabilistic matching <https://en.wikipedia.org/wiki/Record_linkage>`_.

Much like finding exact matches, you will need to decide the rules for this matching process. The more relaxed your rules, the more ‘fuzzy’ your matching. You’ll be more likely to receive false positives. The tighter your rules, the less ‘fuzzy’ your matching. You’ll be more likely to receive false negatives.

However, if the risk of the wrong fuzzy match is low, you may decide to allow a fuzzy match with a low confidence score to access your service.

Deterministic matching relies on comparing the exact data from the identity provider with an existing record to find a precise match; fuzzy or probabilistic matching instead looks at whether there is enough shared information to be considered a match.

There are several fuzzy matching techniques you can use to search for matches, including:

- Levenshtein
- phonetic algorithms

**Levenshtein**

.. _levenshtein:

It can also be useful to assess how much the record and data from the identity provider disagree. You can do this by measuring the number of changes that need to be made to a string for it to match with another. The number of changes is known as the edit or `Levenshtein distance <https://en.wikipedia.org/wiki/Levenshtein_distance>`_.

The higher the Levenshtein distance, the greater the difference between the 2 strings.

For example, 'Smith' and 'Smithy' only requires one inserted character, ``y`` for it to match so it has a Levenshtein distance of 1. However, ‘Smithy’ and ‘Smithe’ has a Levenshtein distance of 2 as it requires the removal of one character ``y`` and the insertion of character ``e``.

If you want to reduce the risk of false positives, you might choose to restrict fuzzy matching to cases with a maximum Levenshtein distance or 2 or 3.

**Phonetic algorithms**

.. _phonetic:

You can use phonetic algorithms such as `Metaphone <https://en.wikipedia.org/wiki/Metaphone>`_ and `Soundex <https://en.wikipedia.org/wiki/Soundex>`_ help to identify words or names that sound similar.

These algorithms can help encode homophones in the same way so they can be matched by your matching service. For example, Metaphone transforms words with a 'ck' sound to 'k'.

This can be particularly helpful if your data was collected through telephone calls with users. For example, if a user called Philip gave his information to a telephone operator who entered his first name as ``Phillip``, phonetic algorithms would help you search for records matching ``Philip`` with a single ``l``.

.. rubric:: Confidence scores

.. _confidencescores:

You should assign a ‘score’ to indicate how confident you are in a match. You should aim to produce a single match with the highest confidence score.

For example, a high confidence score could suggest first name, last name, date of birth, and address all match to a record in your local datastore(s).

The risk of a mismatch to your service will affect the level of confidence required. For example, if your service is at high risk of identity fraud and uses LOA2, you will need a higher confidence in your matches than a service with a low risk of identity fraud.

You should test your matching rules and confidence scores regularly and iterate them based on the results.

^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Matching cycles
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The matching process consists of 3 matching cycles. The matching service should run each cycle in turn to attempt to match the user to the correct record in the local data source. Each matching cycle uses an increasing number of attributes from the identity provider to search for a match.

If, after 3 cycles, there’s no match, you can decide if you want to create a new account for the user.

The matching service uses limited information from the GOV.UK Verify Hub to run matching cycles. The limited information includes the persistent identifier (PID) and matching dataset.

.. rubric:: PID and matching dataset

.. _pidandmd:

When an identity provider verifies a user’s identity, they assign a unique persistent identifier (PID) to that user. The PID is a unique identifier that refers to a user and the identity provider that verified the user’s identity. It’s a pseudo-random value that has no resemblance to any real information from a user, for example their email address or name.

If a user verifies using multiple identity providers, that user will have multiple PIDs.

The Matching Service Adapter will hash the PID to make it specific to each service (and meaningless to other services) before sending it on to the Local Matching Service.

**Matching dataset**

The matching dataset contains verified information about a user including their:

- name
- address
- date of birth

It may also include additional data such as historical addresses and gender.

You must not use the matching dataset for anything other than matching. If you do, you may be in violation of the `General Data Protection Regulation <https://ico.org.uk/for-organisations/guide-to-the-general-data-protection-regulation-gdpr/>`_.

.. _eIDASintro:

**European identities and eIDAS**

The `eIDAS regulation <https://ico.org.uk/for-organisations/guide-to-eidas/what-is-the-eidas-regulation/>`_, coming into force in late 2018, says that European citizens must be able to use their national electronic IDs to access public services provided by another EU member state.

In practice, this means European citizens will be able to use their national online identity schemes to confirm their identity and access UK government services.

If your service needs to be able to process EU identities, you need to :ref:`configure your MSA<msa_adapt_YAML>` to do this.

European identities you receive from the GOV.UK Verify Hub will always be in the format of the :ref:`universal JSON matching schema<JSONschema>`, and will only include:

- first name, ``firstName``
- surname, ``surnames``
- date of birth, ``dateOfBirth``
- a personal identifier or equivalent from the EU member state (the equivalent of the PID),

These are all verified attributes. The data from European citizens will not include any historical attributes or unverified attributes.

For names using non-Latin characters, both the non-Latin as well as a Latin equivalent will appear in the JSON received by your matching service. Because European identities will not contain middle names, only ``firstName`` and ``surnames`` may contain a ``nonLatinScriptValue`` property, where applicable

The UK uses addresses as an extra attribute to establish identity and help with matching. Other countries can use a personal identification number or similar. Both approaches meet identity assurance standards.

Keep in mind that EU identities don't include addresses. If your service needs to be able to process EU identities, make sure your matching strategy is not based on addresses.


**Unverified attributes**

The identity provider may offer some unverified attributes to help you disambiguate between similar records. Any unverified attributes will be clearly labelled.

An unverified attribute does not mean the identity is invalid. For example, it can be difficult to verify current addresses, especially if an individual has not lived at that address for very long. Verifying a previous address can be enough to establish identity.

An unverified attribute will always be accompanied by a verified attribute of the same type. For example, an unverified current addressed and a verified historical address.

.. _matchingcycles:

.. _cycle0:

.. rubric:: Cycle 0

Cycle 0 is also known as the PID match. It works when a user has previously verified their identity with the same identity provider.

Cycle 0 matches the user’s hashed PID to an existing hashed PID in the local matching datastore(s) and returns a match.

.. _cycle1:

.. rubric:: Cycle 1

Cycle 1 is also known as the ‘matching dataset’ match. It works when Cycle 0 has failed to find a match and uses the matching dataset from the identity provider to check for possible matches.

Your :ref:`Local Matching Service <localmatchingservice>` can use the details in the matching dataset to attempt to find a match between the user and their existing record. Your service’s matching rules should specify which details to use. For example, you should use historical verified data if offered by the identity provider and then use unverified historical data to tell the difference between candidate records.

If the Local Matching Service finds a single match, it creates a correlation between the hashed PID and the existing record in the local datastore(s).

The hashed PID is then written to the local matching datastore(s) so the next time the user attempts to use the service with the same identity provider, their record will be found with a Cycle 0 match.

Stop the matching process if Cycle 1:

- fails to find a match and no additional attributes are available
- finds multiple matches and no additional attributes are available

If Cycle 1 finds multiple matches and additional matches are available, continue to the next cycle.

.. _cycle2:

.. rubric:: Cycle 2

Cycle 2 matching uses additional attributes related to identity from another source such as a credit referencing agency or other government department to help the matching process. For example, an additional attribute could be whether the user qualifies for a Blue Badge.

GOV.UK Verify does not currently support Cycle 2 matching. No government connecting service has needed Cycle 2 matching so far. If you think your service needs Cycle 2 matching, `contact the GOV.UK Verify team <mailto:idasupport+onboarding@digital.cabinet-office.gov.uk>`_.

.. _cycle3:

.. rubric:: Cycle 3

If Cycle 1 finds more than 1 potential match, Cycle 3 asks the user for some additional information, for example driving licence number. The GOV.UK Verify Hub collects the additional information and sends it to the matching service. The Local Matching Service then uses it to refine the match. When the Local Matching Service finds a match, it saves the hashed PID in the matching datastore(s).

This cycle is defined in the government service policy and may not be needed for all matches. You should define the information the hub collects and how to use it for matching. For example, you decide how many pieces of additional information to request. If you request 2 pieces of information and the user can only provide 1 of them, your matching rules specify whether to match this user.

Use this cycle to enhance cycle 1 and not as an alternative to cycle 1.

Although it might seem more productive to run Cycle 3 straight away with the greatest number of attributes, it’s often less effective. Using Cycle 3 in place of earlier cycles can result in the Local Matching Service retrieving fewer possible matching records and incorrect records if one or more of the input attributes are incorrect.

^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
Matching approach
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

One of the most effective matching approaches is to start with a wide search to make sure that any relevant record is found. If no records return, you can:

- widen the search by using fewer attributes to find candidate records
- do multiple searches with more attributes but smaller query clusters

To run multiple searches you could break down a query with first name, surname and date of birth and run a series of searches with just 2 of those attributes.

Once you have a number of possible matching records, run further checks with additional attributes to deduplicate until you are confident in the match.

""""""""""""""""""""""""""""""""""""""""""""""""
First search with last name and date of birth
""""""""""""""""""""""""""""""""""""""""""""""""

For example, start with a first search for last name and date of birth. You may find clusters around 1 January and 1 June because children, immigrants and other people without official identity documents are often assigned these dates of birth.

If a no match is returned, then the search should be run using any verified historical last name attributes if offered by the identity provider.

You can also try synonym matching against forename and last name combinations such as transposing last name and forename. This can help match users who may use shortened versions of their name, a nickname, or their middle name rather than their legal first name. For example, a David Michael Smith might only use that name on his passport. He might use Michael Smith for other purposes, but refer to himself mostly as Mike Smith.

""""""""""""""""""""""""""""""""""""""""""""""""""""""""
Filter candidates with postcode
""""""""""""""""""""""""""""""""""""""""""""""""""""""""
If the search returns multiple possible records, use the postcode to remove false positives. A verified postcode might not be the current postcode of a user, but is more valuable for matching than an unverified current postcode.
If a matching dataset does not contain any address, it is likely to be from an EU member state.

If you cannot find a match with the postcode, you can:

- ignore it, try to get sufficient matches on another attributes and move to Cycle 3 for disambiguation
- ask the user to provided further attributes to be able to use Cycle 3

If you choose to request other attributes from the user, you should consider how best to capture the information. For example, whether to ask a user to return online and provide more information or if someone from your organisation can collect the information in a telephone call.

""""""""""""""""""""""""""""""""""""""""""""""""""""""""
Build confidence in a single record
""""""""""""""""""""""""""""""""""""""""""""""""""""""""
Once the matching service returns a single record, you should aim to increase your confidence score in the match.

You should first check for an exact match with first name, last name, date of birth and postcode.

If no match, transpose first name and any middle names. You may still need to use additional attributes to increase confidence in the match.

If no match with transposition, try looking for an exact match with unverified first name(s).

If no match with unverified first name(s), try using a list of synonyms. These lists will contain common synonyms, for example, William and Bill.

If no match, you may decide to apply your fuzzy matching rules or ask a member of your organisation to contact the user for more attributes.

""""""""""""""""""""""""""""""""""""""""""""""""""""""""
Audit and testing
""""""""""""""""""""""""""""""""""""""""""""""""""""""""
You should regularly audit matching requests and their outcome to help your refine your matching strategy and iterate your matching service.
