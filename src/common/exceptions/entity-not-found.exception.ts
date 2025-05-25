import { NotFoundException } from '@nestjs/common';
import { ENTITY_NAMES } from '../constants';

/**
 * Exception thrown when an entity is not found
 * Extends the built-in NotFoundException but adds more context
 */
export class EntityNotFoundException extends NotFoundException {
  constructor(entityName: ENTITY_NAMES, entityId: string) {
    super(`${entityName} with ID '${entityId}' not found`);
  }
}
