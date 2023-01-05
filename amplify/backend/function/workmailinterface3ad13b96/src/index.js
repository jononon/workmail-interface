const { WorkMailClient, ListGroupsCommand, CreateGroupCommand, CreateAliasCommand, AssociateMemberToGroupCommand } = require("@aws-sdk/client-workmail"); 

exports.handler = async (event) => {

    console.log(event);

    const client = new WorkMailClient({region: "us-east-1"});

    switch(event.httpMethod) {
        case "GET": {
            const groups = [];

            let res = {NextToken: undefined}, command;
            do {
                command = new ListGroupsCommand({OrganizationId: "m-04a672b08206471da6a6a4751043a105", NextToken: res.NextToken});
                res = await client.send(command);

                groups.push(...res.Groups);
            } while (res.NextToken !== undefined);

            // TODO implement
            const response = {
                statusCode: 200,
            //  Uncomment below to enable CORS requests
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            }, 
                body: JSON.stringify(groups),
            };
            return response;
        }
        case "POST": {
            const createGroupCommand = new CreateGroupCommand({
                OrganizationId: "m-04a672b08206471da6a6a4751043a105",
                Name: event.body.aliasName,
            });
            
            const createGroupResponse = await client.send(createGroupCommand);


            const createAliasCommand = new CreateAliasCommand({
                OrganizationId: "m-04a672b08206471da6a6a4751043a105",
                EntityId: createGroupResponse.GroupId,
                Alias: event.body.email,
            });

            const createAliasResponse = await client.send(createAliasCommand);

            const associateMemberToGroupCommand = new AssociateMemberToGroupCommand({
                OrganizationId: "m-04a672b08206471da6a6a4751043a105",
                GroupId: createGroupResponse.GroupId,
                MemberId: "6618dd9f-e6d9-42b6-b481-994937a32831",
            });

            const associateMemberToGroupResponse = await client.send(associateMemberToGroupCommand);

            // TODO implement
            const response = {
                statusCode: 200,
            //  Uncomment below to enable CORS requests
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            }, 
                body: JSON.stringify({
                    "createGroupResponse": createGroupResponse, 
                    "createAliasResponse": createAliasResponse, 
                    "associateMemberToGroupResponse": associateMemberToGroupResponse,
                }),
            };
            return response; 
        }
        default: {
            return null;
        }
    }

};
