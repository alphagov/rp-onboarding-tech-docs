.. _ms:

Local Matching Service
======================

.. warning:: This documentation is out of date. We have published `new technical documentation <https://www.docs.verify.service.gov.uk>`_.

The purpose of a matching service is to find a match between a user’s verified identity and a record in a government service’s data sources. It allows the government service to be sure that the Jane Smith trying to access the service is the same Jane Smith already held on file.

Government services host their matching service within their security domain. A matching service is composed of the :ref:`Matching Service Adapter <msa>` (MSA) and a local matching service.


.. csv-table::
   :widths: 50, 50
   :name: flow-diagram

   ".. figure:: matchingservice.svg
     :alt: Diagram showing that a matching service is composed of a MSA and a local matching service.","For more details, see the diagrams:

   * :ref:`GOV.UK architecture <arch>`
   * :ref:`matching cycles <ms_matchcyles_diagram>`
   * :ref:`create user accounts <ms_cua_diagram>`"

Building a local matching service
---------------------------------

You must build a local matching service to help you find a match between a user’s verified identity and a record in your existing database(s).

You must build a local matching service even if your connecting service does not need to match identities to existing records.

Follow the :ref:`guidance on building a local matching service <msBuild>` to:

  * define your matching strategy
  * respond to JSON matching requests

You can also refer to the `example local matching service built by the Verify team <https://github.com/alphagov/verify-local-matching-service-example>`_ and use the `local matching service test tool <https://github.com/alphagov/verify-matching-service-adapter/tree/master/verify-matching-service-test-tool>`_ to check your local matching service can handle matching effectively.

The Verify team can help you build and configure your local matching service. Contact idasupport@digital.cabinet-office.gov.uk for help.
