import { logger } from "../logger/logger";
import AWS from "aws-sdk";

const cloudWatch = new AWS.CloudWatch({ region: 'eu-west-3' });
export function sendUserMetric(instanceId: string, userCount: number) {
    console.log(userCount, 'User')
    const params = {
      MetricData: [
        {
          MetricName: "ActiveUserCount", // Nombre de la métrica
          // Dimensions: [
          //   {
          //     Name: "InstanceId",
          //     Value: instanceId, // ID de la instancia donde se está ejecutando
          //   },
          // ],
          Unit: "Count", // Unidad de la métrica
          Value: userCount, // Número actual de usuarios
        },
      ],
      Namespace: "Server/UserMetrics", // Nombre de tu espacio de métricas
    };

    cloudWatch.putMetricData(params, (err: any, data: any) => {
      if (err) {
        logger.error("Error sending metric to CloudWatch "+err);
      } else {
        logger.info("Successfully sent user metric to CloudWatch "+data);
      }
    });
  }