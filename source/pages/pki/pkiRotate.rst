.. _pkiRotate:


Rotate your encryption and signing keys
======================================================

When the certificates containing your public keys are due to expire, you must rotate your keys. This allows you to introduce a new set of keys and certificates with no service interruption.

As a government service you are responsible for maintaining the encryption and signing keys for your Matching Service Adapter (MSA) and your service provider. Your service provider could be the `Verify Service Provider (VSP) <https://github.com/alphagov/verify-service-provider>`_ or another service provider.

Before you start rotating keys, you must :ref:`get new signed certificates<pki_get_new_certs>` for your public keys from the `IDAP certificate authority <http://alphagov.github.io/rp-onboarding-tech-docs/pages/pki/pkiWorks.html#keys-and-certificates-in-the-gov-uk-verify-federation>`_.

Then, as part of the key rotation process, you must rotate your:

* :ref:`MSA encryption key<rotateMSA_encKey>`
* :ref:`MSA signing key<rotateMSA_signKey>`
* :ref:`VSP encryption key<rotateVSP_encKey>` or :ref:`service provider encryption key<rotateSP_encKey>`
* :ref:`VSP signing key<rotateVSP_signKey>` or :ref:`service provider signing key<rotateSP_signKey>`

To communicate with the GOV.UK Verify team during a key rotation process, send an email to idasupport+onboarding@digital.cabinet-office.gov.uk. This will begin an email thread that you can use for any queries you have during this key-rotation process.

.. _pki_get_new_certs:

Get new signed certificates
----------------------------------

1. :ref:`Generate new signing and encryption private keys<pki_gen_private_key>` for both the MSA and your service provider - this is 4 keys in total.
2. :ref:`Generate a certificate signing request<pki_gen_csr>` for each of the the keys you generated in step 1.
3. :ref:`Submit the certificate signing requests<pki_submit_csr>` from step 2 to the IDAP certificate authority.

The IDAP certificate authority will issue you signed certificates for the MSA and your service provider encryption and signing public keys.

.. _rotateMSA_encKey:

Rotate your MSA encryption key
-----------------------------------------------------

1. Add a second list item containing the details for your new public and private key under ``encryptionKeys`` in your :ref:`MSA configuration <yamlfile>`, for example:

  .. code-block:: yaml

    encryptionKeys:
    - publicKey:
        certFile: msa_encryption_2016.crt
        name: MSA Encryption 2016
      privateKey:
        keyFile: msa_encryption_2016.pk8
    - publicKey:
        certFile: msa_encryption_2017.crt
        name: MSA Encryption 2017
      privateKey:
        keyFile: msa_encryption_2017.pk8

2. Restart the MSA to implement the configuration changes -  the MSA can now use both the new and old keys to decrypt SAML messages.

  .. note:: While both keys are in use, you may see error messages in the logs with the description ``Unwrapping failed``. These messages appear because the MSA attempts to decrypt the SAML message using each key in turn. You can safely ignore these messages. However, do not ignore any other error messages related to SAML decryption.

3. Send the new certificate to the GOV.UK Verify team and wait for the team to confirm deployment.
4. After the GOV.UK Verify team confirm they have deployed the new public encryption key, delete the old private encryption key and certificate.
5. Restart the MSA to implement the configuration changes.

The MSA now uses the new encryption key to decrypt SAML messages, and the GOV.UK Verify hub now uses the new key to encrypt SAML messages for your service.

.. _rotateMSA_signKey:

Rotate your MSA signing key
--------------------------------------------------

.. _pki_config_msa_2signkeys_SAMLmetadata:

The MSA publishes its certificates containing the public keys in its own metadata at run time. The service provider you’re using reads this metadata and uses the MSA's signing certificate to trust assertions signed by the MSA. Therefore you must restart the MSA once you've changed the certificates in the configuration file (step 2) and make sure your service provider has read the new metadata (step 3).

