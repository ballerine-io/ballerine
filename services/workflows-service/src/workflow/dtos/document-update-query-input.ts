import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class DocumentUpdateQueryInput {
  @Transform(({ value }) => {
    try {
      return JSON.parse(value);
    } catch (error) {
      return false;
    }
  })
  @IsBoolean()
  isDirector!: boolean;
}
