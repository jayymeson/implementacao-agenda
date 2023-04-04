import { UnprocessableEntityException } from '@nestjs/common';

export function handleErrorConstraintUnique(error: Error): never {
  const splitedMessage = error.message.split('`');

  const errorMessage = `Input '${
    splitedMessage[splitedMessage.length - 2]
  }' is not respecting the UNIQUE constraint  `;

  throw new UnprocessableEntityException(errorMessage);
}
