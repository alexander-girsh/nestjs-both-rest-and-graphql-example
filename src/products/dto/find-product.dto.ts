import { ProductDto, ProductStatuses } from './product.dto';
import { Field, InputType, PartialType } from '@nestjs/graphql';

@InputType('FindProductDto')
export class FindProductDto extends PartialType(ProductDto) {
  @Field(() => String, { nullable: true })
  productId: string;

  @Field(() => String, { nullable: true })
  categoryName: string;

  @Field(() => String, { nullable: true })
  title: string;

  @Field(() => Number, { nullable: true })
  price: number;

  @Field(() => String, { nullable: true })
  status: ProductStatuses;
}
