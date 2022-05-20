import { ApiProperty } from '@nestjs/swagger';
import { Field, InputType, OmitType } from '@nestjs/graphql';
import { CategoryDto } from '../../categories/dto/category.dto';
import { ProductDto } from './product.dto';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

@InputType('CreateProductDto', {
  description: 'Is used to create new products',
})
export class CreateProductDto extends OmitType(ProductDto, [
  'status',
  'productId',
]) {
  @Field(() => String, {
    description: 'Name of existent category which product belongs to',
  })
  @ApiProperty({
    example: "Children's literature",
    description: 'Name of existent category which product belongs to',
    type: String,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  categoryName: CategoryDto['categoryName'];

  @Field(() => String, {
    description: 'Displayed title of product',
  })
  @ApiProperty({
    example: 'Some poetry book for sale',
    description: 'Displayed title of product',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  title: string;

  @Field(() => Number, {
    description: 'Price of product in unknown currency',
  })
  @ApiProperty({
    example: 100,
    description: 'Price of product in unknown currency',
  })
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  @IsNumber()
  price: number;

  @ApiProperty({
    example: ['https://s3.xxx.com/1.png'],
    type: [String],
    description:
      'Links to product images. The first array entry is the main product image. Array entries may be rearranged by user (action is not implemented).',
  })
  @Field(() => [String], {
    description:
      'Links to product images. The first array entry is the main product image. Array entries may be rearranged by user (action is not implemented).',
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  imageLinks: string[];
}
