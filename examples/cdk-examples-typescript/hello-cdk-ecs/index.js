"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = require("@aws-cdk/aws-ec2");
const aws_ec2_1 = require("@aws-cdk/aws-ec2");
const ecs = require("@aws-cdk/aws-ecs");
const cdk = require("@aws-cdk/cdk");
class BonjourECS extends cdk.Stack {
    constructor(parent, name, props) {
        super(parent, name, props);
        // For better iteration speed, it might make sense to put this VPC into
        // a separate stack and import it here. We then have two stacks to
        // deploy, but VPC creation is slow so we'll only have to do that once
        // and can iterate quickly on consuming stacks. Not doing that for now.
        const vpc = new ec2.VpcNetwork(this, 'MyVpc', { maxAZs: 2 });
        const cluster = new ecs.Cluster(this, 'Ec2Cluster', { vpc });
        cluster.addDefaultAutoScalingGroupCapacity({
            instanceType: new aws_ec2_1.InstanceType("t2.xlarge"),
            instanceCount: 3,
        });
        // Instantiate ECS Service with just cluster and image
        const ecsService = new ecs.LoadBalancedEc2Service(this, "Ec2Service", {
            cluster,
            memoryLimitMiB: 512,
            image: ecs.ContainerImage.fromDockerHub("amazon/amazon-ecs-sample"),
        });
        // ecsService.addTracing
        // Output the DNS where you can access your service
        new cdk.Output(this, 'LoadBalancerDNS', { value: ecsService.loadBalancer.dnsName });
    }
}
const app = new cdk.App();
new BonjourECS(app, 'Bonjour');
app.run();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHdDQUF5QztBQUN6Qyw4Q0FBZ0Q7QUFDaEQsd0NBQXlDO0FBQ3pDLG9DQUFxQztBQUVyQyxNQUFNLFVBQVcsU0FBUSxHQUFHLENBQUMsS0FBSztJQUNoQyxZQUFZLE1BQWUsRUFBRSxJQUFZLEVBQUUsS0FBc0I7UUFDL0QsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFM0IsdUVBQXVFO1FBQ3ZFLGtFQUFrRTtRQUNsRSxzRUFBc0U7UUFDdEUsdUVBQXVFO1FBQ3ZFLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDN0QsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQzdELE9BQU8sQ0FBQyxrQ0FBa0MsQ0FBQztZQUN6QyxZQUFZLEVBQUUsSUFBSSxzQkFBWSxDQUFDLFdBQVcsQ0FBQztZQUMzQyxhQUFhLEVBQUUsQ0FBQztTQUNqQixDQUFDLENBQUM7UUFFSCxzREFBc0Q7UUFDdEQsTUFBTSxVQUFVLEdBQUcsSUFBSSxHQUFHLENBQUMsc0JBQXNCLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUNwRSxPQUFPO1lBQ1AsY0FBYyxFQUFFLEdBQUc7WUFDbkIsS0FBSyxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLDBCQUEwQixDQUFDO1NBQ3BFLENBQUMsQ0FBQztRQUVILHdCQUF3QjtRQUV4QixtREFBbUQ7UUFDbkQsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxFQUFFLEtBQUssRUFBRSxVQUFVLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDdEYsQ0FBQztDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsSUFBSSxVQUFVLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBRS9CLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBlYzIgPSByZXF1aXJlKCdAYXdzLWNkay9hd3MtZWMyJyk7XG5pbXBvcnQgeyBJbnN0YW5jZVR5cGUgfSBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCBlY3MgPSByZXF1aXJlKCdAYXdzLWNkay9hd3MtZWNzJyk7XG5pbXBvcnQgY2RrID0gcmVxdWlyZSgnQGF3cy1jZGsvY2RrJyk7XG5cbmNsYXNzIEJvbmpvdXJFQ1MgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IGNkay5BcHAsIG5hbWU6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHBhcmVudCwgbmFtZSwgcHJvcHMpO1xuXG4gICAgLy8gRm9yIGJldHRlciBpdGVyYXRpb24gc3BlZWQsIGl0IG1pZ2h0IG1ha2Ugc2Vuc2UgdG8gcHV0IHRoaXMgVlBDIGludG9cbiAgICAvLyBhIHNlcGFyYXRlIHN0YWNrIGFuZCBpbXBvcnQgaXQgaGVyZS4gV2UgdGhlbiBoYXZlIHR3byBzdGFja3MgdG9cbiAgICAvLyBkZXBsb3ksIGJ1dCBWUEMgY3JlYXRpb24gaXMgc2xvdyBzbyB3ZSdsbCBvbmx5IGhhdmUgdG8gZG8gdGhhdCBvbmNlXG4gICAgLy8gYW5kIGNhbiBpdGVyYXRlIHF1aWNrbHkgb24gY29uc3VtaW5nIHN0YWNrcy4gTm90IGRvaW5nIHRoYXQgZm9yIG5vdy5cbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwY05ldHdvcmsodGhpcywgJ015VnBjJywgeyBtYXhBWnM6IDIgfSk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3Rlcih0aGlzLCAnRWMyQ2x1c3RlcicsIHsgdnBjIH0pO1xuICAgIGNsdXN0ZXIuYWRkRGVmYXVsdEF1dG9TY2FsaW5nR3JvdXBDYXBhY2l0eSh7XG4gICAgICBpbnN0YW5jZVR5cGU6IG5ldyBJbnN0YW5jZVR5cGUoXCJ0Mi54bGFyZ2VcIiksXG4gICAgICBpbnN0YW5jZUNvdW50OiAzLFxuICAgIH0pO1xuXG4gICAgLy8gSW5zdGFudGlhdGUgRUNTIFNlcnZpY2Ugd2l0aCBqdXN0IGNsdXN0ZXIgYW5kIGltYWdlXG4gICAgY29uc3QgZWNzU2VydmljZSA9IG5ldyBlY3MuTG9hZEJhbGFuY2VkRWMyU2VydmljZSh0aGlzLCBcIkVjMlNlcnZpY2VcIiwge1xuICAgICAgY2x1c3RlcixcbiAgICAgIG1lbW9yeUxpbWl0TWlCOiA1MTIsXG4gICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21Eb2NrZXJIdWIoXCJhbWF6b24vYW1hem9uLWVjcy1zYW1wbGVcIiksXG4gICAgfSk7XG5cbiAgICAvLyBlY3NTZXJ2aWNlLmFkZFRyYWNpbmdcblxuICAgIC8vIE91dHB1dCB0aGUgRE5TIHdoZXJlIHlvdSBjYW4gYWNjZXNzIHlvdXIgc2VydmljZVxuICAgIG5ldyBjZGsuT3V0cHV0KHRoaXMsICdMb2FkQmFsYW5jZXJETlMnLCB7IHZhbHVlOiBlY3NTZXJ2aWNlLmxvYWRCYWxhbmNlci5kbnNOYW1lIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbm5ldyBCb25qb3VyRUNTKGFwcCwgJ0JvbmpvdXInKTtcblxuYXBwLnJ1bigpO1xuIl19