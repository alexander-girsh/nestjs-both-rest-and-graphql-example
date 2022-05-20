import { CreateCategoryDto } from './create-category.dto';
import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

// Here we do not use PartialType cause the natural
// primary key (.categoryName) of CreateCategoryDto
// is also updatable
@InputType({
  description: 'used to update the category',
})
export class UpdateCategoryDto extends CreateCategoryDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Field(() => String, {
    description: `Unique name of category`,
  })
  categoryName: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(50)
  @ValidateIf((_, val) => !!val)
  @Field(() => String, {
    nullable: true,
    description: `Name of parent category`,
  })
  parentCategoryName: CreateCategoryDto['categoryName'] | null;
}
