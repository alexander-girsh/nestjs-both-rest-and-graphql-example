import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { CategoryDto } from './category.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

@InputType({
  description: 'Is used to create the new category',
})
export class CreateCategoryDto extends CategoryDto {
  @Field(() => String, {
    description: `Unique name of category`,
  })
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(50)
  @ValidateIf((_, val) => !!val)
  categoryName: string;

  @ApiPropertyOptional({
    nullable: true,
  })
  @Field(() => String, {
    nullable: true,
    description: `Name of parent category`,
  })
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(50)
  @ValidateIf((_, val) => !!val)
  parentCategoryName: CreateCategoryDto['categoryName'] | null = null;
}
