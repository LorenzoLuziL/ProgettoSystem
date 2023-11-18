curl --location --request POST 'http://localhost:9000/register' \
--header 'Content-Type: text/plain' \
--data-raw '{
  "seed": "000000000000000000000SellerAgent"
}'

curl --location --request POST 'http://localhost:9000/register' \
--header 'Content-Type: text/plain' \
--data-raw '{
  "seed": "0000000000000000000RegistryAgent"
}'

curl --location --request POST 'http://localhost:9000/register' \
--header 'Content-Type: text/plain' \
--data-raw '{
  "seed": "000000000000000000000BrokerAgent"
}'

curl --location --request POST 'http://localhost:9000/register' \
--header 'Content-Type: text/plain' \
--data-raw '{
  "seed": "0000000000000000000000BuyerAgent"
}'

curl --location --request POST 'http://localhost:9000/register' \
--header 'Content-Type: text/plain' \
--data-raw '{
  "seed": "0000000000000000SellersBankAgent"
}'

curl --location --request POST 'http://localhost:9000/register' \
--header 'Content-Type: text/plain' \
--data-raw '{
  "seed": "00000000000000000BuyersBankAgent"
}'
