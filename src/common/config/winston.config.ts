import { registerAs } from '@nestjs/config';
import process from 'process';

export default registerAs('winston', () => {
  return {
    level: 'info',
    logGroupName: 'short-tutoring',
    logStreamName: 'short-tutoring',
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsRegion: process.env.AWS_REGION,
    awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  };
});
