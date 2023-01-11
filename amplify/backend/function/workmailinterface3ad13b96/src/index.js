const { WorkMailClient, ListGroupsCommand, CreateGroupCommand, RegisterToWorkMailCommand, AssociateMemberToGroupCommand, PutMailboxPermissionsCommand, NameAvailabilityException } = require("@aws-sdk/client-workmail"); 
const { Console } = require("console");

exports.handler = async (event) => {

    console.log(event);

    const client = new WorkMailClient({region: "us-east-1"});

    let statusCode = 200;
    let body;

    switch(event.httpMethod) {
        case "GET": {
            const groups = [];

            let res = {NextToken: undefined}, command;
            do {
                command = new ListGroupsCommand({OrganizationId: "m-04a672b08206471da6a6a4751043a105", NextToken: res.NextToken});
                res = await client.send(command);

                groups.push(...res.Groups);
            } while (res.NextToken !== undefined);

            body = JSON.stringify(groups);

            break;
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
                // if (e instanceof NameAvailabilityException) {
                    
                //     break;
                // } else {
                //     throw e;
                // }

                statusCode = 400;
                body = JSON.stringify({
                    error: {
                        message: "Name already taken",
                        stack: e.stack,
                        error: e
                    }
                });
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
                PermissionValues: ["SEND_AS"],
            });

            const putMailboxPermissionsResponse = await client.send(putMailboxPermissionsCommand);

            body = JSON.stringify({
                "createGroupResponse": createGroupResponse, 
                "registerToWorkMailResponse": registerToWorkMailResponse, 
                "associateMemberToGroupResponse": associateMemberToGroupResponse,
                "putMailboxPermissionsResponse": putMailboxPermissionsResponse,
            })

            break;
        }
        default: {
            return null;
        }
    }

    const response = {
        statusCode: statusCode,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        }, 
        body: body,
    };
    return response; 

};
