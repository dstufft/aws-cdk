"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lambda = require("@aws-cdk/aws-lambda");
const s3 = require("@aws-cdk/aws-s3");
const cdk = require("@aws-cdk/cdk");
const cognito_chat_room_pool_1 = require("./cognito-chat-room-pool");
const dynamodb_posts_table_1 = require("./dynamodb-posts-table");
class MyStack extends cdk.Stack {
    constructor(parent, name, props) {
        super(parent, name, props);
        new dynamodb_posts_table_1.DynamoPostsTable(this, 'Posts');
        new cognito_chat_room_pool_1.CognitoChatRoomPool(this, 'UserPool');
        const bucket = s3.BucketRef.import(this, 'DougsBucket', {
            bucketName: 'dougs-chat-app'
        });
        new ChatAppFunction(this, 'StartAddBucket', {
            bucket,
            zipFile: 'StartAddingPendingCognitoUser.zip'
        });
        new ChatAppFunction(this, 'FinishAddBucket', {
            bucket,
            zipFile: 'FinishAddingPendingCognitoUser.zip'
        });
        new ChatAppFunction(this, 'SignInUserBucket', {
            bucket,
            zipFile: 'SignInCognitoUser.zip'
        });
        new ChatAppFunction(this, 'VerifyBucket', {
            bucket,
            zipFile: 'VerifyCognitoSignIn.zip'
        });
        new ChatAppFunction(this, 'StartChangeBucket', {
            bucket,
            zipFile: 'StartChangingForgottenCognitoUserPassword.zip'
        });
        new ChatAppFunction(this, 'FinishChangeBucket', {
            bucket,
            zipFile: 'FinishChangingForgottenCognitoUserPassword.zip'
        });
        new ChatAppFunction(this, 'GetPostsBucket', {
            bucket,
            zipFile: 'GetPosts.zip'
        });
        new ChatAppFunction(this, 'AddPostBucket', {
            bucket,
            zipFile: 'AddPost.zip'
        });
        new ChatAppFunction(this, 'DeletePostBucket', {
            bucket,
            zipFile: 'DeletePost.zip'
        });
        new ChatAppFunction(this, 'DeleteUserBucket', {
            bucket,
            zipFile: 'DeleteCognitoUser.zip'
        });
    }
}
/*
 * Extend Function as all of the Chat app functions have these common props.
 */
