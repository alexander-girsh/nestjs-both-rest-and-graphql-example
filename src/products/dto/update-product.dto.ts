import { ProductDto, ProductStatuses } from './product.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Field, InputType } from '@nestjs/graphql';

@InputType('UpdateProductDto', {
  description: 'Is used to update product status',
})
export class UpdateProductDto {
  @ApiProperty({
    type: String,
    example: ProductStatuses.AVAILABLE,
    description: 'New status of product to set',
  })
  @Field(() => String, {
    description: 'New status of product to set',
  })
  readonly status: ProductDto['status'];
}
