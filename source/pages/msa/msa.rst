.. _msa:

Matching Service Adapter
========================

.. caution:: This documentation is no longer maintained. :ref:`View the latest documentation for the Matching Service Adapter. <matchingserviceadapter>`.

The :ref:`Matching Service Adapter <gloss_msa>` (MSA) is a software tool supplied free of charge by GOV.UK Verify. It simplifies communication between your local matching service and the GOV.UK Verify hub.

A matching service is composed of the MSA and a :ref:`local matching service <ms>`. Government services host their matching service within their security domain.

 .. csv-table::
   :widths: 50, 50
   :name: flow-diagram

   ".. figure:: ../ms/matchingservice.svg
     :alt: Diagram showing that a matching service is composed of a MSA and a local matching service.","For more details, see the diagrams:

   * :ref:`GOV.UK architecture <arch>`
   * :ref:`matching cycles <ms_matchcyles_diagram>`
   * :ref:`create user accounts <ms_cua_diagram>`"

The MSA is a stateless service. It runs on Java 8 using `Dropwizard <http://www.dropwizard.io/>`_.


Why does GOV.UK Verify use the Matching Service Adapter?
--------------------------------------------------------

The hub uses :ref:`SAML <saml>` as its communication method. Government services usually use JSON (JavaScript Object Notation) for their local matching services. A SAML matching service interface is therefore required.  The MSA converts SAML into JSON and vice versa. It also performs encryption, decryption, and signing of SAML messages. For more information, see the :ref:`diagram showing the SAML message flow <samlWorks>` within the GOV.UK Verify federation.

It can be difficult and expensive to implement a SAML matching service interface. GOV.UK Verify provides the MSA so you can concentrate on the business logic and matching rules for your local matching service.

What do you need to do?
-----------------------

We recommend that you use the MSA.  If you do not want to, please contact the `GOV.UK Verify support team <idasupport@digital.cabinet-office.gov.uk>`_  to discuss your alternatives.

You need to host the MSA so the GOV.UK Verify hub can make requests to it.

To use the MSA, you need to:

#. :ref:`Build your local matching service <msBuild>` – you can use the :ref:`example of the JSON request <RespondJSONmr>` that the MSA posts to your service and the :ref:`JSON schema <JSONschema>` for a matching request.
#. :ref:`Install the Matching Service Adapter <msa_install_msa>`.
#. :ref:`Configure the Matching Service Adapter <ConfigureMSA>`.

You will then be able to run :ref:`SAML compliance tests between the hub and your matching service <samlCThubMSA>`.

For more information, see :ref:`steps`.
