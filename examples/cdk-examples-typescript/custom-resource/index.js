"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_cloudformation_1 = require("@aws-cdk/aws-cloudformation");
const lambda = require("@aws-cdk/aws-lambda");
const aws_s3_1 = require("@aws-cdk/aws-s3");
const cdk = require("@aws-cdk/cdk");
const fs = require("fs");
class DemoResource extends cdk.Construct {
    constructor(parent, name, props) {
        super(parent, name);
        const resource = new aws_cloudformation_1.CustomResource(this, 'Resource', {
            lambdaProvider: new lambda.SingletonFunction(this, 'Singleton', {
                uuid: 'f7d4f730-4ee1-11e8-9c2d-fa7ae01bbebc',
                // This makes the demo only work as top-level TypeScript program, but that's fine for now
                code: lambda.Code.inline(fs.readFileSync('provider.py', { encoding: 'utf-8' })),
                handler: 'index.main',
                timeout: 300,
                runtime: lambda.Runtime.Python27,
            }),
            properties: props
        });
        this.response = resource.getAtt('Response').toString();
        this.dependencyElements = [resource];
    }
}
/**
 * A stack that only sets up the CustomResource and shows how to get an attribute from it
 */
class SucceedingStack extends cdk.Stack {
    constructor(parent, name, props) {
        super(parent, name, props);
        const resource = new DemoResource(this, 'DemoResource', {
            message: 'CustomResource says hello',
        });
        // Publish the custom resource output
        new cdk.Output(this, 'ResponseMessage', {
            description: 'The message that came back from the Custom Resource',
            value: resource.response
        });
    }
}
/**
 * A stack that sets up a failing CustomResource creation
 */
class FailCreationStack extends cdk.Stack {
    constructor(parent, name, props) {
        super(parent, name, props);
        new DemoResource(this, 'DemoResource', {
            message: 'CustomResource is silent',
            failCreate: true
        });
    }
}
/**
 * A stack that sets up the CustomResource and fails afterwards, to check that cleanup gets
 * done properly.
 */
