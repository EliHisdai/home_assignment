import { ApiProperty } from '@nestjs/swagger';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export class Patient {
  @ApiProperty({ description: 'Unique identifier for the patient', example: 'P12345' })
  id: string;

  @ApiProperty({ description: 'Full name of the patient', example: 'John Doe' })
  name: string;

  @ApiProperty({ description: 'Age of the patient', example: 45 })
  age: number;

  @ApiProperty({
    description: 'Gender of the patient',
    enum: Gender,
    example: Gender.MALE,
  })
  gender: Gender;
}
