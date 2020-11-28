# RPC API

* `/addresses/info/:address`
  - `used`: boolean, whether address has been used
  - `block`: number
  - `utxos`: array of
    - `tx_pos`
    - `tx_hash`
    - `height`
    - `value`
    - `time`
* `/getblockandfee`: returns blockcount and sats fee for 1 block conf
  - {"blockcount": Number, "fee": Number (in sats)}
* `/getblockcount`
  - `Number`
* `/getrawtx/:txid`
  - `RawTxHex`
