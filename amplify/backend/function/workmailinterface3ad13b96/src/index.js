const { WorkMailClient, ListGroupsCommand, CreateGroupCommand, RegisterToWorkMailCommand, AssociateMemberToGroupCommand, PutMailboxPermissionsCommand, NameAvailabilityException } = require("@aws-sdk/client-workmail"); 

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
            const eventBody = JSON.parse(event.body);

            const createGroupCommand = new CreateGroupCommand({
                OrganizationId: "m-04a672b08206471da6a6a4751043a105",
                Name: eventBody.aliasName,
            });
            
            let createGroupResponse;
            try {    
                createGroupResponse = await client.send(createGroupCommand);
            } catch (e) {
                if (e instanceof NameAvailabilityException) {
                    return {
                        statusCode: 400,
                        headers: {
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Headers": "*"
                        }, 
                        body: JSON.stringify({
                            message: "Name is already taken",
                        }),
                    };
                } else {
                    throw e;
                }
            }

            const registerToWorkMailCommand = new RegisterToWorkMailCommand({
                OrganizationId: "m-04a672b08206471da6a6a4751043a105",
                EntityId: createGroupResponse.GroupId,
                Email: eventBody.email,
            });

            const registerToWorkMailResponse = await client.send(registerToWorkMailCommand);


            const associateMemberToGroupCommand = new AssociateMemberToGroupCommand({
                OrganizationId: "m-04a672b08206471da6a6a4751043a105",
                GroupId: createGroupResponse.GroupId,
                MemberId: "6618dd9f-e6d9-42b6-b481-994937a32831",
            });

            const associateMemberToGroupResponse = await client.send(associateMemberToGroupCommand);

            const putMailboxPermissionsCommand = new PutMailboxPermissionsCommand({
                OrganizationId: "m-04a672b08206471da6a6a4751043a105",
                EntityId: createGroupResponse.GroupId,
                GranteeId: "6618dd9f-e6d9-42b6-b481-994937a32831",
                PermissionValues: ["FULL_ACCESS"],
            });

            const putMailboxPermissionsResponse = await client.send(putMailboxPermissionsCommand);

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
                    "registerToWorkMailResponse": registerToWorkMailResponse, 
                    "associateMemberToGroupResponse": associateMemberToGroupResponse,
                    "putMailboxPermissionsResponse": putMailboxPermissionsResponse,
                }),
            };
            return response; 
        }
        default: {
            return null;
        }
    }

};
