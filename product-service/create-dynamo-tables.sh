aws dynamodb create-table \
    --table-name products \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
    --key-schema \
        AttributeName=id,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

aws dynamodb create-table \
    --table-name stocks \
    --attribute-definitions \
        AttributeName=product_id,AttributeType=S \
    --key-schema \
        AttributeName=product_id,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