class ChatAppFunction extends lambda.Function {
    constructor(parent, name, props) {
        super(parent, name, {
            code: new lambda.S3Code(props.bucket, props.zipFile),
            runtime: lambda.Runtime.NodeJS610,
            handler: 'index.handler'
        });
    }
}
const app = new cdk.App();
// Add the stack to the app
// (apps can host many stacks, for example, one for each region)
new MyStack(app, 'ChatAppStack', { env: { region: 'us-west-2' } });
app.run();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDhDQUErQztBQUMvQyxzQ0FBdUM7QUFDdkMsb0NBQXFDO0FBQ3JDLHFFQUErRDtBQUMvRCxpRUFBMEQ7QUFFMUQsTUFBTSxPQUFRLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDN0IsWUFBWSxNQUFlLEVBQUUsSUFBWSxFQUFFLEtBQXNCO1FBQy9ELEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRTNCLElBQUksdUNBQWdCLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRXBDLElBQUksNENBQW1CLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRTFDLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUU7WUFDdEQsVUFBVSxFQUFFLGdCQUFnQjtTQUM3QixDQUFDLENBQUM7UUFFSCxJQUFJLGVBQWUsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7WUFDMUMsTUFBTTtZQUNOLE9BQU8sRUFBRSxtQ0FBbUM7U0FDN0MsQ0FBQyxDQUFDO1FBRUgsSUFBSSxlQUFlLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFO1lBQzNDLE1BQU07WUFDTixPQUFPLEVBQUUsb0NBQW9DO1NBQzlDLENBQUMsQ0FBQztRQUVILElBQUksZUFBZSxDQUFDLElBQUksRUFBRSxrQkFBa0IsRUFBRTtZQUM1QyxNQUFNO1lBQ04sT0FBTyxFQUFFLHVCQUF1QjtTQUNqQyxDQUFDLENBQUM7UUFFSCxJQUFJLGVBQWUsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ3hDLE1BQU07WUFDTixPQUFPLEVBQUUseUJBQXlCO1NBQ25DLENBQUMsQ0FBQztRQUVILElBQUksZUFBZSxDQUFDLElBQUksRUFBRSxtQkFBbUIsRUFBRTtZQUM3QyxNQUFNO1lBQ04sT0FBTyxFQUFFLCtDQUErQztTQUN6RCxDQUFDLENBQUM7UUFFSCxJQUFJLGVBQWUsQ0FBQyxJQUFJLEVBQUUsb0JBQW9CLEVBQUU7WUFDOUMsTUFBTTtZQUNOLE9BQU8sRUFBRSxnREFBZ0Q7U0FDMUQsQ0FBQyxDQUFDO1FBRUgsSUFBSSxlQUFlLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFO1lBQzFDLE1BQU07WUFDTixPQUFPLEVBQUUsY0FBYztTQUN4QixDQUFDLENBQUM7UUFFSCxJQUFJLGVBQWUsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO1lBQ3pDLE1BQU07WUFDTixPQUFPLEVBQUUsYUFBYTtTQUN2QixDQUFDLENBQUM7UUFFSCxJQUFJLGVBQWUsQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUU7WUFDNUMsTUFBTTtZQUNOLE9BQU8sRUFBRSxnQkFBZ0I7U0FDMUIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxlQUFlLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFO1lBQzVDLE1BQU07WUFDTixPQUFPLEVBQUUsdUJBQXVCO1NBQ2pDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQU9EOztHQUVHO0FBQ0gsTUFBTSxlQUFnQixTQUFRLE1BQU0sQ0FBQyxRQUFRO0lBQzNDLFlBQVksTUFBcUIsRUFBRSxJQUFZLEVBQUUsS0FBdUI7UUFDdEUsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUU7WUFDbEIsSUFBSSxFQUFFLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUM7WUFDcEQsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUztZQUNqQyxPQUFPLEVBQUUsZUFBZTtTQUN6QixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQiwyQkFBMkI7QUFDM0IsZ0VBQWdFO0FBQ2hFLElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRSxjQUFjLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBRW5FLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBsYW1iZGEgPSByZXF1aXJlKCdAYXdzLWNkay9hd3MtbGFtYmRhJyk7XG5pbXBvcnQgczMgPSByZXF1aXJlKCdAYXdzLWNkay9hd3MtczMnKTtcbmltcG9ydCBjZGsgPSByZXF1aXJlKCdAYXdzLWNkay9jZGsnKTtcbmltcG9ydCB7IENvZ25pdG9DaGF0Um9vbVBvb2wgfSBmcm9tICcuL2NvZ25pdG8tY2hhdC1yb29tLXBvb2wnO1xuaW1wb3J0IHsgRHluYW1vUG9zdHNUYWJsZSB9IGZyb20gJy4vZHluYW1vZGItcG9zdHMtdGFibGUnO1xuXG5jbGFzcyBNeVN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3IocGFyZW50OiBjZGsuQXBwLCBuYW1lOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihwYXJlbnQsIG5hbWUsIHByb3BzKTtcblxuICAgIG5ldyBEeW5hbW9Qb3N0c1RhYmxlKHRoaXMsICdQb3N0cycpO1xuXG4gICAgbmV3IENvZ25pdG9DaGF0Um9vbVBvb2wodGhpcywgJ1VzZXJQb29sJyk7XG5cbiAgICBjb25zdCBidWNrZXQgPSBzMy5CdWNrZXRSZWYuaW1wb3J0KHRoaXMsICdEb3Vnc0J1Y2tldCcsIHtcbiAgICAgIGJ1Y2tldE5hbWU6ICdkb3Vncy1jaGF0LWFwcCdcbiAgICB9KTtcblxuICAgIG5ldyBDaGF0QXBwRnVuY3Rpb24odGhpcywgJ1N0YXJ0QWRkQnVja2V0Jywge1xuICAgICAgYnVja2V0LFxuICAgICAgemlwRmlsZTogJ1N0YXJ0QWRkaW5nUGVuZGluZ0NvZ25pdG9Vc2VyLnppcCdcbiAgICB9KTtcblxuICAgIG5ldyBDaGF0QXBwRnVuY3Rpb24odGhpcywgJ0ZpbmlzaEFkZEJ1Y2tldCcsIHtcbiAgICAgIGJ1Y2tldCxcbiAgICAgIHppcEZpbGU6ICdGaW5pc2hBZGRpbmdQZW5kaW5nQ29nbml0b1VzZXIuemlwJ1xuICAgIH0pO1xuXG4gICAgbmV3IENoYXRBcHBGdW5jdGlvbih0aGlzLCAnU2lnbkluVXNlckJ1Y2tldCcsIHtcbiAgICAgIGJ1Y2tldCxcbiAgICAgIHppcEZpbGU6ICdTaWduSW5Db2duaXRvVXNlci56aXAnXG4gICAgfSk7XG5cbiAgICBuZXcgQ2hhdEFwcEZ1bmN0aW9uKHRoaXMsICdWZXJpZnlCdWNrZXQnLCB7XG4gICAgICBidWNrZXQsXG4gICAgICB6aXBGaWxlOiAnVmVyaWZ5Q29nbml0b1NpZ25Jbi56aXAnXG4gICAgfSk7XG5cbiAgICBuZXcgQ2hhdEFwcEZ1bmN0aW9uKHRoaXMsICdTdGFydENoYW5nZUJ1Y2tldCcsIHtcbiAgICAgIGJ1Y2tldCxcbiAgICAgIHppcEZpbGU6ICdTdGFydENoYW5naW5nRm9yZ290dGVuQ29nbml0b1VzZXJQYXNzd29yZC56aXAnXG4gICAgfSk7XG5cbiAgICBuZXcgQ2hhdEFwcEZ1bmN0aW9uKHRoaXMsICdGaW5pc2hDaGFuZ2VCdWNrZXQnLCB7XG4gICAgICBidWNrZXQsXG4gICAgICB6aXBGaWxlOiAnRmluaXNoQ2hhbmdpbmdGb3Jnb3R0ZW5Db2duaXRvVXNlclBhc3N3b3JkLnppcCdcbiAgICB9KTtcblxuICAgIG5ldyBDaGF0QXBwRnVuY3Rpb24odGhpcywgJ0dldFBvc3RzQnVja2V0Jywge1xuICAgICAgYnVja2V0LFxuICAgICAgemlwRmlsZTogJ0dldFBvc3RzLnppcCdcbiAgICB9KTtcblxuICAgIG5ldyBDaGF0QXBwRnVuY3Rpb24odGhpcywgJ0FkZFBvc3RCdWNrZXQnLCB7XG4gICAgICBidWNrZXQsXG4gICAgICB6aXBGaWxlOiAnQWRkUG9zdC56aXAnXG4gICAgfSk7XG5cbiAgICBuZXcgQ2hhdEFwcEZ1bmN0aW9uKHRoaXMsICdEZWxldGVQb3N0QnVja2V0Jywge1xuICAgICAgYnVja2V0LFxuICAgICAgemlwRmlsZTogJ0RlbGV0ZVBvc3QuemlwJ1xuICAgIH0pO1xuXG4gICAgbmV3IENoYXRBcHBGdW5jdGlvbih0aGlzLCAnRGVsZXRlVXNlckJ1Y2tldCcsIHtcbiAgICAgIGJ1Y2tldCxcbiAgICAgIHppcEZpbGU6ICdEZWxldGVDb2duaXRvVXNlci56aXAnXG4gICAgfSk7XG4gIH1cbn1cblxuaW50ZXJmYWNlIENoYXRBcHBGdW5jUHJvcHMge1xuICBidWNrZXQ6IHMzLkJ1Y2tldFJlZjtcbiAgemlwRmlsZTogc3RyaW5nO1xufVxuXG4vKlxuICogRXh0ZW5kIEZ1bmN0aW9uIGFzIGFsbCBvZiB0aGUgQ2hhdCBhcHAgZnVuY3Rpb25zIGhhdmUgdGhlc2UgY29tbW9uIHByb3BzLlxuICovXG5jbGFzcyBDaGF0QXBwRnVuY3Rpb24gZXh0ZW5kcyBsYW1iZGEuRnVuY3Rpb24ge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IGNkay5Db25zdHJ1Y3QsIG5hbWU6IHN0cmluZywgcHJvcHM6IENoYXRBcHBGdW5jUHJvcHMpIHtcbiAgICBzdXBlcihwYXJlbnQsIG5hbWUsIHtcbiAgICAgIGNvZGU6IG5ldyBsYW1iZGEuUzNDb2RlKHByb3BzLmJ1Y2tldCwgcHJvcHMuemlwRmlsZSksXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5Ob2RlSlM2MTAsXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcidcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG4vLyBBZGQgdGhlIHN0YWNrIHRvIHRoZSBhcHBcbi8vIChhcHBzIGNhbiBob3N0IG1hbnkgc3RhY2tzLCBmb3IgZXhhbXBsZSwgb25lIGZvciBlYWNoIHJlZ2lvbilcbm5ldyBNeVN0YWNrKGFwcCwgJ0NoYXRBcHBTdGFjaycsIHsgZW52OiB7IHJlZ2lvbjogJ3VzLXdlc3QtMicgfSB9KTtcblxuYXBwLnJ1bigpO1xuIl19