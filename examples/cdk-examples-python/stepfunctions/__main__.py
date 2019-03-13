import aws_cdk.aws_lambda as lambda_
import aws_cdk.aws_stepfunctions as stepfunctions
import aws_cdk.aws_iam as iam
import aws_cdk.cdk as cdk


class Lambda3Stack(cdk.Stack):
    def __init__(self, parent: cdk.App, name: str, **kwargs):
        super().__init__(parent, name, **kwargs)

        xferStep = self.pystep(
            "Download",
            "download_data.xfer_caltech256_recio",
            resultPath="$.training_data",
        )

        # Training
        trainStep = self.pystep(
            "Train",
            "train.train",
            inputPath="$.training_data",
            resultPath="$.training_job",
        )

        trainWaiterStep = self.pystep(
            "Wait for training",
            "train.wait_for_completion",
            inputPath="$.training_job",
            resultPath="$.training_status",
        )

        isTrainingComplete = stepfunctions.Choice(
            self, "Training Job Complete?", inputPath="$"
        )
        trainingJobFailed = stepfunctions.Fail(
            self,
            "Training Job Failed",
            cause="SageMaker Training Job Failed",
            error="DescribeJob returned FAILED",
        )
        trainingJobSucceeded = stepfunctions.Pass(self, "Training Job Succeeded")

        # Transform evaluation data
        transformStep = self.pystep(
            "Transform",
            "transform.transform",
            inputPath="$.training_job",
            resultPath="$.transform_job",
        )

        transformWaiterStep = self.pystep(
            "Wait for transform",
            "transform.wait_for_completion",
            inputPath="$.transform_job",
            resultPath="$.transform_status",
        )

        isTransformComplete = stepfunctions.Choice(
            self, "Transform Job Complete?", inputPath="$"
        )
        transformJobFailed = stepfunctions.Fail(
            self,
            "Transform Job Failed",
            cause="SageMaker Transform Job Failed",
            error="DescribeJob returned FAILED",
        )
        transformJobSucceeded = stepfunctions.Succeed(self, "Transform Job Succeeded")

        # Define whole state machine
        definition = (
            xferStep.next(trainStep)
            .next(trainWaiterStep)
            .next(
                isTrainingComplete.when(
                    stepfunctions.Condition.boolean_equals(
                        "$.training_status.finished", False
                    ),
                    trainWaiterStep,
                )
                .when(
                    stepfunctions.Condition.string_equals(
                        "$.training_status.description.TrainingJobStatus", "Failed"
                    ),
                    trainingJobFailed,
                )
                .otherwise(trainingJobSucceeded)
            )
        )

        (
            trainingJobSucceeded.next(transformStep)
            .next(transformWaiterStep)
            .next(
                isTransformComplete.when(
                    stepfunctions.Condition.boolean_equals(
                        "$.transform_status.finished", False
                    ),
                    transformWaiterStep,
                )
                .when(
                    stepfunctions.Condition.string_equals(
                        "$.transform_status.description.TransformJobStatus", "Failed"
                    ),
                    transformJobFailed,
                )
                .otherwise(transformJobSucceeded)
            )
        )

        stepfunctions.StateMachine(
            self, "MLFlow", definition=definition, timeoutSec=30000
        )

    def pylambda(self, name: str, handler: str) -> lambda_.Function:
        fn = lambda_.Function(
            self,
            name,
            code=lambda_.Code.file("venv.zip"),
            handler=handler,
            runtime=lambda_.Runtime.python36,
            timeout=15 * 60,
        )

        fn.add_to_role_policy(iam.PolicyStatement().add_all_resources().add_action("*"))
        fn.add_version("1")

        return fn

    def pystep(self, name: str, handler: str, **props) -> stepfunctions.Task:
        fn = self.pylambda(f"${name}-Func", handler)
        step = stepfunctions.Task(self, name, resource=fn, **props)
        return step


app = cdk.App()

Lambda3Stack(app, "Lambda3Stack")

app.run()
