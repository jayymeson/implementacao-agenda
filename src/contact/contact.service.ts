// contacts.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { Contact } from './entities/contact.entity';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async createContact(
    userId: string,
    createContactDto: CreateContactDto,
  ): Promise<Contact> {
    // Verificar se o usuário existe
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.contact.create({
      data: {
        ...createContactDto,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async getContactById(userId: string, id: string): Promise<Contact | null> {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
    });

    if (!contact || contact.userId !== userId) {
      throw new NotFoundException(
        'Contato não encontrado ou não pertence ao usuário',
      );
    }

    return contact;
  }

  async updateContact(
    userId: string,
    id: string,
    updateContactDto: CreateContactDto,
  ): Promise<Contact> {
    return this.prisma.contact.update({
      where: {
        id,
      },
      data: {
        ...updateContactDto,
        userId,
      },
    });
  }

  async deleteContact(userId: string, id: string): Promise<Contact> {
    const contact = await this.prisma.contact.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    return this.prisma.contact.delete({
      where: { id },
    });
  }

  async getAllContacts(userId: string): Promise<Contact[]> {
    return this.prisma.contact.findMany({
      where: {
        userId,
      },
    });
  }

  async searchContactsByLetter(
    userId: string,
    letter: string,
  ): Promise<Contact[]> {
    return this.prisma.contact.findMany({
      where: {
        userId,
        name: {
          startsWith: letter,
        },
      },
    });
  }

  async searchContactsByName(userId: string, name: string): Promise<Contact[]> {
    return this.prisma.contact.findMany({
      where: {
        userId,
        name: {
          contains: name,
        },
      },
    });
  }

  async getNextContact(
    userId: string,
    currentContactId: string,
  ): Promise<{ contact: Contact | null; message: string }> {
    const currentContact = await this.prisma.contact.findUnique({
      where: { id: currentContactId },
    });

    if (!currentContact) {
      return { contact: null, message: 'Current contact not found.' };
    }

    const nextContact = await this.prisma.contact.findFirst({
      where: {
        userId,
        createdAt: {
          gt: currentContact.createdAt,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (!nextContact) {
      return { contact: null, message: 'No next contact found.' };
    }

    return { contact: nextContact, message: 'Next contact found.' };
  }

  async skipToNextLetter(
    userId: string,
    currentContactId: string,
  ): Promise<{ contact: Contact | null; message: string }> {
    const currentContact = await this.prisma.contact.findUnique({
      where: { id: currentContactId },
    });

    if (!currentContact) {
      return { contact: null, message: 'Current contact not found.' };
    }

    const firstLetter = currentContact.name[0];
    const nextLetterContacts = await this.prisma.contact.findMany({
      where: {
        userId,
        name: {
          startsWith: firstLetter,
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    const currentIndex = nextLetterContacts.findIndex(
      (contact) => contact.id === currentContactId,
    );
    const nextContact = nextLetterContacts[currentIndex + 1] || null;

    if (!nextContact) {
      return {
        contact: null,
        message: 'No contact with the next letter found.',
      };
    }

    return {
      contact: nextContact,
      message: 'Contact with the next letter found.',
    };
  }
}