class FailAfterCreatingStack extends cdk.Stack {
    constructor(parent, name, props) {
        super(parent, name, props);
        const resource = new DemoResource(this, 'DemoResource', {
            message: 'CustomResource says hello',
        });
        // Bucket with an invalid name will fail the deployment and cause a rollback
        const bucket = new aws_s3_1.cloudformation.BucketResource(this, 'FailingBucket', {
            bucketName: 'hello!@#$^'
        });
        // Make sure the rollback gets triggered only after the custom resource has been fully created.
        bucket.addDependency(resource);
    }
}
const app = new cdk.App();
new SucceedingStack(app, 'SucceedingStack');
new FailCreationStack(app, 'FailCreationStack');
new FailAfterCreatingStack(app, 'FailAfterCreatingStack');
app.run();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9FQUE2RDtBQUM3RCw4Q0FBK0M7QUFDL0MsNENBQXVEO0FBQ3ZELG9DQUFxQztBQUNyQyx5QkFBMEI7QUFjMUIsTUFBTSxZQUFhLFNBQVEsR0FBRyxDQUFDLFNBQVM7SUFJdEMsWUFBWSxNQUFxQixFQUFFLElBQVksRUFBRSxLQUF3QjtRQUN2RSxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRXBCLE1BQU0sUUFBUSxHQUFHLElBQUksbUNBQWMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ3BELGNBQWMsRUFBRSxJQUFJLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFO2dCQUM5RCxJQUFJLEVBQUUsc0NBQXNDO2dCQUM1Qyx5RkFBeUY7Z0JBQ3pGLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO2dCQUMvRSxPQUFPLEVBQUUsWUFBWTtnQkFDckIsT0FBTyxFQUFFLEdBQUc7Z0JBQ1osT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUTthQUNqQyxDQUFDO1lBQ0YsVUFBVSxFQUFFLEtBQUs7U0FDbEIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3ZELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7Q0FDRjtBQUVEOztHQUVHO0FBQ0gsTUFBTSxlQUFnQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ3JDLFlBQVksTUFBZSxFQUFFLElBQVksRUFBRSxLQUFzQjtRQUMvRCxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUUzQixNQUFNLFFBQVEsR0FBRyxJQUFJLFlBQVksQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ3RELE9BQU8sRUFBRSwyQkFBMkI7U0FDckMsQ0FBQyxDQUFDO1FBRUgscUNBQXFDO1FBQ3JDLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUU7WUFDdEMsV0FBVyxFQUFFLHFEQUFxRDtZQUNsRSxLQUFLLEVBQUUsUUFBUSxDQUFDLFFBQVE7U0FDekIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQ7O0dBRUc7QUFDSCxNQUFNLGlCQUFrQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ3ZDLFlBQVksTUFBZSxFQUFFLElBQVksRUFBRSxLQUFzQjtRQUMvRCxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUUzQixJQUFJLFlBQVksQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ3JDLE9BQU8sRUFBRSwwQkFBMEI7WUFDbkMsVUFBVSxFQUFFLElBQUk7U0FDakIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQ7OztHQUdHO0FBQ0gsTUFBTSxzQkFBdUIsU0FBUSxHQUFHLENBQUMsS0FBSztJQUM1QyxZQUFZLE1BQWUsRUFBRSxJQUFZLEVBQUUsS0FBc0I7UUFDL0QsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFM0IsTUFBTSxRQUFRLEdBQUcsSUFBSSxZQUFZLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUN0RCxPQUFPLEVBQUUsMkJBQTJCO1NBQ3JDLENBQUMsQ0FBQztRQUVILDRFQUE0RTtRQUM1RSxNQUFNLE1BQU0sR0FBRyxJQUFJLHVCQUFFLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7WUFDMUQsVUFBVSxFQUFFLFlBQVk7U0FDekIsQ0FBQyxDQUFDO1FBRUgsK0ZBQStGO1FBQy9GLE1BQU0sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDakMsQ0FBQztDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsSUFBSSxlQUFlLENBQUMsR0FBRyxFQUFFLGlCQUFpQixDQUFDLENBQUM7QUFDNUMsSUFBSSxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztBQUNoRCxJQUFJLHNCQUFzQixDQUFDLEdBQUcsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO0FBRTFELEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEN1c3RvbVJlc291cmNlIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWNsb3VkZm9ybWF0aW9uJztcbmltcG9ydCBsYW1iZGEgPSByZXF1aXJlKCdAYXdzLWNkay9hd3MtbGFtYmRhJyk7XG5pbXBvcnQgeyBjbG91ZGZvcm1hdGlvbiBhcyBzMyB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5pbXBvcnQgY2RrID0gcmVxdWlyZSgnQGF3cy1jZGsvY2RrJyk7XG5pbXBvcnQgZnMgPSByZXF1aXJlKCdmcycpO1xuXG5pbnRlcmZhY2UgRGVtb1Jlc291cmNlUHJvcHMge1xuICAvKipcbiAgICogTWVzc2FnZSB0byBlY2hvXG4gICAqL1xuICBtZXNzYWdlOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFNldCB0aGlzIHRvIHRydWUgdG8gZmFpbCB0aGUgQ1JFQVRFIGludm9jYXRpb25cbiAgICovXG4gIGZhaWxDcmVhdGU/OiBib29sZWFuO1xufVxuXG5jbGFzcyBEZW1vUmVzb3VyY2UgZXh0ZW5kcyBjZGsuQ29uc3RydWN0IGltcGxlbWVudHMgY2RrLklEZXBlbmRhYmxlIHtcbiAgcHVibGljIHJlYWRvbmx5IGRlcGVuZGVuY3lFbGVtZW50czogY2RrLklEZXBlbmRhYmxlW107XG4gIHB1YmxpYyByZWFkb25seSByZXNwb25zZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHBhcmVudDogY2RrLkNvbnN0cnVjdCwgbmFtZTogc3RyaW5nLCBwcm9wczogRGVtb1Jlc291cmNlUHJvcHMpIHtcbiAgICBzdXBlcihwYXJlbnQsIG5hbWUpO1xuXG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQ3VzdG9tUmVzb3VyY2UodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgbGFtYmRhUHJvdmlkZXI6IG5ldyBsYW1iZGEuU2luZ2xldG9uRnVuY3Rpb24odGhpcywgJ1NpbmdsZXRvbicsIHtcbiAgICAgICAgdXVpZDogJ2Y3ZDRmNzMwLTRlZTEtMTFlOC05YzJkLWZhN2FlMDFiYmViYycsXG4gICAgICAgIC8vIFRoaXMgbWFrZXMgdGhlIGRlbW8gb25seSB3b3JrIGFzIHRvcC1sZXZlbCBUeXBlU2NyaXB0IHByb2dyYW0sIGJ1dCB0aGF0J3MgZmluZSBmb3Igbm93XG4gICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmlubGluZShmcy5yZWFkRmlsZVN5bmMoJ3Byb3ZpZGVyLnB5JywgeyBlbmNvZGluZzogJ3V0Zi04JyB9KSksXG4gICAgICAgIGhhbmRsZXI6ICdpbmRleC5tYWluJyxcbiAgICAgICAgdGltZW91dDogMzAwLFxuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5QeXRob24yNyxcbiAgICAgIH0pLFxuICAgICAgcHJvcGVydGllczogcHJvcHNcbiAgICB9KTtcblxuICAgIHRoaXMucmVzcG9uc2UgPSByZXNvdXJjZS5nZXRBdHQoJ1Jlc3BvbnNlJykudG9TdHJpbmcoKTtcbiAgICB0aGlzLmRlcGVuZGVuY3lFbGVtZW50cyA9IFtyZXNvdXJjZV07XG4gIH1cbn1cblxuLyoqXG4gKiBBIHN0YWNrIHRoYXQgb25seSBzZXRzIHVwIHRoZSBDdXN0b21SZXNvdXJjZSBhbmQgc2hvd3MgaG93IHRvIGdldCBhbiBhdHRyaWJ1dGUgZnJvbSBpdFxuICovXG5jbGFzcyBTdWNjZWVkaW5nU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IGNkay5BcHAsIG5hbWU6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHBhcmVudCwgbmFtZSwgcHJvcHMpO1xuXG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgRGVtb1Jlc291cmNlKHRoaXMsICdEZW1vUmVzb3VyY2UnLCB7XG4gICAgICBtZXNzYWdlOiAnQ3VzdG9tUmVzb3VyY2Ugc2F5cyBoZWxsbycsXG4gICAgfSk7XG5cbiAgICAvLyBQdWJsaXNoIHRoZSBjdXN0b20gcmVzb3VyY2Ugb3V0cHV0XG4gICAgbmV3IGNkay5PdXRwdXQodGhpcywgJ1Jlc3BvbnNlTWVzc2FnZScsIHtcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIG1lc3NhZ2UgdGhhdCBjYW1lIGJhY2sgZnJvbSB0aGUgQ3VzdG9tIFJlc291cmNlJyxcbiAgICAgIHZhbHVlOiByZXNvdXJjZS5yZXNwb25zZVxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogQSBzdGFjayB0aGF0IHNldHMgdXAgYSBmYWlsaW5nIEN1c3RvbVJlc291cmNlIGNyZWF0aW9uXG4gKi9cbmNsYXNzIEZhaWxDcmVhdGlvblN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3IocGFyZW50OiBjZGsuQXBwLCBuYW1lOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihwYXJlbnQsIG5hbWUsIHByb3BzKTtcblxuICAgIG5ldyBEZW1vUmVzb3VyY2UodGhpcywgJ0RlbW9SZXNvdXJjZScsIHtcbiAgICAgIG1lc3NhZ2U6ICdDdXN0b21SZXNvdXJjZSBpcyBzaWxlbnQnLFxuICAgICAgZmFpbENyZWF0ZTogdHJ1ZVxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogQSBzdGFjayB0aGF0IHNldHMgdXAgdGhlIEN1c3RvbVJlc291cmNlIGFuZCBmYWlscyBhZnRlcndhcmRzLCB0byBjaGVjayB0aGF0IGNsZWFudXAgZ2V0c1xuICogZG9uZSBwcm9wZXJseS5cbiAqL1xuY2xhc3MgRmFpbEFmdGVyQ3JlYXRpbmdTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudDogY2RrLkFwcCwgbmFtZTogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIocGFyZW50LCBuYW1lLCBwcm9wcyk7XG5cbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBEZW1vUmVzb3VyY2UodGhpcywgJ0RlbW9SZXNvdXJjZScsIHtcbiAgICAgIG1lc3NhZ2U6ICdDdXN0b21SZXNvdXJjZSBzYXlzIGhlbGxvJyxcbiAgICB9KTtcblxuICAgIC8vIEJ1Y2tldCB3aXRoIGFuIGludmFsaWQgbmFtZSB3aWxsIGZhaWwgdGhlIGRlcGxveW1lbnQgYW5kIGNhdXNlIGEgcm9sbGJhY2tcbiAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0UmVzb3VyY2UodGhpcywgJ0ZhaWxpbmdCdWNrZXQnLCB7XG4gICAgICBidWNrZXROYW1lOiAnaGVsbG8hQCMkXidcbiAgICB9KTtcblxuICAgIC8vIE1ha2Ugc3VyZSB0aGUgcm9sbGJhY2sgZ2V0cyB0cmlnZ2VyZWQgb25seSBhZnRlciB0aGUgY3VzdG9tIHJlc291cmNlIGhhcyBiZWVuIGZ1bGx5IGNyZWF0ZWQuXG4gICAgYnVja2V0LmFkZERlcGVuZGVuY3kocmVzb3VyY2UpO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbm5ldyBTdWNjZWVkaW5nU3RhY2soYXBwLCAnU3VjY2VlZGluZ1N0YWNrJyk7XG5uZXcgRmFpbENyZWF0aW9uU3RhY2soYXBwLCAnRmFpbENyZWF0aW9uU3RhY2snKTtcbm5ldyBGYWlsQWZ0ZXJDcmVhdGluZ1N0YWNrKGFwcCwgJ0ZhaWxBZnRlckNyZWF0aW5nU3RhY2snKTtcblxuYXBwLnJ1bigpO1xuIl19