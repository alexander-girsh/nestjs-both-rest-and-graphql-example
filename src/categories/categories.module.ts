import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategoriesResolver } from './categories.resolver';
import { CategoriesRepository } from './categories.repository';
import { StorageModule } from '../storage/storage.module';
import { ProductsModule } from '../products/products.module';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesResolver, CategoriesService, CategoriesRepository],
  imports: [ProductsModule, StorageModule],
  exports: [CategoriesService],
})
export class CategoriesModule {}
