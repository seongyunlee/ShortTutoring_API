import { Webhook } from 'discord-webhook-node';
import * as dotenv from 'dotenv';
import * as process from 'process';

dotenv.config();
export const webhook = new Webhook(process.env.DISCORD_WEBHOOK_URL);
export const studentWebhook = new Webhook(process.env.DISCORD_STUDENT_URL);
export const teacherWebhook = new Webhook(process.env.DISCORD_TEACHER_URL);

export const socketErrorWebhook = new Webhook(
  process.env.DISCORD_SOCKET_ERROR_URL,
);
