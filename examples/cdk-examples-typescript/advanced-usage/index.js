"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_cloudformation_1 = require("@aws-cdk/aws-cloudformation");
const ec2 = require("@aws-cdk/aws-ec2");
const iam = require("@aws-cdk/aws-iam");
const s3 = require("@aws-cdk/aws-s3");
const sns = require("@aws-cdk/aws-sns");
const sqs = require("@aws-cdk/aws-sqs");
const cdk = require("@aws-cdk/cdk");
/**
 * This stack demonstrates the use of the IAM policy library shipped with the CDK.
 */
class PolicyExample extends cdk.Stack {
    constructor(parent, name, props) {
        super(parent, name, props);
        // here's how to create an IAM Role with an assume policy for the Lambda
        // service principal.
        const role = new iam.Role(this, 'Role', {
            assumedBy: new iam.ServicePrincipal('lambda.amazon.aws.com')
        });
        // when you call `addToPolicy`, a default policy is defined and attached
        // to the bucket.
        const bucket = new s3.Bucket(this, 'MyBucket');
        // the role also has a policy attached to it.
        role.addToPolicy(new iam.PolicyStatement()
            .addResource(bucket.arnForObjects('*'))
            .addResource(bucket.bucketArn)
            .addActions('s3:*'));
    }
}
/**
 * This stack demonstrates the use of environmental context such as availablity zones
 * and SSM parameters. You will notice there are two instances of this stack in the app -
 * one in us-east-1 and one in eu-west-2. When you "cx synth" these stacks, you will see how
 * the AZ list and the AMI IDs are different.
 */
class EnvContextExample extends cdk.Stack {
    constructor(parent, name, props) {
        super(parent, name, props);
        // get the list of AZs for the current region/account
        const azs = new cdk.AvailabilityZoneProvider(this).availabilityZones;
        // get the AMI ID for a specific Windows version in this region
        const ami = new ec2.WindowsImage(ec2.WindowsVersion.WindowsServer2016EnglishNanoBase).getImage(this);
        for (const az of azs) {
            if (typeof (az) !== 'string') {
                continue;
            }
            // render construct name based on it's availablity zone
            const constructName = `InstanceFor${az.replace(/-/g, '').toUpperCase()}`;
            new ec2.cloudformation.InstanceResource(this, constructName, {
                imageId: ami.imageId,
                availabilityZone: az,
            });
        }
    }
}
/**
 * This stack shows how to use the Include construct to merge an existing CloudFormation template
 * into your CDK stack and then add constructs and resources programmatically to it.
 */
class IncludeExample extends cdk.Stack {
    constructor(parent, name, props) {
        super(parent, name, props);
        // so you have an existing template...
        // you can also load it from a file:
        //   const template = JSON.parse(fs.readFileSync('./my-template.json).toString());
        const template = {
            Resources: {
                IncludedQueue: {
                    Type: "AWS::SQS::Queue",
                    Properties: {
                        VisibilityTimeout: 300
                    }
                }
            }
        };
        // merge template as-is into the stack
        new cdk.Include(this, 'Include', { template });
        // add constructs (and resources) programmatically
        new EnvContextExample(parent, 'Example');
        new sqs.cloudformation.QueueResource(this, 'CDKQueue', {});
    }
}
class NestedStackExample extends cdk.Stack {
    constructor(parent, name, props) {
        super(parent, name, props);
        // pick up to 3 AZs from environment.
        const azs = new cdk.AvailabilityZoneProvider(this).availabilityZones.slice(0, 3);
        // add an "AWS::CloudFormation::Stack" resource which uses the MongoDB quickstart
        // https://aws.amazon.com/quickstart/architecture/mongodb/
        // only non-default values are provided here.
        new aws_cloudformation_1.cloudformation.StackResource(this, 'NestedStack', {
            templateUrl: 'https://s3.amazonaws.com/quickstart-reference/mongodb/latest/templates/mongodb-master.template',
            parameters: {
                KeyPairName: 'my-key-pair',
                RemoteAccessCIDR: '0.0.0.0/0',
                AvailabilityZones: azs.join(','),
                NumberOfAZs: azs.length.toString(),
                MongoDBAdminPassword: 'root1234',
            }
        });
    }
}
/**
 * Demonstrates how resources can be referenced using .ref and .<attribute>
 * It also demonstrates how to modify resource options such as metadata
 */
