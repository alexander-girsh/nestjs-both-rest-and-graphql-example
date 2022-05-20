import { ApiProperty } from '@nestjs/swagger';
import { Field, ObjectType } from '@nestjs/graphql';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsNumberString,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { CategoryDto } from '../../categories/dto/category.dto';

export enum ProductStatuses {
  'DRAFT' = 'DRAFT',
  'DELETED_DRAFT' = 'DELETED_DRAFT',
  'AVAILABLE' = 'AVAILABLE',
  'EXPIRED' = 'EXPIRED',
  'RESERVED' = 'RESERVED',
  'SOLD' = 'SOLD',
  'RETURNED' = 'RETURNED',
  'DELETED' = 'DELETED',
}

/* schema is {<status from>: <status to[]> } */
export const ALLOWED_PRODUCT_STATUS_UPDATES: Record<
  ProductStatuses,
  ProductStatuses[]
> = {
  [ProductStatuses.DRAFT]: [
    ProductStatuses.AVAILABLE,
    ProductStatuses.DELETED_DRAFT,
  ],
  [ProductStatuses.AVAILABLE]: [
    ProductStatuses.DELETED,
    ProductStatuses.EXPIRED,
    ProductStatuses.RESERVED,
  ],
  [ProductStatuses.RESERVED]: [ProductStatuses.AVAILABLE, ProductStatuses.SOLD],
  [ProductStatuses.SOLD]: [ProductStatuses.RETURNED],
  [ProductStatuses.RETURNED]: [ProductStatuses.DRAFT],
  [ProductStatuses.EXPIRED]: [ProductStatuses.AVAILABLE],
  [ProductStatuses.DELETED]: [],
  [ProductStatuses.DELETED_DRAFT]: [],
};

@ObjectType({
  description: 'Full schema of product',
})
export class ProductDto {
  @Field(() => String, {
    description: 'Unique product id (auto-generated string)',
  })
  @ApiProperty({
    example: 105,
    description: 'Unique product id (auto-generated string)',
  })
  @IsNumberString()
  @MinLength(13)
  @MaxLength(13)
  productId: string;

  @Field(() => String, {
    description: 'Name of existent category which product belongs to',
  })
  @ApiProperty({
    example: "Children's literature",
    description: 'Name of existent category which product belongs to',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  categoryName: CategoryDto['categoryName'];

  @Field(() => String, {
    description: 'Displayed title of product. Is required',
  })
  @ApiProperty({
    example: 'Some poetry book for sale',
    description: 'Displayed title of product. Is required',
  })
  @MinLength(2)
  @MaxLength(100)
  title: string;

  @Field(() => String, {
    description: 'Current status of product',
  })
  @ApiProperty({
    enum: ProductStatuses,
    example: ProductStatuses.DRAFT,
    description: 'Current status of product',
  })
  @IsString()
  status: ProductStatuses;

  @Field(() => Number, {
    description: 'Product price in unknown currency',
  })
  @ApiProperty({
    example: 105,
    description: 'Product price in unknown currency',
  })
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  @IsNumber()
  price: number;

  @Field(() => [String], {
    description:
      'Links to product images. The first array entry is the main product image. Array entries may be rearranged by user (action is not implemented).',
  })
  @ApiProperty({
    example: ['https://s3.xxx.com/1.png'],
    type: [String],
    description:
      'Links to product images. The first array entry is the main product image. Array entries may be rearranged by user (action is not implemented).',
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  imageLinks: string[];

  @Field(() => CategoryDto, {
    name: 'category',
    description: 'Full data of category of product. GraphQL only.',
  })
  category: never;
}
