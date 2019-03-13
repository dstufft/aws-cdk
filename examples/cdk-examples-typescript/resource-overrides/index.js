"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const autoscaling = require("@aws-cdk/aws-autoscaling");
const ec2 = require("@aws-cdk/aws-ec2");
const s3 = require("@aws-cdk/aws-s3");
const cdk = require("@aws-cdk/cdk");
const assert = require("assert");
class ResourceOverridesExample extends cdk.Stack {
    constructor(parent, id) {
        super(parent, id);
        const otherBucket = new s3.Bucket(this, 'Other');
        const bucket = new s3.Bucket(this, 'MyBucket', {
            versioned: true,
            encryption: s3.BucketEncryption.KmsManaged
        });
        const bucketResource2 = bucket.findChild('Resource');
        bucketResource2.addPropertyOverride('BucketEncryption.ServerSideEncryptionConfiguration.0.EncryptEverythingAndAlways', true);
        bucketResource2.addPropertyDeletionOverride('BucketEncryption.ServerSideEncryptionConfiguration.0.ServerSideEncryptionByDefault');
        return;
        //
        // Accessing the L1 bucket resource from an L2 bucket
        //
        const bucketResource = bucket.findChild('Resource');
        const anotherWay = bucket.children.find(c => c.resourceType === 'AWS::S3::Bucket');
        assert.equal(bucketResource, anotherWay);
        //
        // This is how to specify resource options such as dependencies, metadata, update policy
        //
        bucketResource.addDependency(otherBucket.findChild('Resource'));
        bucketResource.options.metadata = { MetadataKey: 'MetadataValue' };
        bucketResource.options.updatePolicy = {
            autoScalingRollingUpdate: {
                pauseTime: '390'
            }
        };
        //
        // This is how to specify "raw" overrides at the __resource__ level
        //
        bucketResource.addOverride('Type', 'AWS::S3::Bucketeer'); // even "Type" can be overridden
        bucketResource.addOverride('Transform', 'Boom');
        bucketResource.addOverride('Properties.CorsConfiguration', {
            Custom: 123,
            Bar: ['A', 'B']
        });
        // addPropertyOverrides simply allows you to omit the "Properties." prefix
        bucketResource.addPropertyOverride('VersioningConfiguration.Status', 'NewStatus');
        bucketResource.addPropertyOverride('Foo', null);
        bucketResource.addPropertyOverride('Token', otherBucket.bucketArn); // use tokens
        bucketResource.addPropertyOverride('LoggingConfiguration.DestinationBucketName', otherBucket.bucketName);
        //
        // It is also possible to request a deletion of a value by either assigning
        // `undefined` (in supported languages) or use the `addDeletionOverride` method
        //
        bucketResource.addDeletionOverride('Metadata');
        bucketResource.addPropertyDeletionOverride('CorsConfiguration.Bar');
        //
        // It is also possible to specify overrides via a strong-typed property
        // bag called `propertyOverrides`
        //
        bucketResource.propertyOverrides.analyticsConfigurations = [
            {
                id: 'config1',
                storageClassAnalysis: {
                    dataExport: {
                        outputSchemaVersion: '1',
                        destination: {
                            format: 'html',
                            bucketArn: otherBucket.bucketArn // use tokens freely
                        }
                    }
                }
            }
        ];
        bucketResource.propertyOverrides.corsConfiguration = {
            corsRules: [
                {
                    allowedMethods: ['GET'],
                    allowedOrigins: ['*']
                }
            ]
        };
        const vpc = new ec2.VpcNetwork(this, 'VPC', { maxAZs: 1 });
        const asg = new autoscaling.AutoScalingGroup(this, 'ASG', {
            instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.M4, ec2.InstanceSize.XLarge),
            machineImage: new ec2.AmazonLinuxImage(),
            vpc
        });
        //
        // The default child resource is called `Resource`, but secondary resources, such as
        // an Auto Scaling Group's launch configuration might have a different ID. You will likely
        // need to consule the codebase or use the `.map.find` method above
        //
        const lc = asg.findChild('LaunchConfig');
        lc.addPropertyOverride('Foo.Bar', 'Hello');
    }
}
const app = new cdk.App();
new ResourceOverridesExample(app, 'resource-overrides');
app.run();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHdEQUF5RDtBQUN6RCx3Q0FBeUM7QUFDekMsc0NBQXVDO0FBQ3ZDLG9DQUFxQztBQUNyQyxpQ0FBa0M7QUFFbEMsTUFBTSx3QkFBeUIsU0FBUSxHQUFHLENBQUMsS0FBSztJQUM1QyxZQUFZLE1BQWUsRUFBRSxFQUFVO1FBQ25DLEtBQUssQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFbEIsTUFBTSxXQUFXLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUVqRCxNQUFNLE1BQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUMzQyxTQUFTLEVBQUUsSUFBSTtZQUNmLFVBQVUsRUFBRSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsVUFBVTtTQUM3QyxDQUFDLENBQUM7UUFFSCxNQUFNLGVBQWUsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBcUMsQ0FBQztRQUN6RixlQUFlLENBQUMsbUJBQW1CLENBQUMsaUZBQWlGLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDN0gsZUFBZSxDQUFDLDJCQUEyQixDQUFDLG9GQUFvRixDQUFDLENBQUM7UUFFbEksT0FBTztRQUVQLEVBQUU7UUFDRixxREFBcUQ7UUFDckQsRUFBRTtRQUVGLE1BQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFxQyxDQUFDO1FBQ3hGLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUUsQ0FBa0IsQ0FBQyxZQUFZLEtBQUssaUJBQWlCLENBQXFDLENBQUM7UUFDekksTUFBTSxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFF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bkcsRUFBRSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMvQyxDQUFDO0NBQ0o7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixJQUFJLHdCQUF3QixDQUFDLEdBQUcsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0FBQ3hELEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBhdXRvc2NhbGluZyA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2F3cy1hdXRvc2NhbGluZycpO1xuaW1wb3J0IGVjMiA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2F3cy1lYzInKTtcbmltcG9ydCBzMyA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2F3cy1zMycpO1xuaW1wb3J0IGNkayA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2NkaycpO1xuaW1wb3J0IGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpO1xuXG5jbGFzcyBSZXNvdXJjZU92ZXJyaWRlc0V4YW1wbGUgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICAgIGNvbnN0cnVjdG9yKHBhcmVudDogY2RrLkFwcCwgaWQ6IHN0cmluZykge1xuICAgICAgICBzdXBlcihwYXJlbnQsIGlkKTtcblxuICAgICAgICBjb25zdCBvdGhlckJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgJ090aGVyJyk7XG5cbiAgICAgICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCAnTXlCdWNrZXQnLCB7XG4gICAgICAgICAgICB2ZXJzaW9uZWQ6IHRydWUsXG4gICAgICAgICAgICBlbmNyeXB0aW9uOiBzMy5CdWNrZXRFbmNyeXB0aW9uLkttc01hbmFnZWRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgYnVja2V0UmVzb3VyY2UyID0gYnVja2V0LmZpbmRDaGlsZCgnUmVzb3VyY2UnKSBhcyBzMy5jbG91ZGZvcm1hdGlvbi5CdWNrZXRSZXNvdXJjZTtcbiAgICAgICAgYnVja2V0UmVzb3VyY2UyLmFkZFByb3BlcnR5T3ZlcnJpZGUoJ0J1Y2tldEVuY3J5cHRpb24uU2VydmVyU2lkZUVuY3J5cHRpb25Db25maWd1cmF0aW9uLjAuRW5jcnlwdEV2ZXJ5dGhpbmdBbmRBbHdheXMnLCB0cnVlKTtcbiAgICAgICAgYnVja2V0UmVzb3VyY2UyLmFkZFByb3BlcnR5RGVsZXRpb25PdmVycmlkZSgnQnVja2V0RW5jcnlwdGlvbi5TZXJ2ZXJTaWRlRW5jcnlwdGlvbkNvbmZpZ3VyYXRpb24uMC5TZXJ2ZXJTaWRlRW5jcnlwdGlvbkJ5RGVmYXVsdCcpO1xuXG4gICAgICAgIHJldHVybjtcblxuICAgICAgICAvL1xuICAgICAgICAvLyBBY2Nlc3NpbmcgdGhlIEwxIGJ1Y2tldCByZXNvdXJjZSBmcm9tIGFuIEwyIGJ1Y2tldFxuICAgICAgICAvL1xuXG4gICAgICAgIGNvbnN0IGJ1Y2tldFJlc291cmNlID0gYnVja2V0LmZpbmRDaGlsZCgnUmVzb3VyY2UnKSBhcyBzMy5jbG91ZGZvcm1hdGlvbi5CdWNrZXRSZXNvdXJjZTtcbiAgICAgICAgY29uc3QgYW5vdGhlcldheSA9IGJ1Y2tldC5jaGlsZHJlbi5maW5kKGMgPT4gKGMgYXMgY2RrLlJlc291cmNlKS5yZXNvdXJjZVR5cGUgPT09ICdBV1M6OlMzOjpCdWNrZXQnKSBhcyBzMy5jbG91ZGZvcm1hdGlvbi5CdWNrZXRSZXNvdXJjZTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGJ1Y2tldFJlc291cmNlLCBhbm90aGVyV2F5KTtcblxuICAgICAgICAvL1xuICAgICAgICAvLyBUaGlzIGlzIGhvdyB0byBzcGVjaWZ5IHJlc291cmNlIG9wdGlvbnMgc3VjaCBhcyBkZXBlbmRlbmNpZXMsIG1ldGFkYXRhLCB1cGRhdGUgcG9saWN5XG4gICAgICAgIC8vXG5cbiAgICAgICAgYnVja2V0UmVzb3VyY2UuYWRkRGVwZW5kZW5jeShvdGhlckJ1Y2tldC5maW5kQ2hpbGQoJ1Jlc291cmNlJykgYXMgY2RrLlJlc291cmNlKTtcbiAgICAgICAgYnVja2V0UmVzb3VyY2Uub3B0aW9ucy5tZXRhZGF0YSA9IHsgTWV0YWRhdGFLZXk6ICdNZXRhZGF0YVZhbHVlJyB9O1xuICAgICAgICBidWNrZXRSZXNvdXJjZS5vcHRpb25zLnVwZGF0ZVBvbGljeSA9IHtcbiAgICAgICAgICAgIGF1dG9TY2FsaW5nUm9sbGluZ1VwZGF0ZToge1xuICAgICAgICAgICAgICAgIHBhdXNlVGltZTogJzM5MCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvL1xuICAgICAgICAvLyBUaGlzIGlzIGhvdyB0byBzcGVjaWZ5IFwicmF3XCIgb3ZlcnJpZGVzIGF0IHRoZSBfX3Jlc291cmNlX18gbGV2ZWxcbiAgICAgICAgLy9cblxuICAgICAgICBidWNrZXRSZXNvdXJjZS5hZGRPdmVycmlkZSgnVHlwZScsICdBV1M6OlMzOjpCdWNrZXRlZXInKTsgLy8gZXZlbiBcIlR5cGVcIiBjYW4gYmUgb3ZlcnJpZGRlblxuICAgICAgICBidWNrZXRSZXNvdXJjZS5hZGRPdmVycmlkZSgnVHJhbnNmb3JtJywgJ0Jvb20nKTtcbiAgICAgICAgYnVja2V0UmVzb3VyY2UuYWRkT3ZlcnJpZGUoJ1Byb3BlcnRpZXMuQ29yc0NvbmZpZ3VyYXRpb24nLCB7XG4gICAgICAgICAgICBDdXN0b206IDEyMyxcbiAgICAgICAgICAgIEJhcjogWyAnQScsICdCJyBdXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGFkZFByb3BlcnR5T3ZlcnJpZGVzIHNpbXBseSBhbGxvd3MgeW91IHRvIG9taXQgdGhlIFwiUHJvcGVydGllcy5cIiBwcmVmaXhcbiAgICAgICAgYnVja2V0UmVzb3VyY2UuYWRkUHJvcGVydHlPdmVycmlkZSgnVmVyc2lvbmluZ0NvbmZpZ3VyYXRpb24uU3RhdHVzJywgJ05ld1N0YXR1cycpO1xuICAgICAgICBidWNrZXRSZXNvdXJjZS5hZGRQcm9wZXJ0eU92ZXJyaWRlKCdGb28nLCBudWxsKTtcbiAgICAgICAgYnVja2V0UmVzb3VyY2UuYWRkUHJvcGVydHlPdmVycmlkZSgnVG9rZW4nLCBvdGhlckJ1Y2tldC5idWNrZXRBcm4pOyAvLyB1c2UgdG9rZW5zXG4gICAgICAgIGJ1Y2tldFJlc291cmNlLmFkZFByb3BlcnR5T3ZlcnJpZGUoJ0xvZ2dpbmdDb25maWd1cmF0aW9uLkRlc3RpbmF0aW9uQnVja2V0TmFtZScsIG90aGVyQnVja2V0LmJ1Y2tldE5hbWUpO1xuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIEl0IGlzIGFsc28gcG9zc2libGUgdG8gcmVxdWVzdCBhIGRlbGV0aW9uIG9mIGEgdmFsdWUgYnkgZWl0aGVyIGFzc2lnbmluZ1xuICAgICAgICAvLyBgdW5kZWZpbmVkYCAoaW4gc3VwcG9ydGVkIGxhbmd1YWdlcykgb3IgdXNlIHRoZSBgYWRkRGVsZXRpb25PdmVycmlkZWAgbWV0aG9kXG4gICAgICAgIC8vXG5cbiAgICAgICAgYnVja2V0UmVzb3VyY2UuYWRkRGVsZXRpb25PdmVycmlkZSgnTWV0YWRhdGEnKTtcbiAgICAgICAgYnVja2V0UmVzb3VyY2UuYWRkUHJvcGVydHlEZWxldGlvbk92ZXJyaWRlKCdDb3JzQ29uZmlndXJhdGlvbi5CYXInKTtcblxuICAgICAgICAvL1xuICAgICAgICAvLyBJdCBpcyBhbHNvIHBvc3NpYmxlIHRvIHNwZWNpZnkgb3ZlcnJpZGVzIHZpYSBhIHN0cm9uZy10eXBlZCBwcm9wZXJ0eVxuICAgICAgICAvLyBiYWcgY2FsbGVkIGBwcm9wZXJ0eU92ZXJyaWRlc2BcbiAgICAgICAgLy9cblxuICAgICAgICBidWNrZXRSZXNvdXJjZS5wcm9wZXJ0eU92ZXJyaWRlcy5hbmFseXRpY3NDb25maWd1cmF0aW9ucyA9IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogJ2NvbmZpZzEnLFxuICAgICAgICAgICAgICAgIHN0b3JhZ2VDbGFzc0FuYWx5c2lzOiB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFFeHBvcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dFNjaGVtYVZlcnNpb246ICcxJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0OiAnaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVja2V0QXJuOiBvdGhlckJ1Y2tldC5idWNrZXRBcm4gLy8gdXNlIHRva2VucyBmcmVlbHlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgXTtcblxuICAgICAgICBidWNrZXRSZXNvdXJjZS5wcm9wZXJ0eU92ZXJyaWRlcy5jb3JzQ29uZmlndXJhdGlvbiA9IHtcbiAgICAgICAgICAgIGNvcnNSdWxlczogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgYWxsb3dlZE1ldGhvZHM6IFsgJ0dFVCcgXSxcbiAgICAgICAgICAgICAgICAgICAgYWxsb3dlZE9yaWdpbnM6IFsgJyonIF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGNOZXR3b3JrKHRoaXMsICdWUEMnLCB7IG1heEFaczogMSB9KTtcbiAgICAgICAgY29uc3QgYXNnID0gbmV3IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAodGhpcywgJ0FTRycsIHtcbiAgICAgICAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGVQYWlyKGVjMi5JbnN0YW5jZUNsYXNzLk00LCBlYzIuSW5zdGFuY2VTaXplLlhMYXJnZSksXG4gICAgICAgICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBlYzIuQW1hem9uTGludXhJbWFnZSgpLFxuICAgICAgICAgICAgdnBjXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIFRoZSBkZWZhdWx0IGNoaWxkIHJlc291cmNlIGlzIGNhbGxlZCBgUmVzb3VyY2VgLCBidXQgc2Vjb25kYXJ5IHJlc291cmNlcywgc3VjaCBhc1xuICAgICAgICAvLyBhbiBBdXRvIFNjYWxpbmcgR3JvdXAncyBsYXVuY2ggY29uZmlndXJhdGlvbiBtaWdodCBoYXZlIGEgZGlmZmVyZW50IElELiBZb3Ugd2lsbCBsaWtlbHlcbiAgICAgICAgLy8gbmVlZCB0byBjb25zdWxlIHRoZSBjb2RlYmFzZSBvciB1c2UgdGhlIGAubWFwLmZpbmRgIG1ldGhvZCBhYm92ZVxuICAgICAgICAvL1xuXG4gICAgICAgIGNvbnN0IGxjID0gYXNnLmZpbmRDaGlsZCgnTGF1bmNoQ29uZmlnJykgYXMgYXV0b3NjYWxpbmcuY2xvdWRmb3JtYXRpb24uTGF1bmNoQ29uZmlndXJhdGlvblJlc291cmNlO1xuICAgICAgICBsYy5hZGRQcm9wZXJ0eU92ZXJyaWRlKCdGb28uQmFyJywgJ0hlbGxvJyk7XG4gICAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xubmV3IFJlc291cmNlT3ZlcnJpZGVzRXhhbXBsZShhcHAsICdyZXNvdXJjZS1vdmVycmlkZXMnKTtcbmFwcC5ydW4oKTsiXX0=