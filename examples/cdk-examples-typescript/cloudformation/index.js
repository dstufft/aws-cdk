"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqs = require("@aws-cdk/aws-sqs");
const cdk = require("@aws-cdk/cdk");
class CloudFormationExample extends cdk.Stack {
    constructor(parent) {
        super(parent);
        new sqs.cloudformation.QueueResource(this, 'MyQueue', {
            visibilityTimeout: 300
        });
    }
}
const app = new cdk.App();
new CloudFormationExample(app);
app.run();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHdDQUF5QztBQUN6QyxvQ0FBcUM7QUFFckMsTUFBTSxxQkFBc0IsU0FBUSxHQUFHLENBQUMsS0FBSztJQUMzQyxZQUFZLE1BQWU7UUFDekIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRWQsSUFBSSxHQUFHLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQ3BELGlCQUFpQixFQUFFLEdBQUc7U0FDdkIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsSUFBSSxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUUvQixHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc3FzID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLXNxcycpO1xuaW1wb3J0IGNkayA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2NkaycpO1xuXG5jbGFzcyBDbG91ZEZvcm1hdGlvbkV4YW1wbGUgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IGNkay5BcHApIHtcbiAgICBzdXBlcihwYXJlbnQpO1xuXG4gICAgbmV3IHNxcy5jbG91ZGZvcm1hdGlvbi5RdWV1ZVJlc291cmNlKHRoaXMsICdNeVF1ZXVlJywge1xuICAgICAgdmlzaWJpbGl0eVRpbWVvdXQ6IDMwMFxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbm5ldyBDbG91ZEZvcm1hdGlvbkV4YW1wbGUoYXBwKTtcblxuYXBwLnJ1bigpO1xuIl19