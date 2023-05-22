
#### Use backoffice with through API

Follow the steps below to run the backoffice app and the workflow service.
Open cases in the backoffice by sending API requests to the workflow service. 

   1. Clone the project:  
   ```sh
   git clone https://github.com/ballerine-io/ballerine.git
   ```
   2. Install npm depenencies: 
   ```sh
   git checkout dev
   ```
   3.  Checkout to `dev` branch:  
  ```sh
   pnpm install
   ```
   5. Init to monorepo (build packages): 
   ```sh
   run monorepo:init
   ```
   6. Initilazie monorepo: 
   ```sh
   pnpm run api-manual-review-example
   ```
_Now the backoffice will run on (localhost....), and the workflow service will accept calls at localhost:300_

7. 
you can use the following postman collection or curl command to insert a case into the backoffice

<details>
<summary>Click to see CURL command</summary>

```sh
curl --location 'http://localhost:3000/api/v1/external/workflows/run' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer secret' \
--data-raw '{
    "workflowId": "risk-score-improvement-dev",
    "context": {
        "entity": {
            "id": "fido-user-id1111111",
            "data": {
                "companyName": "McClure Inc",
                "registrationNumber": "2d92b229-626b-4f99-9a9b-2191e974e2b9",
                "legalForm": "and Sons",
                "countryOfIncorporation": "Heard Island and McDonald Islands",
                "dateOfIncorporation": "2016-04-09T03:16:42.496Z",
                "address": "7533 Lilyan Springs",
                "phoneNumber": "+7169584993",
                "email": "Macie18@yahoo.com",
                "website": "https:\/\/oily-testing.biz",
                "industry": "embrace bleeding-edge partnerships",
                "taxIdentificationNumber": "1731576041",
                "vatNumber": "VAT87025707",
                "numberOfEmployees": 453,
                "businessPurpose": "Networked transitional approach"
            },
            "type": "business"
        },
        "documents": [
            {
                "type": "drivers_license",
                "pages": [
                    {
                        "uri": "https://backoffice-demo.ballerine.app/images/mock-documents/set_1_doc_front.png",
                        "data": "",
                        "type": "jpg",
                        "metadata": {
                            "side": "front",
                            "pageNumber": "1"
                        },
                        "provider": "http"
                    },
                    {
                        "uri": "https://backoffice-demo.ballerine.app/images/mock-documents/set_1_doc_back.png",
                        "data": "",
                        "type": "jpg",
                        "metadata": {
                            "side": "back",
                            "pageNumber": "2"
                        },
                        "provider": "http"
                    }
                ],
                "issuer": {
                    "city": "Brockside",
                    "name": "Government",
                    "type": "government",
                    "country": "CA",
                    "additionalDetails": {}
                },
                "version": 1,
                "category": "identification",
                "properties": {
                    "docNumber": "1234",
                    "userAddress": "Turkey, buhgdawe"
                },
                "issuingVersion": 1
            },
            {
                "type": "certificate_of_incorporation",
                "pages": [
                    {
                        "uri": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Certificate_of_incorporation.png/388px-Certificate_of_incorporation.png?20110630185120",
                        "data": "",
                        "type": "jpg",
                        "metadata": {
                            "side": "front",
                            "pageNumber": "1"
                        },
                        "provider": "http",
                        "ballerineFileId": "clhz0lhzd0006ru5ab3p0uf67"
                    }
                ],
                "issuer": {
                    "city": "Brockside",
                    "name": "Government",
                    "type": "government",
                    "country": "TH",
                    "additionalDetails": {}
                },
                "version": 1,
                "category": "regestration",
                "properties": {
                    "website": "https://ballerine.com",
                    "docNumber": "1234",
                    "userAddress": "Turkey, buhgdawe"
                },
                "issuingVersion": 1
            }
        ]
    }
}'

```

</details>
<details>
<summary>Click to see Postaman collection</summary>

