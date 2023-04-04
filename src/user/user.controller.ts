import {
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User as PrismaUser } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  // @UseGuards(AuthGuard())
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar um usuário:' })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<PrismaUser> {
    return this.usersService.createUser(createUserDto);
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os usuários:' })
  async getUserById(@Param('id') id: string): Promise<PrismaUser> {
    return this.usersService.getUserById(id);
  }

  @Get()
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os usuários:' })
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar um usuário.' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: CreateUserDto,
  ): Promise<PrismaUser> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar um usuário pelo Id:' })
  async deleteUser(@Param('id') id: string): Promise<PrismaUser> {
    return this.usersService.deleteUser(id);
  }
}
