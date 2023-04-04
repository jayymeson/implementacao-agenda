import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User as PrismaUser } from '@prisma/client';
import { handleErrorConstraintUnique } from 'src/utils/handle.erros';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto): Promise<PrismaUser> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return this.prisma.user
      .create({
        data: {
          ...createUserDto,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
      .catch(handleErrorConstraintUnique);
  }

  async getAllUsers(): Promise<PrismaUser[]> {
    return this.prisma.user.findMany();
  }

  async getUserById(id: string): Promise<PrismaUser> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<PrismaUser> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async updateUser(
    id: string,
    updateUserDto: CreateUserDto,
  ): Promise<PrismaUser> {
    return this.prisma.user.update({
      where: { id },
      data: { ...updateUserDto, updatedAt: new Date() },
    });
  }

  async deleteUser(id: string): Promise<PrismaUser> {
    return this.prisma.user.delete({ where: { id } });
  }
}
