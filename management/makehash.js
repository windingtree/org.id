const web3utils = require('web3-utils');
const stringOrgJsonContents = `{
    "@context": "https://windingtree.com/ns/did/v1",
    "id": "did:orgid:0xA0B74BFE28223c9e08d6DBFa74B5bf4Da763f959",
    "created": "2019-01-01T13:10:02.251Z",
    "updated": "2019-06-03T13:20:06.398Z",
    "publicKey": [],
    "service": [
        {
            "id": "did:orgid:0xA0B74BFE28223c9e08d6DBFa74B5bf4Da763f959#org-id-rest",
            "type": "org-id-rest-0.7.1a",
            "serviceEndpoint": "https://api.arbor.fm/orgid/"
        }
    ],
    "trust": {
        "assertions": [
            {
                "type": "domain",
                "claim": "arbor.fm",
                "proof": "dns"
            }
        ],
        "credentials": []
    },
    "organizationalUnit": {
        "name": "Arbor",
        "type": [],
        "description": "Arbor is a tool for managing your ORG.ID",
        "longDescription": "",
        "address": {},
        "openingHours": [],
        "contacts": [],
        "media": {
            "logo": "https://arbor.fm/images/arbor-logo.png",
            "images": [],
            "videos": [],
            "documents": []
        }
    }
}`;
// It is important to work with a textual ORG.JSON and *not* a JSON-parsed and re-serialized form.
// JSON serializers might be producing different outcomes which would result in different hashes.
const hashedOrgJson = web3utils.soliditySha3(stringOrgJsonContents);
console.log(`Put me into 0xORG: ${hashedOrgJson}`);
