import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import * as path from 'path';
import { CategoriesModule } from '../categories/categories.module';
import { ProductsModule } from '../products/products.module';
import { CategoryDto } from '../categories/dto/category.dto';

@Module({
  imports: [
    CategoriesModule,
    ProductsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      include: [CategoryDto, CategoriesModule, ProductsModule],
      driver: ApolloDriver,
      autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
  ],
})
export class GraphqlModule {}
