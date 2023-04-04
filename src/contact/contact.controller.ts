import {
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
  Body,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ContactsService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { Contact } from './entities/contact.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { LoggedUser } from 'src/auth/logged-user.decorators';
import { User } from '@prisma/client';
@ApiTags('contact')
@Controller('contacts')
export class ContactsController {
  constructor(private contactsService: ContactsService) {}

  @Post()
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar um contato' })
  async createContact(
    @Query('userId') userId: string,
    @Body() createContactDto: CreateContactDto,
  ): Promise<Contact> {
    return this.contactsService.createContact(userId, createContactDto);
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar contato por ID' })
  async getContactById(
    @LoggedUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Contact> {
    return this.contactsService.getContactById(user.id, id);
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualiza um contato' })
  async updateContact(
    @Query('userId') userId: string,
    @Param('id') id: string,
    @Body() updateContactDto: CreateContactDto,
  ): Promise<Contact> {
    return this.contactsService.updateContact(userId, id, updateContactDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deleta um contato' })
  async deleteContact(
    @Query('userId') userId: string,
    @Param('id') id: string,
  ): Promise<Contact> {
    return this.contactsService.deleteContact(userId, id);
  }

  @Get()
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os contatos de um usuário:' })
  async getAllContacts(@Query('userId') userId: string): Promise<Contact[]> {
    return this.contactsService.getAllContacts(userId);
  }

  @Get('search/letter')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Pesquisa por letra um contato:' })
  async searchContactsByLetter(
    @Query('userId') userId: string,
    @Query('letter') letter: string,
  ): Promise<Contact[]> {
    return this.contactsService.searchContactsByLetter(userId, letter);
  }

  @Get('search/name')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Pesquisa por nome um contato:' })
  async searchContactsByName(
    @Query('userId') userId: string,
    @Query('name') name: string,
  ): Promise<Contact[]> {
    return this.contactsService.searchContactsByName(userId, name);
  }

  @Get('next/:currentContactId')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retornar o próximo registro de um contato:' })
  async getNextContact(
    @Query('userId') userId: string,
    @Param('currentContactId') currentContactId: string,
  ): Promise<{ contact: Contact | null; message: string }> {
    return this.contactsService.getNextContact(userId, currentContactId);
  }

  @Get('skip/:currentContactId')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Pula para a próxima letra de um contato:' })
  async skipToNextLetter(
    @Query('userId') userId: string,
    @Param('currentContactId') currentContactId: string,
  ): Promise<{ contact: Contact | null; message: string }> {
    return this.contactsService.getNextContact(userId, currentContactId);
  }
}
