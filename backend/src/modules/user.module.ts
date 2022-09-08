import { Module } from '@nestjs/common';
import { UserService } from 'service/user.service';

@Module({
    components: [UserService],
    exports: [UserService]
})
export class UserModule {}