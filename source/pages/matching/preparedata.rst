.. _preparedata:

Prepare local datasources
=============================

The ability to match successfully and correctly will depend on the quality of the data in the local datastore(s). You should normalise the data as much as possible to increase the likelihood of successful matching.

Although specific normalisation processes will differ between data sources, you can try processes such as:

- changing all alphabetical strings to uppercase
- removing non-alpha characters from names, such as hyphens or commas
- combining multiple words into one string, for example removing the space between the first and second part of a postcode

You should also consider transliterating letters with diacritical marks to equivalents without marks, for example transliterating ``ö`` to ```o``. The International Civil Aviation Organisation provides recommended transliterations on the `most commonly used characters in Latin, Cyrillic and Arabic languages <https://www.icao.int/publications/Documents/9303_p3_cons_en.pdf>`_ you may find useful.

After the introduction of eIDAS in September 2018, identity providers from other countries will provide a Latin equivalent for non-Latin letters. Belgium and Greece will transliterate any Cyrillic and Greek into a Latin alphabet for you. You will receive the transliteration in the JSON received by your matching service.

.. rubric:: Normalise data received from the GOV.UK Verify Hub

The data you receive from one identity provider may differ from another. For example, one provider might use ``null`` to indicate an unavailable value when another might leave it blank.

You should follow the same practices to normalise the data you receive from the identity providers as you should to normalise your local datasource(s).
