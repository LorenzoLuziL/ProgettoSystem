#!/bin/bash
PORTS='8080 8081' /Users/lauz/Desktop/RepoChorSSi/Librerie_aggiuntive/aries-cloudagent-python/scripts/run_docker start  --wallet-type indy --seed 0000000000000000SellersBankAgent --wallet-key welldone --wallet-name sellersBankWallet --genesis-url http://192.168.1.8:9000/genesis --inbound-transport http 0.0.0.0 8080 --outbound-transport http --admin 0.0.0.0 8081 --admin-insecure-mode --endpoint http://dockerLocalIP:8080 --auto-provision --auto-accept-invites --auto-accept-requests --label sellersbank --tails-server-base-url http://192.168.1.8:6543 --preserve-exchange-records --auto-ping-connection --auto-verify-presentation

exit 0
