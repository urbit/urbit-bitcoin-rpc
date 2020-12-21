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
  arg: txid
  - `included`: false if TX is not in mempool or blockchain
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
  - `broadcast`: whether this particular call broadcast the transaction
  - `included`: whether the TX is in the mempool/conf'd
  - inputs
    - `signed-rawtx`
