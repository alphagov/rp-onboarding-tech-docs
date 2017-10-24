.. _ms:

Local Matching Service
========================

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

.. rubric:: Why does GOV.UK Verify use a matching service? 

UK citizens do not have a unique identifier. Government services need to match other information about the user, for example address or date of birth, against their data sources.


.. rubric:: What do you need to do?

As a government service, it's your responsibility to develop and :ref:`build your local matching service <msBuild>`. You need to understand :ref:`how a matching service works <msWorks>`. 

To help build your local matching service, you can use the:

* :ref:`example of a JSON request<RespondJSONmr>` that the MSA posts to your service
* :ref:`JSON schema <JSONschema>` for a matching request

Some government services don't have experience of matching verified identities to government data sources. The process can be complex, so if you  need further help with building a local matching service, contact your engagement lead or the `GOV.UK Verify team <http://rp-environment-request.ida.digital.cabinet-office.gov.uk/contact_form>`_. 


For more information, see :ref:`steps`.


.. toctree::
   :hidden:

   msWorks
   msBuild
   msCua