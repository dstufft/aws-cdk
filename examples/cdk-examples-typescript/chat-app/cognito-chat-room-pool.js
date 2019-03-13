"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cognito = require("@aws-cdk/aws-cognito");
const cdk = require("@aws-cdk/cdk");
class CognitoChatRoomPool extends cdk.Construct {
    constructor(parent, name) {
        super(parent, name);
        // Create chat room user pool
        const chatPool = new cognito.cloudformation.UserPoolResource(this, 'UserPool', {
            adminCreateUserConfig: {
                allowAdminCreateUserOnly: false
            },
            policies: {
                passwordPolicy: {
                    minimumLength: 6,
                    requireNumbers: true
                }
            },
            schema: [
                {
                    attributeDataType: 'String',
                    name: 'email',
                    required: true
                }
            ],
            autoVerifiedAttributes: ['email']
        });
        // Now for the client
        new cognito.cloudformation.UserPoolClientResource(this, 'UserPoolClient', {
            clientName: 'Chat-Room',
            explicitAuthFlows: ['ADMIN_NO_SRP_AUTH'],
            refreshTokenValidity: 30,
            userPoolId: chatPool.ref
        });
    }
}
exports.CognitoChatRoomPool = CognitoChatRoomPool;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29nbml0by1jaGF0LXJvb20tcG9vbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvZ25pdG8tY2hhdC1yb29tLXBvb2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxnREFBaUQ7QUFDakQsb0NBQXFDO0FBRXJDLE1BQWEsbUJBQW9CLFNBQVEsR0FBRyxDQUFDLFNBQVM7SUFDcEQsWUFBWSxNQUFxQixFQUFFLElBQVk7UUFDN0MsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUVwQiw2QkFBNkI7UUFDN0IsTUFBTSxRQUFRLEdBQUcsSUFBSSxPQUFPLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDN0UscUJBQXFCLEVBQUU7Z0JBQ3JCLHdCQUF3QixFQUFFLEtBQUs7YUFDaEM7WUFDRCxRQUFRLEVBQUU7Z0JBQ1IsY0FBYyxFQUFFO29CQUNkLGFBQWEsRUFBRSxDQUFDO29CQUNoQixjQUFjLEVBQUUsSUFBSTtpQkFDckI7YUFBRTtZQUNMLE1BQU0sRUFBRTtnQkFDTjtvQkFDRSxpQkFBaUIsRUFBRSxRQUFRO29CQUMzQixJQUFJLEVBQUUsT0FBTztvQkFDYixRQUFRLEVBQUUsSUFBSTtpQkFDZjthQUNGO1lBQ0Qsc0JBQXNCLEVBQUUsQ0FBRSxPQUFPLENBQUU7U0FDcEMsQ0FBQyxDQUFDO1FBRUgscUJBQXFCO1FBQ3JCLElBQUksT0FBTyxDQUFDLGNBQWMsQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7WUFDeEUsVUFBVSxFQUFFLFdBQVc7WUFDdkIsaUJBQWlCLEVBQUUsQ0FBRSxtQkFBbUIsQ0FBRTtZQUMxQyxvQkFBb0IsRUFBRSxFQUFFO1lBQ3hCLFVBQVUsRUFBRSxRQUFRLENBQUMsR0FBRztTQUN4QixDQUFDLENBQUM7SUFDTixDQUFDO0NBQ0Y7QUFoQ0Qsa0RBZ0NDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNvZ25pdG8gPSByZXF1aXJlKCdAYXdzLWNkay9hd3MtY29nbml0bycpO1xuaW1wb3J0IGNkayA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2NkaycpO1xuXG5leHBvcnQgY2xhc3MgQ29nbml0b0NoYXRSb29tUG9vbCBleHRlbmRzIGNkay5Db25zdHJ1Y3Qge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IGNkay5Db25zdHJ1Y3QsIG5hbWU6IHN0cmluZykge1xuICAgIHN1cGVyKHBhcmVudCwgbmFtZSk7XG5cbiAgICAvLyBDcmVhdGUgY2hhdCByb29tIHVzZXIgcG9vbFxuICAgIGNvbnN0IGNoYXRQb29sID0gbmV3IGNvZ25pdG8uY2xvdWRmb3JtYXRpb24uVXNlclBvb2xSZXNvdXJjZSh0aGlzLCAnVXNlclBvb2wnLCB7XG4gICAgICBhZG1pbkNyZWF0ZVVzZXJDb25maWc6IHtcbiAgICAgICAgYWxsb3dBZG1pbkNyZWF0ZVVzZXJPbmx5OiBmYWxzZVxuICAgICAgfSxcbiAgICAgIHBvbGljaWVzOiB7XG4gICAgICAgIHBhc3N3b3JkUG9saWN5OiB7XG4gICAgICAgICAgbWluaW11bUxlbmd0aDogNixcbiAgICAgICAgICByZXF1aXJlTnVtYmVyczogdHJ1ZVxuICAgICAgICB9IH0sXG4gICAgICBzY2hlbWE6IFtcbiAgICAgICAge1xuICAgICAgICAgIGF0dHJpYnV0ZURhdGFUeXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAnZW1haWwnLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBhdXRvVmVyaWZpZWRBdHRyaWJ1dGVzOiBbICdlbWFpbCcgXVxuICAgIH0pO1xuXG4gICAgLy8gTm93IGZvciB0aGUgY2xpZW50XG4gICAgbmV3IGNvZ25pdG8uY2xvdWRmb3JtYXRpb24uVXNlclBvb2xDbGllbnRSZXNvdXJjZSh0aGlzLCAnVXNlclBvb2xDbGllbnQnLCB7XG4gICAgICBjbGllbnROYW1lOiAnQ2hhdC1Sb29tJyxcbiAgICAgIGV4cGxpY2l0QXV0aEZsb3dzOiBbICdBRE1JTl9OT19TUlBfQVVUSCcgXSxcbiAgICAgIHJlZnJlc2hUb2tlblZhbGlkaXR5OiAzMCxcbiAgICAgIHVzZXJQb29sSWQ6IGNoYXRQb29sLnJlZlxuICAgICB9KTtcbiAgfVxufVxuIl19