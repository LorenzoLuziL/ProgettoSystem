
export const _ownershipSchema = {

    "attributes": ['city', 'address', 'purchase_date', 'amplitude', 'number_of_rooms', 'timestamp'],
    "schema_name": `ownershipSchema`,
    "schema_version": "1.0",

}

export const _offerPropertySchema = {

    "attributes": ["price", "timestamp"],
    "schema_name": "offerPropertySchema",
    "schema_version": "1.0",

}

export const _mortgageSchema = {

    "attributes": ["borrowers", "lenders", "amount", "interest", "address", "description", "timestamp"],
    "schema_name": "mortgageSchema",
    "schema_version": "1.0",

}


export const _mortgageOffer = {
    "auto_remove": false,
    "auto_issue": true,
    "auto_offer": true,
    "support_revocation": true,
    "cred_def_id": "<Enter a valid Connection ID>",
    "connection_id": "<Enter a valid Connection ID>",
    "credential_preview": {
        "@type": "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/issue-credential/1.0/credential-preview",
        "attributes": [
            {
                "mime-type": "plain/text",
                "name": "borrowers",
                "value": "Intesa San Paolo"
            },
            {
                "mime-type": "plain/text",
                "name": "lenders",
                "value": "Giacomo Verdi"
            },
            {
                "mime-type": "plain/text",
                "name": "amount",
                "value": "200000"
            },
            {
                "mime-type": "plain/text",
                "name": "interest",
                "value": "4%"
            },
            {
                "mime-type": "plain/text",
                "name": "address",
                "value": "Camerino, Via Madonna delle Carceri,1 "
            },
            {
                "mime-type": "plain/text",
                "name": "description",
                "value": "La casa è composta da 4 stanze, con giardino esterno e box auto..."
            },
            {
                "mime-type": "plain/text",
                "name": "timestamp",
                "value": "2022/01/01 15:40:30"
            }
        ],
        "predicates": [

        ]
    },
    "trace": true
};


export const _registryOffer = {
    "auto_remove": false,
    "auto_issue": true,
    "auto_offer": true,
    "support_revocation": true,
    "cred_def_id": "<Enter a valid Connection ID>",
    "connection_id": "<Enter a valid Connection ID>",
    "credential_preview": {
        "@type": "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/issue-credential/1.0/credential-preview",
        "attributes": [
            {
                "mime-type": "plain/text",
                "name": "city",
                "value": "Camerino"
            },
            {
                "mime-type": "plain/text",
                "name": "address",
                "value": "Via Madonna delle Carceri"
            },
            {
                "mime-type": "plain/text",
                "name": "purchase_date",
                "value": "2021/01/01"
            },
            {
                "mime-type": "plain/text",
                "name": "amplitude",
                "value": "200mq"
            },
            {
                "mime-type": "plain/text",
                "name": "number_of_rooms",
                "value": "8"
            },
            {
                "mime-type": "plain/text",
                "name": "timestamp",
                "value": "2022/01/01 15:40:30"
            }
        ],
        "predicates": [

        ]
    },
    "trace": true
};

export const _propertyOffer = {
    "auto_remove": false,
    "auto_issue": true,
    "auto_offer": true,
    "support_revocation": true,
    "cred_def_id": "<Enter a valid Connection ID>",
    "connection_id": "<Enter a valid Connection ID>",
    "credential_preview": {
        "@type": "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/issue-credential/1.0/credential-preview",
        "attributes": [
            {
                "mime-type": "plain/text",
                "name": "price",
                "value": "200000"
            },
            {
                "mime-type": "plain/text",
                "name": "timestamp",
                "value": "2022/01/01 15:40:30"
            }
        ],
        "predicates": [

        ]
    },
    "trace": true
};


export const _proofRequest = {
    "auto_verify": true,
    "comment": "string",
    "connection_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "proof_request": {
        "name": "Proof of ownership",
        "nonce": "1",
        "version": "1.0",
        "requested_attributes": {
            "additionalProp1": {
                "name": "city",
                "cred_def_id": "16YXSaLmsrcyAE7dC5C1Wp:3:CL:12:default",
                "restrictions": [
                    {

                    }
                ],
                "non_revoked": {
                    "from": 1666434192,
                    "to": Date.now()
                }
            },

        },
        "requested_predicates": {

        },
        "trace": true
    }
};

export const _mortgageRequest = {
    "auto_verify": true,
    "comment": "string",
    "connection_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "proof_request": {
        "name": "Proof of mortgage deeds",
        "nonce": "1",
        "version": "1.0",
        "requested_attributes": {
            "additionalProp1": {
                "name": "timestamp",
                "cred_def_id": "2zcDxea3AgxU4Ncmrq94iA:3:CL:18:default",
                "restrictions": [
                    {

                    }
                ],
                "non_revoked": {
                    "from": 1666434192,
                    "to": Date.now()
                }
            },

        },
        "requested_predicates": {

        },
        "trace": true
    }
};


export const _proofPresentation = {
    "requested_attributes": {
        "additionalProp1": {
            "cred_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "revealed": true
        }
    },
    "requested_predicates": {

    },
    "self_attested_attributes": {

    },
    "trace": true
};

export const _agents = {
    seller: { agentPort: 8041},
    registry: { agentPort: 8051, schema: _ownershipSchema },
    broker: { agentPort: 8061, schema: _offerPropertySchema, },
    buyer: { agentPort: 8071},
    sellersbank: { agentPort: 8081, schema: _mortgageSchema, },
    buyersbank: { agentPort: 8091}
};
