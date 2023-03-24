import { MailerModule } from '@nest-modules/mailer';
import { BullModule, InjectQueue } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Queue } from 'bull';
import { CreateUserController } from './create-user/create-user.controller';
import { sendMailConsumer } from './jobs/sendMail-consumer';
import { sendMailProducerService } from './jobs/sendMail-producer-service';
import { createBullBoard } from 'bull-board';
import { BullAdapter } from 'bull-board/bullAdapter';
import { MiddlewareBuilder } from '@nestjs/core';
import { UserTestController } from './user-test/user-test.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue(
      {
        name: 'sendMail-queue',
      },
      {
        name: 'processFile-queue',
      },
    ),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
    }),
  ],
  controllers: [CreateUserController, UserTestController],
  providers: [sendMailProducerService, sendMailConsumer],
})
export class AppModule {
  constructor(
    @InjectQueue('sendMail-queue') private sendMailQueue: Queue, // @InjectQueue('processFile-queue') private processFileQueue: Queue,
  ) {}

  configure(consumer: MiddlewareBuilder) {
    const { router } = createBullBoard([
      new BullAdapter(this.sendMailQueue),
      // new BullAdapter(this.processFileQueue),
    ]);
    consumer.apply(router).forRoutes('/admin/queues');
  }
}
