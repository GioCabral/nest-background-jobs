import { MailerService } from '@nest-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { CreateUserDTO } from 'src/create-user/create-user-dto';

@Processor('sendMail-queue')
class sendMailConsumer {
  constructor(private mailService: MailerService) {}

  @Process('sendMail-job')
  async sendMailJob(job: Job<CreateUserDTO>) {
    const { data } = job;

    await this.mailService.sendMail({
      to: data.email,
      from: 'SIFUDEGORDAO',
      subject: 'Bem vindo ao SIFUDEGORDAO',
      text: `Bem vindo ao SIFUDEGORDAO ${data.name}}`,
    });
  }
}
export { sendMailConsumer };
