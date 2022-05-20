import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { ProductDto } from '../../products/dto/product.dto';

@ObjectType({
  description: 'Complete schema of category',
})
export class CategoryDto {
  @Field({
    nullable: false,
    description: `Unique name (also used as PK) of category`,
  })
  @ApiProperty({
    name: 'categoryName',
    example: "Children's literature",
    description: 'Unique name of category',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @ValidateIf((_, val) => !!val)
  categoryName: string;

  @ApiProperty({
    type: String,
    nullable: true,
    name: 'parentCategoryName',
    example: 'Books',
    description: 'Name of parent category',
  })
  @Field(() => String, {
    nullable: true,
    description: '.categoryName of parent category. Optional.',
  })
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(50)
  @ValidateIf((_, val) => !!val)
  parentCategoryName: string | null;

  @Field(() => [ProductDto], {
    name: 'products',
    description: 'Full list of products in category. GraphQL only.',
  })
  products: never;
}
