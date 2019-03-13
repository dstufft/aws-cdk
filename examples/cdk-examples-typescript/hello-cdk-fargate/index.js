"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = require("@aws-cdk/aws-ec2");
const ecs = require("@aws-cdk/aws-ecs");
const cdk = require("@aws-cdk/cdk");
class BonjourFargate extends cdk.Stack {
    constructor(parent, name, props) {
        super(parent, name, props);
        // Create VPC and Fargate Cluster
        // NOTE: Limit AZs to avoid reaching resource quotas
        const vpc = new ec2.VpcNetwork(this, 'MyVpc', { maxAZs: 2 });
        const cluster = new ecs.Cluster(this, 'Cluster', { vpc });
        // Instantiate Fargate Service with just cluster and image
        const fargateService = new ecs.LoadBalancedFargateService(this, "FargateService", {
            cluster,
            image: ecs.ContainerImage.fromDockerHub("amazon/amazon-ecs-sample"),
        });
        // Output the DNS where you can access your service
        new cdk.Output(this, 'LoadBalancerDNS', { value: fargateService.loadBalancer.dnsName });
    }
}
const app = new cdk.App();
new BonjourFargate(app, 'Bonjour');
app.run();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHdDQUF5QztBQUN6Qyx3Q0FBeUM7QUFDekMsb0NBQXFDO0FBRXJDLE1BQU0sY0FBZSxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ3BDLFlBQVksTUFBZSxFQUFFLElBQVksRUFBRSxLQUFzQjtRQUMvRCxLQUFLLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUUzQixpQ0FBaUM7UUFDakMsb0RBQW9EO1FBQ3BELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDN0QsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBRTFELDBEQUEwRDtRQUMxRCxNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7WUFDaEYsT0FBTztZQUNQLEtBQUssRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQywwQkFBMEIsQ0FBQztTQUNwRSxDQUFDLENBQUM7UUFFSCxtREFBbUQ7UUFDbkQsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxFQUFFLEtBQUssRUFBRSxjQUFjLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDMUYsQ0FBQztDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsSUFBSSxjQUFjLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBRW5DLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBlYzIgPSByZXF1aXJlKCdAYXdzLWNkay9hd3MtZWMyJyk7XG5pbXBvcnQgZWNzID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLWVjcycpO1xuaW1wb3J0IGNkayA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2NkaycpO1xuXG5jbGFzcyBCb25qb3VyRmFyZ2F0ZSBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudDogY2RrLkFwcCwgbmFtZTogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIocGFyZW50LCBuYW1lLCBwcm9wcyk7XG5cbiAgICAvLyBDcmVhdGUgVlBDIGFuZCBGYXJnYXRlIENsdXN0ZXJcbiAgICAvLyBOT1RFOiBMaW1pdCBBWnMgdG8gYXZvaWQgcmVhY2hpbmcgcmVzb3VyY2UgcXVvdGFzXG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGNOZXR3b3JrKHRoaXMsICdNeVZwYycsIHsgbWF4QVpzOiAyIH0pO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIodGhpcywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcblxuICAgIC8vIEluc3RhbnRpYXRlIEZhcmdhdGUgU2VydmljZSB3aXRoIGp1c3QgY2x1c3RlciBhbmQgaW1hZ2VcbiAgICBjb25zdCBmYXJnYXRlU2VydmljZSA9IG5ldyBlY3MuTG9hZEJhbGFuY2VkRmFyZ2F0ZVNlcnZpY2UodGhpcywgXCJGYXJnYXRlU2VydmljZVwiLCB7XG4gICAgICBjbHVzdGVyLFxuICAgICAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tRG9ja2VySHViKFwiYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlXCIpLFxuICAgIH0pO1xuXG4gICAgLy8gT3V0cHV0IHRoZSBETlMgd2hlcmUgeW91IGNhbiBhY2Nlc3MgeW91ciBzZXJ2aWNlXG4gICAgbmV3IGNkay5PdXRwdXQodGhpcywgJ0xvYWRCYWxhbmNlckROUycsIHsgdmFsdWU6IGZhcmdhdGVTZXJ2aWNlLmxvYWRCYWxhbmNlci5kbnNOYW1lIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbm5ldyBCb25qb3VyRmFyZ2F0ZShhcHAsICdCb25qb3VyJyk7XG5cbmFwcC5ydW4oKTtcbiJdfQ==