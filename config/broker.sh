#!/bin/bash

PORTS='8060 8061' /Users/lauz/Desktop/RepoChorSSi/Librerie_aggiuntive/aries-cloudagent-python/scripts/run_docker start  --wallet-type indy --seed 000000000000000000000BrokerAgent --wallet-key welldone --wallet-name brokerWallet --genesis-url http://192.168.1.8:9000/genesis --inbound-transport http 0.0.0.0 8060 --outbound-transport http --admin 0.0.0.0 8061 --admin-insecure-mode --endpoint http://172.18.0.1:8060 --auto-provision --auto-accept-invites --auto-accept-requests --label broker --tails-server-base-url http://192.168.1.8:6543 --preserve-exchange-records --auto-ping-connection --auto-verify-presentation

exit 0
