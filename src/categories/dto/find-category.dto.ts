import { ApiPropertyOptional } from '@nestjs/swagger';
import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CategoryDto } from './category.dto';
import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

@InputType({
  description: `List of accepted fields to filter the categories list`,
})
export class FindCategoryDto extends PartialType(CategoryDto) {
  @ApiPropertyOptional({
    name: 'categoryName',
    example: "Children's literature",
    description: 'Unique name of category',
  })
  @Field(() => String, {
    nullable: true,
    description: `Unique name of category`,
  })
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(50)
  @ValidateIf((_, val) => !!val)
  categoryName?: string;

  @ApiPropertyOptional({
    type: String,
    name: 'parentCategoryName',
    example: 'Books',
    description: 'Name of parent category',
  })
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(50)
  @ValidateIf((_, val) => !!val)
  @Field(() => String, {
    nullable: true,
    description: `Name of parent category`,
  })
  parentCategoryName?: FindCategoryDto['categoryName'];
}
