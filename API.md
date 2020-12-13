# RPC API

* `/addresses/info/:address`
  - `used`: boolean, whether address has been used
  - `block`: number
  - `utxos`: array of
    - `tx_pos`
    - `tx_hash`
    - `height`
    - `value`
    - `recvd`: epoch time (in seconds) when tx received
* `/getblockandfee`: returns blockcount and sats fee for 1 block conf
  - {"blockcount": Number, "fee": Number (in sats)}
* `/getblockcount`
  - `Number`
* `/getrawtx/:txid`
  - `rawtx`: hex string
  - `txid`
* `/gettxvals`
  - `txid`
  - `recvd`: epoch time (in seconds) when tx received
  - `confs`
  - inputs: array
    - `pos`
    - `txid`
    - `value`
    - `address`
  - outputs: array
    - `pos`
    - `txid`
    - `value`
    - `address`
* `/broadcasttx`
  - `txid`
  - inputs
    - `signed-rawtx`
* POST `/createrawtx`
POST args:
  - inputs
    - txid: hex string
    - vout: number
  - outputs
    - {address: amount (in sats)}
Result:
  `rawtx`: hex string
  `txid`:  hex string


