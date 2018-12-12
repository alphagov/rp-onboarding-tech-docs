.. _pkiRequestCert:

Request certificates
=====================

.. warning:: This documentation is out of date. We have published `new technical documentation <https://www.docs.verify.service.gov.uk>`_.

To use an integration or production environment, you need to request 4 certificates from the IDAP certificate authority:

* encryption and signing certificates for your service
* encryption and signing certificates for your Matching Service Adapter (MSA)


.. note::

  * Only certificates approved by the IDAP certificate authority can be used with GOV.UK Verify
  * The procedure to request certificates for your integration and production environments are the same, except for the :ref:`URL to use for enrolment <pki_submit_csr>`
  * You must make a separate request for each certificate


**To request certificates:**


1. Your service manager sends the :ref:`contact details of your certificate requesters <pki_requesters_approvers>` to the certificate authority.
2. Your service manager sends the :ref:`contact details of your approvers <pki_requesters_approvers>` for the certificate requesters, to the certificate authority.

  .. important:: Certificates will not be approved unless your service manager has completed the above steps.

3. The technical team :ref:`generates a private key <pki_gen_private_key>` in the form of a file.
4. From the private key, the technical team :ref:`generates the certificate signing request <pki_gen_csr>` file containing a corresponding public key.
5. The technical team :ref:`submits the certificate signing request <pki_submit_csr>` file to the appropriate certificate authority.

.. _pki_requesters_approvers:

Name your certificate requesters and approvers
-----------------------------------------------

Before you request certificates, your service manager must name the people who will be:

* certificate requesters for your service
* approvers for the requesters

Requesters are the people who actually make the requests. For security reasons, we advise you keep the number of requesters to a minimum. Approvers must be in a senior role within your organisation, for example, a project manager with responsibility for security. Requesters and approvers should be different people.

Your service manager must provide the following details for all requesters and approvers:

* first name
* last name
* email address
* telephone number

Your service manager must send these details to idappki@digital.cabinet-office.gov.uk from their email address.

You may want to set up a group mailbox to make sure you receive your certificates and renewal notices when your requesters or approvers aren’t available. If so, the service manager should provide this email address as well.

The IDAP certificate authority adds the details to their list of approved requesters and approvers. If the certificate authority receives a certificate signing request from someone who isn’t an approved requester, no certificate will be issued.

.. important:: Make sure you notify the IDAP certificate authority when you want to remove or add someone to the list.

.. _pki_gen_private_key:

Generate private keys
------------------------

Run the following command from a Linux (or OSX) command line:
::

    openssl genrsa -out <file name>.key 2048


where:

* ``2048`` ensures that the private key meets the RSA 2048 standard required by the IDAP certificate authority
* ``<file name>`` is a meaningful name, for example ``MyserviceDevSamlSigning1.key`` or ``MyserviceUatMsaSamlEncryption3.key``

We advise you to establish a naming convention for all your PKI files. Typically, this includes the name of your service or the MSA and an incremental version number.

Generate a new private key for each certificate signing request file that you submit. This naturally retires any private keys that have been compromised; you should not re-use existing private keys.


.. _pki_store_private_key:

Store private keys
~~~~~~~~~~~~~~~~~~~~

You must store private key files in a secure environment. Typical controls include:

* restricting private key access to approved staff
* storing files in encrypted format
* storing files offline, for example, on an encrypted USB memory stick kept in a safe
* never sharing private keys outside the environment where you created them

For further advice and guidance, contact the government’s `National Technical Authority for Information Assurance (NCSC) <https://www.ncsc.gov.uk/>`_.


.. _pki_gen_csr:

Generate certificate signing requests
----------------------------------------

Use a private key to create a certificate signing request. This request will contain the corresponding public key.

Run the following command from a Linux (or OSX) command line:
::

    openssl req -new -key <file name>.key -out <file name>.csr

where:


* ``<file name>.key`` is the name of the private key file you generated
* ``<file name>.csr`` is a meaningful name, for example ``MyserviceDevSamlSigning3.csr`` or ``MyserviceUatMsaSamlEncryption3.csr``


We advise you to establish a naming convention for all your PKI files. The private key and certificate signing request files can have the same filename as they have different extensions (.key and .csr).

Some prompts appear in the terminal. Enter the following information:

* **Country Name**: 2-letter code for your country, for example, GB for Great Britain
* **State**: county or city
* **Locality**: city or town
* **Organisation Name**: the name of your government organisation, for example, DVLA
* **Organisation Unit**: the name of your government service, for example, View your driving licence
* **Common Name**: one of the following, depending on the type of certificate:

   * SAML :ref:`encryption<pki_encrypt_cert>` certificate: ``<servicename> SAML Encryption <version of your certificate>``
   * SAML :ref:`signing<pki_sign_cert>` certificate: ``<servicename> SAML Signing <version of your certificate>``

  .. note:: **Common Name** must not contain underscores.

* **Email Address**: the requester or group email address (if you've set one up)
* **Extra attribute** (optional):

 * **A challenge password**: if you provide this, the certificate authority may request it when you submit the certificate signing request
 * **An optional company name**



Store certificate signing request files
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Certificate signing request files don’t have the same security issues as private key files. However, it’s advisable to store a copy of them with the corresponding private key files.


.. _pki_submit_csr:

Submit certificate signing requests
-------------------------------------

.. Important:: Before you submit a certificate signing request, your service manager must:

  * :ref:`send the requester's details<pki_requesters_approvers>` to the IDAP certificate authority
  * request the **GOV.UK Verify Certification Process for (Relying Party) Subscribers** document containing the certificate authority URLs from idappki@digital.cabinet-office.gov.uk

1. Open the URL for the required certificate authority:

  * the IDAP test certificate authority issues certificates for non-production environments such as the integration environment; test certificates are valid for 2 years
  * the IDAP certificate authority issues certificates for production environments; production certificates are valid for 6 months

  For security reasons, the certificate authority URLs are not publicly available. You can find them in the 'GOV.UK Verify Certification Process for (Relying Party) Subscribers' document.

2. Select **ENROL** to begin the submission.
3. Select **Choose file** and select your certificate signing request file.
4. Select **Submit**. A screen opens, requesting more details. Several fields are pre-populated with information taken from the certificate signing request file.
5. Under **Applicant Details**, enter the details of the approved certificate requester.
6. Enter the requester or group email address (if you've set one up). The certificate authority sends signed certificates and renewal notices to this email address.
7. Under **Certificate Profile**, select the appropriate certificate type. This must match the intended use of the certificate, for example, if you’re submitting a signing certificate, you must select **SAML Signing**. If you select the wrong certificate type, it won’t be valid for GOV.UK Verify.
8. Enter a **Challenge Phrase**, which must be unique and known only to the requester. This will be used during the renewal process to check the authority of the requester.
9. Select **Submit**.

The IDAP PKI registrar runs checks on the certificate request to ensure that the information it contains complies with the information previously supplied, and that the request is genuine. The certificate authority then generates and signs the certificate, which contains the public key you sent in the certificate signing request file. The certificate authority sends the certificate to the email address that the requester provided.

You will receive your certificate within 5 working days.

The email address to contact the registrar is idappki@digital.cabinet-office.gov.uk.
