# Docker Bitcoin
Downloads the official binaries.

## Usage
1. Have an external volume
2. Pass that as a Docker volume (see `start.sh`)
3. In `bitcoin.conf`:
```
rpcallowip=0.0.0.0/0
rpcbind=0.0.0.0
```

### Multi-Container Usage
For apps like `electrs`
