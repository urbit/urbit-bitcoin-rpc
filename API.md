# RPC API

* `/addresses/info/:address`
  - `used`: boolean, whether address has been used
  - `blockcount`: number
  - `utxos`: array of
    - `tx_pos`
    - `tx_hash`
    - `height`
    - `value`
* `/getblockcount`
  - `Number`
* `/getfee/:conf_target`
  - `{"feerate": Number,"blocks": Number}}`
* `/getrawtx/:txid`
  - `RawTxHex`
