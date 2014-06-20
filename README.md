utilities
=========

This is a collection of utility modules used by berry, appool and logitag.

#### service discovery
For the service discovery two node packages are supported: [polo](https://github.com/mafintosh/polo) and [mdns](https://github.com/agnat/node_mdns).
To change the default service discovery provider, the *createDefaultProvider* function in *discovery_provider/discovery_provider.js* must be changed to require the desired provider, 
meaning "mdns_provider" or "polo_provider".
