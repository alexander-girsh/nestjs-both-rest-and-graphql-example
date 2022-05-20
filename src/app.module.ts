import { forwardRef, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { GraphqlModule } from './graphql/graphql.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [forwardRef(() => CategoriesModule), ProductsModule, GraphqlModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [CategoriesModule, ProductsModule],
})
export class AppModule {}
