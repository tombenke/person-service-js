#!/usr/bin/bash

Step () {
    echo ""
    echo ""
    echo $1
}

assert () {
    if [ $? -eq 0 ]
    then
        echo "O.K."
        echo ""
    else
        echo "Failed"
        echo ""
        exit 1
    fi
}

Step "Delete all persons:"
curl -X DELETE http://localhost:3007/persons

Step "Get the list of all persons:"
curl http://localhost:3007/persons

Step "Upload some new persons using it full-name as ID:"
curl -X PUT http://localhost:3007/persons/luke-skywalker -H "Content-type: application/json" -d '{"id":"luke-skywalker","familyName":"Skywalker","givenName":"Luke"}'
curl -X PUT http://localhost:3007/persons/leia-organa -H "Content-type: application/json" -d '{"id":"leia-organa","familyName":"Organa","givenName":"Leia"}'
curl -X PUT http://localhost:3007/persons/han-solo -H "Content-type: application/json" -d '{"id":"han-solo","familyName":"Solo","givenName":"Han"}'

Step "Get the list to see if the newly uploaded person appears in the list:"

curl --silent http://localhost:3007/persons/ | jq --exit-status '[.[].id ] | length == 3'
assert

Step "Get a selected person by its ID:"
curl --silent http://localhost:3007/persons/luke-skywalker | jq  --exit-status '.id == "luke-skywalker"'
assert

Step "Update a propery of an existing person:"
curl -X PUT http://localhost:3007/persons/luke-skywalker -H "Content-type: application/json" -d '{"id":"luke-skywalker","familyName":"Skywalker","givenName":"Lucas"}'

Step "Check if property update was successful:"
curl --silent http://localhost:3007/persons/luke-skywalker | jq  --exit-status '.givenName == "Lucas"'
assert

Step "Delete all persons:"
curl -X DELETE http://localhost:3007/persons

Step "Check if persons are really removed:"
curl --silent http://localhost:3007/persons/ | jq --exit-status '[.[].id ] | length == 0'
assert

Step "Try to access a non-existing person, to see that you got a '404 Not Found' response:"
[ `curl --silent -i http://localhost:3007/persons/luke-skywalker | head -n 1 | cut -c 10-13` -eq "404" ]
assert

Step "Try to call an existing endpoint with a method that is not implemented, so that you got a '501 Not Implemented' response:"
[ `curl --silent -i -X POST http://localhost:3007/persons | head -n 1 | cut -c 10-13` -eq "501" ]
assert
