.. _matching:

Matching
===========================

.. warning:: This documentation is out of date. We have published `new technical documentation <https://www.docs.verify.service.gov.uk>`_.

When a verified user needs to access your service, you will trust the user’s identity, but may need to check if the user’s identity can be linked to information held by your service. This process, known as ‘matching’, helps you to be sure that the John Smith trying to use your service is the same John Smith you already have on file.

Your service must be able to handle matching from GOV.UK Verify even if you don’t want to match identities against existing datasource(s) at that time. For example, you might want to :ref:`collect the data now <createnewaccounts>` and use it for matching later or store the information for auditing purposes.

Because there’s no unique identifier for citizens, finding the record involves matching verified information about the user (such as name, address, and date of birth) to a record in a local datastore(s) with a local identifier. For example, if you run an NHS service, the local identifier may be an NHS number.

An identifier on its own is not a proxy for an identity. Identifiers are not usually private and it’s hard for government to control their privacy. On rare occasions, some identifiers may be shared by different people. Because of this, you should not use identifiers on their own to prove identity and should follow the matching advice offered in this guidance.

If your service does not handle matching properly, there’s a risk that a user won't be able to access your service or that your service will think they're someone else.

These cases can put your service at risk of reputational damage and compliance issues.

To mitigate these risks, your service must:

- :ref:`understand how matching works with GOV.UK Verify<matchingverify>`
- :ref:`evaluate what data sources you have<evaluatedata>`
- :ref:`decide your matching strategy<matchingstrategy>`
- :ref:`prepare your local data source(s)<preparedata>`
- :ref:`build a matching service <buildmatchingservice>`

Remember you must clearly explain to end users why you are collecting the data and what it will be used for.

   .. toctree::
      :hidden:

      matchingverify
      evaluatedata
      matchingstrategy
      preparedata
      buildmatchingservice
      matchingserviceadapter
      testmatching
      createnewaccounts
