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
  - `{blockcount: Number}`
