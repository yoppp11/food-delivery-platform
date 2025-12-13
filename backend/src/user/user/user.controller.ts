import { Body, Controller, Get, Param, Post } from '@nestjs/common';

@Controller('user')
export class UserController {
    @Post()
    async createUser(
        @Body('name') name: string,
        @Body('email') email: string,
        @Body('password') password: string
    ): Promise<string> {
        return 'sucess'
    }

}
