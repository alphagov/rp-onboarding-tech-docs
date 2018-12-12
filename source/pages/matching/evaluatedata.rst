.. _evaluatedata:

Evaluate datasources
===========================

.. warning:: This documentation is out of date. We have published `new technical documentation <https://www.docs.verify.service.gov.uk>`_.

.. _datacriteria:

The accuracy and cleanliness of your datasource(s) will affect your ability to match effectively. Before deciding your matching strategy, you should check:

- the accuracy and source of the data
- what attributes you have
- if there are any duplicate records
- what demographics are included

.. rubric:: Data accuracy and source

You should check where the data came from and decide whether it’s suitable for matching. For example, if the data was collected by a third party you don’t recognise and only contains a few hundred records, it may not be good enough for your matching needs. Similarly, if the data was captured from phone calls with your users, you may find the data is less accurate than data that users input themselves.

.. rubric:: Data attributes

You may find some data sources don’t include the attributes you need. The main attributes provided for a verified identity are:

- name
- address
- date of birth

Studies have shown that it’s possible to match `98 percent of identities with government records using these attributes <https://amstat.tandfonline.com/doi/full/10.1080/2330443X.2017.1389620#.Wp6gZhO0OX>`_.

You will find matching difficult, or impossible, without this data. If you do not have these attributes or want to use the data to build a datasource, `contact the GOV.UK Verify team to discuss your options <mailto:idasupport@digital.cabinet-office.gov.uk>`_.

.. rubric:: Duplicate records

It’s useful to identify any duplicate records or multiple records belonging to the same individual before trying to match as it will be harder to match to a single record. Cleansing your data before you start matching will make the matching process easier.

.. rubric:: Data demographics

You may find different data sources contain data for specific demographics, for example, only individuals above a certain age. Depending on your service requirements, you should use a datasource that covers the full demographic of your service’s users.
