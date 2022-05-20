import { forwardRef, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './products.repository';
import { ProductsResolver } from './products.resolver';
import { StorageModule } from '../storage/storage.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  providers: [ProductsResolver, ProductsService, ProductsRepository],
  controllers: [ProductsController],
  imports: [StorageModule, forwardRef(() => CategoriesModule)],
  exports: [ProductsService],
})
export class ProductsModule {}
