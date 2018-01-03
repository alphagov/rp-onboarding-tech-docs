.. _pkiRotate:


Rotate your keys
==================

When the certificates containing your public keys are due to expire, run the key rotation process to replace the keys and certificates. This allows you to introduce a new set of keys and certificates with no service interruption. 

As a government service you are responsible for maintaining the following keys:

* government service encryption key
* government service signing key
* Matching Service Adapter (MSA) encryption key
* MSA signing key

The certificates for these keys are usually issued at the same time. You'll probably need to renew them all together.



Initial steps for all keys
----------------------------------

#. Generate a :ref:`new private key <pki_gen_private_key>`.
#. Generate a :ref:`certificate signing request <pki_gen_csr>` and :ref:`submit it <pki_submit_csr>` to the IDAP certificate authority.
#. The IDAP certificate authority issues the new certificate to the government service.


Rotate your service encryption key
-----------------------------------


#. Add the new private encryption key to your service endpoint. Your service can now use the new and old private keys to decrypt SAML messages.
#. Send the new certificate to the GOV.UK Verify operations team.
#. The GOV.UK Verify operations team installs the new certificate on the hub. The GOV.UK Verify hub now uses the new key to encrypt SAML messages for your service.
#. Remove the old encryption key from your service endpoint.


Rotate your service signing key
----------------------------------

#. Send the new signing certificate to the the GOV.UK Verify operations team.
#. The GOV.UK Verify operations team installs the new certificate on the GOV.UK Verify hub. The GOV.UK Verify hub now trusts SAML messages signed with the new and old keys.
#. Replace the old private signing key with the new key on your service endpoint. Your service now signs SAML messages with the new key only.
#. Inform the GOV.UK Verify operations team that new key is live.
#. The GOV.UK Verify operations team removes the old certificate from the GOV.UK Verify hub. The GOV.UK Verify hub now trusts SAML messages signed with the new key only.


Rotate your Matching Service Adapter encryption key
-----------------------------------------------------

1. Install the new private encryption key and encryption certificate on the MSA. To do this, add the fields ``privateSecondaryEncryptionKeyConfiguration`` and ``publicSecondaryEncryptionKeyConfiguration`` to the  :ref:`YAML configuration file <yamlfile>` as indicated in the highlighted sections below:

  .. code-block:: yaml
     :emphasize-lines: 4-5, 11-13

     privateEncryptionKeyConfiguration:
      keyUri: deploy/keys/test_rp_msa_encryption_old.pk8

     privateSecondaryEncryptionKeyConfiguration:
      keyUri: deploy/keys/test_rp_msa_encryption_new.pk8

     publicEncryptionKeyConfiguration:
      keyUri: deploy/keys/test_rp_msa_encryption_old.crt
      keyName: http://www.test-rp-ms.gov.uk/SAML2/MD

     publicSecondaryEncryptionKeyConfiguration:
      keyUri: deploy/keys/test_rp_msa_encryption_new.crt
      keyName: http://www.test-rp-ms.gov.uk/SAML2/MD
 
  The MSA can now use both the new and old keys to decrypt SAML messages.

  .. note:: While both keys are in use, you may see error messages in the logs with the description 'Unwrapping failed'. These messages appear because the MSA attempts to decrypt the SAML message using each key in turn. You can safely ignore these messages. However, do not ignore any other error messages related to SAML decryption.

2. Send the new certificate to the GOV.UK Verify operations team.
3. The GOV.UK Verify operations team replaces the old certificate with the new certificate on the GOV.UK Verify hub. The GOV.UK Verify hub now uses the new key to encrypt SAML messages for your service.
4. Promote the secondary private encryption key and encryption certificate to the primary position. 
5. Remove the old private encryption key and encryption certificate:


  .. code-block:: yaml

     privateEncryptionKeyConfiguration:
      keyUri: deploy/keys/test_rp_msa_encryption_new.pk8

     publicEncryptionKeyConfiguration:
      keyUri: deploy/keys/test_rp_msa_encryption_new.crt
      keyName: http://www.test-rp-ms.gov.uk/SAML2/MD

6. Restart the MSA. The MSA can no longer use the old key to decrypt SAML messages.


Rotate your Matching Service Adapter signing key
--------------------------------------------------

.. _pki_config_msa_2signkeys_SAMLmetadata:

This procedure involves publishing 2 SAML signing certificates in the MSA SAML metadata. 

1. Send the new signing certificate to the GOV.UK Verify operations team.
2. Install the new signing certificate on the MSA. To do this, add the field ``publicSecondarySigningKeyConfiguration`` to the :ref:`YAML configuration file <yamlfile>`, as indicated in the highlighted section below:

  .. code-block:: yaml
     :emphasize-lines: 8-10

     privateSigningKeyConfiguration:
      keyUri: deploy/keys/test_rp_msa_signing.pk8

     publicSigningKeyConfiguration:
      keyUri: deploy/keys/test_rp_msa_signing.crt
      keyName: http://www.test-rp-ms.gov.uk/SAML2/MD

     publicSecondarySigningKeyConfiguration:
      keyUri: deploy/keys/test_rp_msa_signing_new_cert.crt
      keyName: http://www.test-rp-ms.gov.uk/SAML2/MD/Secondary

3. Check that your service endpoint has loaded the newly generated MSA metadata from: /matching-service/SAML2/metadata. The service endpoint now trusts assertions signed with the new key.
4. Update the field ``privateSigningKeyConfiguration`` with the new private signing key.
5. Promote the secondary signing certificate to the primary position. 
6. Remove the old signing certificate:

  .. code-block:: yaml

     privateSigningKeyConfiguration:
      keyUri: deploy/keys/test_rp_msa_signing_new.pk8

     publicSigningKeyConfiguration:
      keyUri: deploy/keys/test_rp_msa_signing_new.crt
      keyName: http://www.test-rp-ms.gov.uk/SAML2/MD

7. Restart the MSA. SAML messages are now signed with the new key.
8. Inform the GOV.UK Verify operations team that the new key is live.