```sh
{
	"info": {
		"_postman_id": "3bf729f5-7771-41c0-b809-b4415ad8e95f",
		"name": "Ballerine - Local",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
	},
	"item": [
		{
			"name": "http://localhost:3000/api/v1/external/workflows/run",
			"request": {
				"auth": {
					"type": "bearer",
					"bearer": [
						{
							"key": "token",
							"value": "secret",
							"type": "string"
						}
					]
				},
				"method": "POST",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\n    \"workflowId\": \"risk-score-improvement-dev\",\n    \"context\": {\n        \"entity\": {\n            \"id\": \"fido-user-id1111\",\n            \"data\": {\n                \"companyName\": \"McClure Inc\",\n                \"registrationNumber\": \"2d92b229-626b-4f99-9a9b-2191e974e2b9\",\n                \"legalForm\": \"and Sons\",\n                \"countryOfIncorporation\": \"Heard Island and McDonald Islands\",\n                \"dateOfIncorporation\": \"2016-04-09T03:16:42.496Z\",\n                \"address\": \"7533 Lilyan Springs\",\n                \"phoneNumber\": \"+7169584993\",\n                \"email\": \"Macie18@yahoo.com\",\n                \"website\": \"https:\\/\\/oily-testing.biz\",\n                \"industry\": \"embrace bleeding-edge partnerships\",\n                \"taxIdentificationNumber\": \"1731576041\",\n                \"vatNumber\": \"VAT87025707\",\n                \"numberOfEmployees\": 453,\n                \"businessPurpose\": \"Networked transitional approach\"\n            },\n            \"type\": \"business\"\n        },\n        \"documents\": [\n            {\n                \"type\": \"drivers_license\",\n                \"pages\": [\n                    {\n                        \"uri\": \"https://backoffice-demo.ballerine.app/images/mock-documents/set_1_doc_front.png\",\n                        \"data\": \"\",\n                        \"type\": \"jpg\",\n                        \"metadata\": {\n                            \"side\": \"front\",\n                            \"pageNumber\": \"1\"\n                        },\n                        \"provider\": \"http\",\n                        \"ballerineFileId\": \"clhz0lhy60004ru5ajduq32s2\"\n                    },\n                    {\n                        \"uri\": \"https://backoffice-demo.ballerine.app/images/mock-documents/set_1_doc_back.png\",\n                        \"data\": \"\",\n                        \"type\": \"jpg\",\n                        \"metadata\": {\n                            \"side\": \"back\",\n                            \"pageNumber\": \"2\"\n                        },\n                        \"provider\": \"http\",\n                        \"ballerineFileId\": \"clhz0lhxy0002ru5a53674d7b\"\n                    }\n                ],\n                \"issuer\": {\n                    \"city\": \"Brockside\",\n                    \"name\": \"Government\",\n                    \"type\": \"government\",\n                    \"country\": \"CA\",\n                    \"additionalDetails\": {}\n                },\n                \"version\": 1,\n                \"category\": \"identification\",\n                \"properties\": {\n                    \"docNumber\": \"1234\",\n                    \"userAddress\": \"Turkey, buhgdawe\"\n                },\n                \"issuingVersion\": 1\n            },\n            {\n                \"type\": \"certificate_of_incorporation\",\n                \"pages\": [\n                    {\n                        \"uri\": \"https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Certificate_of_incorporation.png/388px-Certificate_of_incorporation.png?20110630185120\",\n                        \"data\": \"\",\n                        \"type\": \"jpg\",\n                        \"metadata\": {\n                            \"side\": \"front\",\n                            \"pageNumber\": \"1\"\n                        },\n                        \"provider\": \"http\",\n                        \"ballerineFileId\": \"clhz0lhzd0006ru5ab3p0uf67\"\n                    }\n                ],\n                \"issuer\": {\n                    \"city\": \"Brockside\",\n                    \"name\": \"Government\",\n                    \"type\": \"government\",\n                    \"country\": \"TH\",\n                    \"additionalDetails\": {}\n                },\n                \"version\": 1,\n                \"category\": \"regestration\",\n                \"properties\": {\n                    \"website\": \"https://ballerine.com\",\n                    \"docNumber\": \"1234\",\n                    \"userAddress\": \"Turkey, buhgdawe\"\n                },\n                \"issuingVersion\": 1\n            }\n        ]\n    }\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "http://localhost:3000/api/v1/external/workflows/run",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "3000",
					"path": [
						"api",
						"v1",
						"external",
						"workflows",
						"run"
					]
				}
			},
			"response": []
		}
	]
}

```

</details>
