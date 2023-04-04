import { Module } from '@nestjs/common';
import { ContactsController } from './contact.controller';
import { ContactsService } from './contact.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
  ],
  controllers: [ContactsController],
  providers: [ContactsService],
})
export class ContactModule {}
