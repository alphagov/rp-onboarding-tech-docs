.. _pkiRotate:


Rotate your keys
==================

When the certificates containing your public keys are due to expire, run the key rotation process to replace the keys and certificates with new ones. Rotating keys allows you to introduce a new set of keys and certificates with no service interruption.

As a government service you are responsible for maintaining the encryption and signing keys for your Verify Service Provider (VSP) and Matching Service Adapter (MSA):

* :ref:`VSP encryption key<rotateVSP_encKey>`
* :ref:`VSP signing key<rotateVSP_signKey>`
* :ref:`MSA encryption key<rotateMSA_encKey>`
* :ref:`MSA signing key<rotateMSA_signKey>`

If you are not using the VSP, you are responsible for maintaining the encryption and signing keys for the service provider you chose. The instructions for service provider key rotation in this documentation refer to the VSP.

**needs rephrasing** You first ask the IDAP certificate authority to issue certificates when connecting to the Integration or Production environments. The certificates will then expire at the same time so you will need to renew them at the same time.

The MSA generates its own metadata using information from its config file and publishes it at runtime. So the MSA certificates are publsihed in its metadata **which ones? both?**.

The VSP reads the MSA's metadata because it needs to trust assertions signed by the MSA. Because of this relationship, you also need to rotate the signing keys between your VSP and MSA.


Get your signed certificates
----------------------------------

Before you start rotatig keys for your VSP and MSA, you need to get new signed certificates from the IDAP certificate authority.

#. :ref:`Generate new signing and encryption keys<pki_gen_private_key>` for both the VSP and MSA. This is 4 keys in total.
#. :ref:`Generate a certificate signing request<pki_gen_csr>` for each of the the keys you generated in step 1.
#. :ref:`Submit the certificate signing requests<pki_submit_csr>` from step 2 to the IDAP certificate authority. The IDAP certificate authority will issue you a signed certificate for your MSA and VSP encryption and signing keys.


.. _rotateVSP_encKey:

Rotate your VSP encryption key
-----------------------------------

#. Add the new VSP encryption key you've generated to the ``samlSecondaryEncryptionKey`` field in your VSP configuration. Your service can now use both the new and old keys to decrypt SAML mesasges. [this is the privat key i]
#. Send the new certificate signed by the IDAP certificate authority to the GOV.UK Verify team and wait for deploy confirmation.
#. After deploy confirmation from GOV.UK Verify team, replace the key in ``samlPrimaryEncryptionKey`` with the key from ``samlSecondaryEncryptionKey``. Leave ``samlSecondaryEncryptionKey`` empty for the next key rotation.

Your service now uses the new VSP encryption key to decrypt SAML messages.


.. _rotateVSP_signKey:

Rotate your VSP signing key
----------------------------------

#. Send the new signing certificate to the GOV.UK Verify team and wait for deployment confirmation.
#. Replace the old signing key under ``samlSigningKey`` in your VSP configuration with the new key. Your VSP now signs SAML messages with the new key only.
#. Inform the GOV.UK Verify operations team that new key is live. The GOV.UK Verify team removes the old certificate from the GOV.UK Verify hub.

The GOV.UK Verify hub now trusts SAML messages signed with your new VSP signing key only.


.. _rotateMSA_encKey:

Rotate your Matching Service Adapter encryption key
-----------------------------------------------------

#. Install the new encryption certificate (.crt) and private encryption key (.pk8) on the MSA. To do this, add a second list item under ``encryptionKeys`` in your :ref:`MSA configuration <yamlfile>`. The list element you're adding contains the details for your new public and private key, for example:

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

  The MSA can now use both the new (2017) and old (2016) keys to decrypt SAML messages.

  .. note:: While both keys are in use, you may see error messages in the logs with the description 'Unwrapping failed'. These messages appear because the MSA attempts to decrypt the SAML message using each key in turn. You can safely ignore these messages. However, do not ignore any other error messages related to SAML decryption.

#. Send the new certificate to the GOV.UK Verify operations team and wait for deployment confirmation
#. The GOV.UK Verify operations team replaces the old certificate with the new certificate on the GOV.UK Verify hub. The GOV.UK Verify hub now uses the new key to encrypt SAML messages for your service.
#. After GOV.UK Verify have confirmed deployment of the new (2017) public encryption key, delete the old (2016) private encryption key.


.. _rotateMSA_signKey:

Rotate your Matching Service Adapter signing key
--------------------------------------------------

.. _pki_config_msa_2signkeys_SAMLmetadata:


#. Send the new signing certificate to the GOV.UK Verify team and add it to the :ref:`MSA configuration <yamlfile>` under ``signingKeys.secondary``:

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

#. Load the MSA metadata. Your service now trusts assertions signed with the new (2017) MSA signing key.

#. Delete the ``signingKeys.primary`` section and rename ``signingKeys.secondary`` to ``signingKeys.primary``. The MSA now signs the assertions with the new (2017) key.

#. Inform the GOV.UK Verify operations team that the new key is live.