1. Send the new signing certificate to the GOV.UK Verify team and add it to the :ref:`MSA configuration <yamlfile>` under ``signingKeys.secondary``, for example:

  .. code-block:: yaml

    signingKeys:
      primary:
        publicKey:
          certFile: msa_signing_2016.crt
          name: 2016 MSA Signing Key
        privateKey:
          keyFile: msa_signing_2016.pk8
      secondary:
        publicKey:
          certFile: msa_signing_2017.crt
          name: 2017 MSA Signing Key
        privateKey:
          keyFile: msa_signing_2017.pk8

2. Restart the MSA to publish the new signing certificate to its metadata.

3. Make sure your service provider has read the new metadata.

If you’re using the VSP, wait for it to load the MSA metadata. The VSP periodically refreshes its metadata and will log when it has finished. Once it loads the new metadata, the VSP trusts assertions signed with the new MSA signing key.

4. Delete the ``signingKeys.primary`` section and rename ``signingKeys.secondary`` to ``signingKeys.primary`` - the MSA now signs the assertions with the new  key.

5. Restart the MSA to update its metadata to contain only the new signing certificate.

6. Inform the GOV.UK Verify team that the new key is live.

Your service provider now trusts assertions signed with your new MSA signing key.

.. _rotateVSP_encKey:

Rotate your VSP encryption key
-----------------------------------

These instructions apply to you if you're using the Verify Service Provider (VSP).

1. Add the new VSP private encryption key you've generated to the ``samlSecondaryEncryptionKey`` field in the VSP configuration.
2. Restart the VSP to implement the configuration changes - the VSP can now use both the new and old keys to decrypt SAML messages.
3. Send the new certificate to the GOV.UK Verify team and wait for the team to confirm deployment.
4. After receiving confirmation from the GOV.UK Verify team, replace the key in ``samlPrimaryEncryptionKey`` with the key from ``samlSecondaryEncryptionKey`` and leave ``samlSecondaryEncryptionKey`` empty for the next key rotation.
5. Restart the VSP to implement the configuration changes.

Your service now uses the new VSP encryption key to decrypt SAML messages.

.. _rotateVSP_signKey:

Rotate your VSP signing key
----------------------------------

These instructions apply to you if you're using the Verify Service Provider.

1. Send your new signing certificate to the GOV.UK Verify team and wait for deployment confirmation.
2. Replace the old signing key under ``samlSigningKey`` in the VSP configuration with the new key.
3. Restart the VSP to implement the configuration changes - the VSP now signs SAML messages with the new key.
4. Inform the GOV.UK Verify team that new key is live - the GOV.UK Verify team will remove the old certificate from the GOV.UK Verify hub.

The GOV.UK Verify hub now trusts SAML messages signed with your new VSP signing key.


.. _rotateSP_encKey:
Rotate your service provider encryption key
--------------------------------------------

These instructions apply to you if you're using an alternative to the Verify Service Provider.

1. Add your new service provider private encryption key to your service endpoint - your service can now use both the new and old keys to decrypt SAML messages.
2. Send the new certificate to the GOV.UK Verify team and wait for the team to confirm deployment.
3. After receiving confirmation from GOV.UK Verify team, remove the old encryption key from your service endpoint.

Your service provider now uses the new encryption key to decrypt SAML messages.


.. _rotateSP_signKey:
Rotate your service provider signing key
-----------------------------------------

These instructions apply to you if you're using an alternative to the Verify Service Provider.

1. Send your new signing certificate to the GOV.UK Verify team and wait for deployment confirmation.
2. Replace the old private signing key with the new key on your service endpoint - your service provider now signs SAML messages with the new key.
3. Inform the GOV.UK Verify team that the new key is live - the GOV.UK Verify team removes the old certificate from the GOV.UK Verify hub.

The GOV.UK Verify hub now trusts SAML messages signed with your new service provider signing key.
