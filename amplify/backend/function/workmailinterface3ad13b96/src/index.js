const { WorkMailClient, ListGroupsCommand, CreateGroupCommand } = require("@aws-sdk/client-workmail"); 

exports.handler = async (event) => {

    console.log(event);

    const client = new WorkMailClient({region: "us-east-1"});

    switch(event.httpMethod) {
        case "GET": {
            const command = new ListGroupsCommand({OrganizationId: "m-04a672b08206471da6a6a4751043a105"});
            const res = await client.send(command);

            // TODO implement
            const response = {
                statusCode: 200,
            //  Uncomment below to enable CORS requests
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            }, 
                body: JSON.stringify(res.Groups),
            };
            return response;
        }
        case "POST": {
            const command = new CreateGroupCommand({
                OrganizationId: "m-04a672b08206471da6a6a4751043a105",
                Name: event.body.aliasName,
            })
            
            const res = await client.send(command);
            // TODO implement
            const response = {
                statusCode: 200,
            //  Uncomment below to enable CORS requests
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            }, 
                body: JSON.stringify(res),
            };
            return response; 
        }
        default: {
            return null;
        }
    }

};