class ResourceReferencesExample extends cdk.Stack {
    constructor(parent, name, props) {
        super(parent, name, props);
        const topic = new sns.cloudformation.TopicResource(this, 'Topic', {});
        const queue = new sqs.cloudformation.QueueResource(this, 'Queue', {});
        new sns.cloudformation.SubscriptionResource(this, 'Subscription', {
            topicArn: topic.ref,
            protocol: 'sqs',
            endpoint: queue.queueArn // resolves to { "Fn::GetAtt": [ <queue-id>, "Arn" ] }
        });
        // resource.options can be used to set options on a resource construct
        queue.options.metadata = {
            MyKey: "MyValue"
        };
    }
}
/**
 * Demonstrates how to use CloudFormation parameters, outputs, pseudo parameters and intrinsic functions.
 */
class CloudFormationExample extends cdk.Stack {
    constructor(parent, name, props) {
        super(parent, name, props);
        // parameters are constructs that synthesize into the template's "Parameters" section
        const param = new cdk.Parameter(this, 'MyTemplateParameter', {
            type: 'String',
            default: 'HelloWorld'
        });
        // outputs are constructs the synthesize into the template's "Outputs" section
        new cdk.Output(this, 'Output', {
            description: 'This is an output of the template',
            value: new cdk.FnConcat(new cdk.AwsAccountId(), '/', param.ref)
        });
        // stack.templateOptions can be used to specify template-level options
        this.templateOptions.description = 'This goes into the "Description" attribute of the template';
        this.templateOptions.metadata = {
            // all CloudFormation's pseudo-parameters are supported via the `cdk.AwsXxx` classes
            PseudoParameters: [
                new cdk.AwsAccountId(),
                new cdk.AwsDomainSuffix(),
                new cdk.AwsNotificationARNs(),
                new cdk.AwsNoValue(),
                new cdk.AwsPartition(),
                new cdk.AwsRegion(),
                new cdk.AwsStackId(),
                new cdk.AwsStackName(),
            ],
            // all CloudFormation's intrinsic functions are supported via the `cdk.FnXxx` classes
            IntrinsicFunctions: [
                new cdk.FnAnd(new cdk.FnFindInMap('MyMap', 'K1', 'K2'), new cdk.FnSub('hello ${world}', {
                    world: new cdk.FnBase64(param.ref) // resolves to { Ref: <param-id> }
                }))
            ],
        };
    }
}
const app = new cdk.App();
new PolicyExample(app, 'PolicyExample');
new IncludeExample(app, 'IncludeExample');
new NestedStackExample(app, 'NestedStackExample');
new ResourceReferencesExample(app, 'ResourceReferenceExample');
new CloudFormationExample(app, 'CloudFormationExample');
new EnvContextExample(app, 'EnvContextExampleNA', { env: { region: 'us-east-1' } });
new EnvContextExample(app, 'EnvContextExampleEU', { env: { region: 'eu-west-2' } });
app.run();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9FQUE2RDtBQUM3RCx3Q0FBeUM7QUFDekMsd0NBQXlDO0FBQ3pDLHNDQUF1QztBQUN2Qyx3Q0FBeUM7QUFDekMsd0NBQXlDO0FBQ3pDLG9DQUFxQztBQUVyQzs7R0FFRztBQUNILE1BQU0sYUFBYyxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ25DLFlBQVksTUFBZSxFQUFFLElBQVksRUFBRSxLQUFzQjtRQUMvRCxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUUzQix3RUFBd0U7UUFDeEUscUJBQXFCO1FBQ3JCLE1BQU0sSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFO1lBQ3RDLFNBQVMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyx1QkFBdUIsQ0FBQztTQUM3RCxDQUFDLENBQUM7UUFFSCx3RUFBd0U7UUFDeEUsaUJBQWlCO1FBQ2pCLE1BQU0sTUFBTSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFFL0MsNkNBQTZDO1FBQzdDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLENBQUMsZUFBZSxFQUFFO2FBQ3ZDLFdBQVcsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3RDLFdBQVcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO2FBQzdCLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7Q0FDRjtBQUVEOzs7OztHQUtHO0FBQ0gsTUFBTSxpQkFBa0IsU0FBUSxHQUFHLENBQUMsS0FBSztJQUN2QyxZQUFZLE1BQWUsRUFBRSxJQUFZLEVBQUUsS0FBc0I7UUFDL0QsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJ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QUFDO0FBQzFDLElBQUksa0JBQWtCLENBQUMsR0FBRyxFQUFFLG9CQUFvQixDQUFDLENBQUM7QUFDbEQsSUFBSSx5QkFBeUIsQ0FBQyxHQUFHLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztBQUMvRCxJQUFJLHFCQUFxQixDQUFDLEdBQUcsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO0FBRXhELElBQUksaUJBQWlCLENBQUMsR0FBRyxFQUFFLHFCQUFxQixFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxFQUFDLENBQUMsQ0FBQztBQUNuRixJQUFJLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxxQkFBcUIsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsRUFBQyxDQUFDLENBQUM7QUFFbkYsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2xvdWRmb3JtYXRpb24gfSBmcm9tICdAYXdzLWNkay9hd3MtY2xvdWRmb3JtYXRpb24nO1xuaW1wb3J0IGVjMiA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2F3cy1lYzInKTtcbmltcG9ydCBpYW0gPSByZXF1aXJlKCdAYXdzLWNkay9hd3MtaWFtJyk7XG5pbXBvcnQgczMgPSByZXF1aXJlKCdAYXdzLWNkay9hd3MtczMnKTtcbmltcG9ydCBzbnMgPSByZXF1aXJlKCdAYXdzLWNkay9hd3Mtc25zJyk7XG5pbXBvcnQgc3FzID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLXNxcycpO1xuaW1wb3J0IGNkayA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2NkaycpO1xuXG4vKipcbiAqIFRoaXMgc3RhY2sgZGVtb25zdHJhdGVzIHRoZSB1c2Ugb2YgdGhlIElBTSBwb2xpY3kgbGlicmFyeSBzaGlwcGVkIHdpdGggdGhlIENESy5cbiAqL1xuY2xhc3MgUG9saWN5RXhhbXBsZSBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudDogY2RrLkFwcCwgbmFtZTogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIocGFyZW50LCBuYW1lLCBwcm9wcyk7XG5cbiAgICAvLyBoZXJlJ3MgaG93IHRvIGNyZWF0ZSBhbiBJQU0gUm9sZSB3aXRoIGFuIGFzc3VtZSBwb2xpY3kgZm9yIHRoZSBMYW1iZGFcbiAgICAvLyBzZXJ2aWNlIHByaW5jaXBhbC5cbiAgICBjb25zdCByb2xlID0gbmV3IGlhbS5Sb2xlKHRoaXMsICdSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2xhbWJkYS5hbWF6b24uYXdzLmNvbScpXG4gICAgfSk7XG5cbiAgICAvLyB3aGVuIHlvdSBjYWxsIGBhZGRUb1BvbGljeWAsIGEgZGVmYXVsdCBwb2xpY3kgaXMgZGVmaW5lZCBhbmQgYXR0YWNoZWRcbiAgICAvLyB0byB0aGUgYnVja2V0LlxuICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgJ015QnVja2V0Jyk7XG5cbiAgICAvLyB0aGUgcm9sZSBhbHNvIGhhcyBhIHBvbGljeSBhdHRhY2hlZCB0byBpdC5cbiAgICByb2xlLmFkZFRvUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KClcbiAgICAgIC5hZGRSZXNvdXJjZShidWNrZXQuYXJuRm9yT2JqZWN0cygnKicpKVxuICAgICAgLmFkZFJlc291cmNlKGJ1Y2tldC5idWNrZXRBcm4pXG4gICAgICAuYWRkQWN0aW9ucygnczM6KicpKTtcbiAgfVxufVxuXG4vKipcbiAqIFRoaXMgc3RhY2sgZGVtb25zdHJhdGVzIHRoZSB1c2Ugb2YgZW52aXJvbm1lbnRhbCBjb250ZXh0IHN1Y2ggYXMgYXZhaWxhYmxpdHkgem9uZXNcbiAqIGFuZCBTU00gcGFyYW1ldGVycy4gWW91IHdpbGwgbm90aWNlIHRoZXJlIGFyZSB0d28gaW5zdGFuY2VzIG9mIHRoaXMgc3RhY2sgaW4gdGhlIGFwcCAtXG4gKiBvbmUgaW4gdXMtZWFzdC0xIGFuZCBvbmUgaW4gZXUtd2VzdC0yLiBXaGVuIHlvdSBcImN4IHN5bnRoXCIgdGhlc2Ugc3RhY2tzLCB5b3Ugd2lsbCBzZWUgaG93XG4gKiB0aGUgQVogbGlzdCBhbmQgdGhlIEFNSSBJRHMgYXJlIGRpZmZlcmVudC5cbiAqL1xuY2xhc3MgRW52Q29udGV4dEV4YW1wbGUgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IGNkay5BcHAsIG5hbWU6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHBhcmVudCwgbmFtZSwgcHJvcHMpO1xuXG4gICAgLy8gZ2V0IHRoZSBsaXN0IG9mIEFacyBmb3IgdGhlIGN1cnJlbnQgcmVnaW9uL2FjY291bnRcbiAgICBjb25zdCBhenMgPSBuZXcgY2RrLkF2YWlsYWJpbGl0eVpvbmVQcm92aWRlcih0aGlzKS5hdmFpbGFiaWxpdHlab25lcztcblxuICAgIC8vIGdldCB0aGUgQU1JIElEIGZvciBhIHNwZWNpZmljIFdpbmRvd3MgdmVyc2lvbiBpbiB0aGlzIHJlZ2lvblxuICAgIGNvbnN0IGFtaSA9IG5ldyBlYzIuV2luZG93c0ltYWdlKGVjMi5XaW5kb3dzVmVyc2lvbi5XaW5kb3dzU2VydmVyMjAxNkVuZ2xpc2hOYW5vQmFzZSkuZ2V0SW1hZ2UodGhpcyk7XG5cbiAgICBmb3IgKGNvbnN0IGF6IG9mIGF6cykge1xuICAgICAgaWYgKHR5cGVvZihheikgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyByZW5kZXIgY29uc3RydWN0IG5hbWUgYmFzZWQgb24gaXQncyBhdmFpbGFibGl0eSB6b25lXG4gICAgICBjb25zdCBjb25zdHJ1Y3ROYW1lID0gYEluc3RhbmNlRm9yJHthei5yZXBsYWNlKC8tL2csICcnKS50b1VwcGVyQ2FzZSgpfWA7XG5cbiAgICAgIG5ldyBlYzIuY2xvdWRmb3JtYXRpb24uSW5zdGFuY2VSZXNvdXJjZSh0aGlzLCBjb25zdHJ1Y3ROYW1lLCB7XG4gICAgICAgIGltYWdlSWQ6IGFtaS5pbWFnZUlkLFxuICAgICAgICBhdmFpbGFiaWxpdHlab25lOiBheixcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFRoaXMgc3RhY2sgc2hvd3MgaG93IHRvIHVzZSB0aGUgSW5jbHVkZSBjb25zdHJ1Y3QgdG8gbWVyZ2UgYW4gZXhpc3RpbmcgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGVcbiAqIGludG8geW91ciBDREsgc3RhY2sgYW5kIHRoZW4gYWRkIGNvbnN0cnVjdHMgYW5kIHJlc291cmNlcyBwcm9ncmFtbWF0aWNhbGx5IHRvIGl0LlxuICovXG5jbGFzcyBJbmNsdWRlRXhhbXBsZSBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudDogY2RrLkFwcCwgbmFtZTogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIocGFyZW50LCBuYW1lLCBwcm9wcyk7XG5cbiAgICAvLyBzbyB5b3UgaGF2ZSBhbiBleGlzdGluZyB0ZW1wbGF0ZS4uLlxuICAgIC8vIHlvdSBjYW4gYWxzbyBsb2FkIGl0IGZyb20gYSBmaWxlOlxuICAgIC8vICAgY29uc3QgdGVtcGxhdGUgPSBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYygnLi9teS10ZW1wbGF0ZS5qc29uKS50b1N0cmluZygpKTtcbiAgICBjb25zdCB0ZW1wbGF0ZSA9IHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBJbmNsdWRlZFF1ZXVlOiB7XG4gICAgICAgICAgVHlwZTogXCJBV1M6OlNRUzo6UXVldWVcIixcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBWaXNpYmlsaXR5VGltZW91dDogMzAwXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIG1lcmdlIHRlbXBsYXRlIGFzLWlzIGludG8gdGhlIHN0YWNrXG4gICAgbmV3IGNkay5JbmNsdWRlKHRoaXMsICdJbmNsdWRlJywgeyB0ZW1wbGF0ZSB9KTtcblxuICAgIC8vIGFkZCBjb25zdHJ1Y3RzIChhbmQgcmVzb3VyY2VzKSBwcm9ncmFtbWF0aWNhbGx5XG4gICAgbmV3IEVudkNvbnRleHRFeGFtcGxlKHBhcmVudCwgJ0V4YW1wbGUnKTtcbiAgICBuZXcgc3FzLmNsb3VkZm9ybWF0aW9uLlF1ZXVlUmVzb3VyY2UodGhpcywgJ0NES1F1ZXVlJywge30pO1xuICB9XG59XG5cbmNsYXNzIE5lc3RlZFN0YWNrRXhhbXBsZSBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudDogY2RrLkFwcCwgbmFtZTogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIocGFyZW50LCBuYW1lLCBwcm9wcyk7XG5cbiAgICAvLyBwaWNrIHVwIHRvIDMgQVpzIGZyb20gZW52aXJvbm1lbnQuXG4gICAgY29uc3QgYXpzID0gbmV3IGNkay5BdmFpbGFiaWxpdHlab25lUHJvdmlkZXIodGhpcykuYXZhaWxhYmlsaXR5Wm9uZXMuc2xpY2UoMCwgMyk7XG5cbiAgICAvLyBhZGQgYW4gXCJBV1M6OkNsb3VkRm9ybWF0aW9uOjpTdGFja1wiIHJlc291cmNlIHdoaWNoIHVzZXMgdGhlIE1vbmdvREIgcXVpY2tzdGFydFxuICAgIC8vIGh0dHBzOi8vYXdzLmFtYXpvbi5jb20vcXVpY2tzdGFydC9hcmNoaXRlY3R1cmUvbW9uZ29kYi9cbiAgICAvLyBvbmx5IG5vbi1kZWZhdWx0IHZhbHVlcyBhcmUgcHJvdmlkZWQgaGVyZS5cbiAgICBuZXcgY2xvdWRmb3JtYXRpb24uU3RhY2tSZXNvdXJjZSh0aGlzLCAnTmVzdGVkU3RhY2snLCB7XG4gICAgICB0ZW1wbGF0ZVVybDogJ2h0dHBzOi8vczMuYW1hem9uYXdzLmNvbS9xdWlja3N0YXJ0LXJlZmVyZW5jZS9tb25nb2RiL2xhdGVzdC90ZW1wbGF0ZXMvbW9uZ29kYi1tYXN0ZXIudGVtcGxhdGUnLFxuICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICBLZXlQYWlyTmFtZTogJ215LWtleS1wYWlyJyxcbiAgICAgICAgUmVtb3RlQWNjZXNzQ0lEUjogJzAuMC4wLjAvMCcsXG4gICAgICAgIEF2YWlsYWJpbGl0eVpvbmVzOiBhenMuam9pbignLCcpLFxuICAgICAgICBOdW1iZXJPZkFaczogYXpzLmxlbmd0aC50b1N0cmluZygpLFxuICAgICAgICBNb25nb0RCQWRtaW5QYXNzd29yZDogJ3Jvb3QxMjM0JyxcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIERlbW9uc3RyYXRlcyBob3cgcmVzb3VyY2VzIGNhbiBiZSByZWZlcmVuY2VkIHVzaW5nIC5yZWYgYW5kIC48YXR0cmlidXRlPlxuICogSXQgYWxzbyBkZW1vbnN0cmF0ZXMgaG93IHRvIG1vZGlmeSByZXNvdXJjZSBvcHRpb25zIHN1Y2ggYXMgbWV0YWRhdGFcbiAqL1xuY2xhc3MgUmVzb3VyY2VSZWZlcmVuY2VzRXhhbXBsZSBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudDogY2RrLkFwcCwgbmFtZTogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIocGFyZW50LCBuYW1lLCBwcm9wcyk7XG5cbiAgICBjb25zdCB0b3BpYyA9IG5ldyBzbnMuY2xvdWRmb3JtYXRpb24uVG9waWNSZXNvdXJjZSh0aGlzLCAnVG9waWMnLCB7fSk7XG4gICAgY29uc3QgcXVldWUgPSBuZXcgc3FzLmNsb3VkZm9ybWF0aW9uLlF1ZXVlUmVzb3VyY2UodGhpcywgJ1F1ZXVlJywge30pO1xuXG4gICAgbmV3IHNucy5jbG91ZGZvcm1hdGlvbi5TdWJzY3JpcHRpb25SZXNvdXJjZSh0aGlzLCAnU3Vic2NyaXB0aW9uJywge1xuICAgICAgdG9waWNBcm46IHRvcGljLnJlZiwgLy8gcmVzb2x2ZXMgdG8geyBSZWY6IDx0b3BpYy1pZD4gfVxuICAgICAgcHJvdG9jb2w6ICdzcXMnLFxuICAgICAgZW5kcG9pbnQ6IHF1ZXVlLnF1ZXVlQXJuIC8vIHJlc29sdmVzIHRvIHsgXCJGbjo6R2V0QXR0XCI6IFsgPHF1ZXVlLWlkPiwgXCJBcm5cIiBdIH1cbiAgICB9KTtcblxuICAgIC8vIHJlc291cmNlLm9wdGlvbnMgY2FuIGJlIHVzZWQgdG8gc2V0IG9wdGlvbnMgb24gYSByZXNvdXJjZSBjb25zdHJ1Y3RcbiAgICBxdWV1ZS5vcHRpb25zLm1ldGFkYXRhID0ge1xuICAgICAgTXlLZXk6IFwiTXlWYWx1ZVwiXG4gICAgfTtcbiAgfVxufVxuXG4vKipcbiAqIERlbW9uc3RyYXRlcyBob3cgdG8gdXNlIENsb3VkRm9ybWF0aW9uIHBhcmFtZXRlcnMsIG91dHB1dHMsIHBzZXVkbyBwYXJhbWV0ZXJzIGFuZCBpbnRyaW5zaWMgZnVuY3Rpb25zLlxuICovXG5jbGFzcyBDbG91ZEZvcm1hdGlvbkV4YW1wbGUgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IGNkay5BcHAsIG5hbWU6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHBhcmVudCwgbmFtZSwgcHJvcHMpO1xuXG4gICAgLy8gcGFyYW1ldGVycyBhcmUgY29uc3RydWN0cyB0aGF0IHN5bnRoZXNpemUgaW50byB0aGUgdGVtcGxhdGUncyBcIlBhcmFtZXRlcnNcIiBzZWN0aW9uXG4gICAgY29uc3QgcGFyYW0gPSBuZXcgY2RrLlBhcmFtZXRlcih0aGlzLCAnTXlUZW1wbGF0ZVBhcmFtZXRlcicsIHtcbiAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJ0hlbGxvV29ybGQnXG4gICAgfSk7XG5cbiAgICAvLyBvdXRwdXRzIGFyZSBjb25zdHJ1Y3RzIHRoZSBzeW50aGVzaXplIGludG8gdGhlIHRlbXBsYXRlJ3MgXCJPdXRwdXRzXCIgc2VjdGlvblxuICAgIG5ldyBjZGsuT3V0cHV0KHRoaXMsICdPdXRwdXQnLCB7XG4gICAgICBkZXNjcmlwdGlvbjogJ1RoaXMgaXMgYW4gb3V0cHV0IG9mIHRoZSB0ZW1wbGF0ZScsXG4gICAgICB2YWx1ZTogbmV3IGNkay5GbkNvbmNhdChuZXcgY2RrLkF3c0FjY291bnRJZCgpLCAnLycsIHBhcmFtLnJlZilcbiAgICB9KTtcblxuICAgIC8vIHN0YWNrLnRlbXBsYXRlT3B0aW9ucyBjYW4gYmUgdXNlZCB0byBzcGVjaWZ5IHRlbXBsYXRlLWxldmVsIG9wdGlvbnNcbiAgICB0aGlzLnRlbXBsYXRlT3B0aW9ucy5kZXNjcmlwdGlvbiA9ICdUaGlzIGdvZXMgaW50byB0aGUgXCJEZXNjcmlwdGlvblwiIGF0dHJpYnV0ZSBvZiB0aGUgdGVtcGxhdGUnO1xuICAgIHRoaXMudGVtcGxhdGVPcHRpb25zLm1ldGFkYXRhID0ge1xuXG4gICAgICAvLyBhbGwgQ2xvdWRGb3JtYXRpb24ncyBwc2V1ZG8tcGFyYW1ldGVycyBhcmUgc3VwcG9ydGVkIHZpYSB0aGUgYGNkay5Bd3NYeHhgIGNsYXNzZXNcbiAgICAgIFBzZXVkb1BhcmFtZXRlcnM6IFtcbiAgICAgICAgbmV3IGNkay5Bd3NBY2NvdW50SWQoKSxcbiAgICAgICAgbmV3IGNkay5Bd3NEb21haW5TdWZmaXgoKSxcbiAgICAgICAgbmV3IGNkay5Bd3NOb3RpZmljYXRpb25BUk5zKCksXG4gICAgICAgIG5ldyBjZGsuQXdzTm9WYWx1ZSgpLFxuICAgICAgICBuZXcgY2RrLkF3c1BhcnRpdGlvbigpLFxuICAgICAgICBuZXcgY2RrLkF3c1JlZ2lvbigpLFxuICAgICAgICBuZXcgY2RrLkF3c1N0YWNrSWQoKSxcbiAgICAgICAgbmV3IGNkay5Bd3NTdGFja05hbWUoKSxcbiAgICAgIF0sXG5cbiAgICAgIC8vIGFsbCBDbG91ZEZvcm1hdGlvbidzIGludHJpbnNpYyBmdW5jdGlvbnMgYXJlIHN1cHBvcnRlZCB2aWEgdGhlIGBjZGsuRm5YeHhgIGNsYXNzZXNcbiAgICAgIEludHJpbnNpY0Z1bmN0aW9uczogW1xuICAgICAgICBuZXcgY2RrLkZuQW5kKFxuICAgICAgICAgIG5ldyBjZGsuRm5GaW5kSW5NYXAoJ015TWFwJywgJ0sxJywgJ0syJyksXG4gICAgICAgICAgbmV3IGNkay5GblN1YignaGVsbG8gJHt3b3JsZH0nLCB7XG4gICAgICAgICAgICB3b3JsZDogbmV3IGNkay5GbkJhc2U2NChwYXJhbS5yZWYpICAvLyByZXNvbHZlcyB0byB7IFJlZjogPHBhcmFtLWlkPiB9XG4gICAgICAgICAgfSkpXG4gICAgICBdLFxuICAgIH07XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxubmV3IFBvbGljeUV4YW1wbGUoYXBwLCAnUG9saWN5RXhhbXBsZScpO1xubmV3IEluY2x1ZGVFeGFtcGxlKGFwcCwgJ0luY2x1ZGVFeGFtcGxlJyk7XG5uZXcgTmVzdGVkU3RhY2tFeGFtcGxlKGFwcCwgJ05lc3RlZFN0YWNrRXhhbXBsZScpO1xubmV3IFJlc291cmNlUmVmZXJlbmNlc0V4YW1wbGUoYXBwLCAnUmVzb3VyY2VSZWZlcmVuY2VFeGFtcGxlJyk7XG5uZXcgQ2xvdWRGb3JtYXRpb25FeGFtcGxlKGFwcCwgJ0Nsb3VkRm9ybWF0aW9uRXhhbXBsZScpO1xuXG5uZXcgRW52Q29udGV4dEV4YW1wbGUoYXBwLCAnRW52Q29udGV4dEV4YW1wbGVOQScsIHsgZW52OiB7IHJlZ2lvbjogJ3VzLWVhc3QtMScgfX0pO1xubmV3IEVudkNvbnRleHRFeGFtcGxlKGFwcCwgJ0VudkNvbnRleHRFeGFtcGxlRVUnLCB7IGVudjogeyByZWdpb246ICdldS13ZXN0LTInIH19KTtcblxuYXBwLnJ1bigpO1xuIl19