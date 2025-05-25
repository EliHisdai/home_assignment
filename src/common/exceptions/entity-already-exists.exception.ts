import { BadRequestException } from '@nestjs/common';

/**
 * Exception thrown when an entity already exists
 * Extends the built-in BadRequestException but adds more context
 */
export class EntityAlreadyExistsException extends BadRequestException {
  constructor(entityName: string, id: string) {
    super(`${entityName} with ID '${id}' already exists`);
  }
}
