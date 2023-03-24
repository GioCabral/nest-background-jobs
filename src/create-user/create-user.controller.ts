import { Body, Controller, Post } from '@nestjs/common';
import { sendMailProducerService } from 'src/jobs/sendMail-producer-service';
import { CreateUserDTO } from './create-user-dto';

@Controller('create-user')
export class CreateUserController {
  constructor(private sendMailService: sendMailProducerService) {}
  @Post('/')
  async createUser(@Body() createUser: CreateUserDTO) {
    this.sendMailService.sendMail(createUser);
    return createUser;
  }
}
