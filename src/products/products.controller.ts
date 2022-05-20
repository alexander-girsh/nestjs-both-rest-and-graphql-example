import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductDto } from './dto/product.dto';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Creates new draft product',
    description: '',
  })
  @ApiOkResponse({
    description: 'Product created',
    type: ProductDto,
  })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Returns list of existing products',
    description: `Using optional query params you may get list of products 
    filtered by the value of any field.
     (for e.g by .categoryName)`,
  })
  @ApiOkResponse({
    description: 'List of found products',
    type: ProductDto,
    isArray: true,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Incorrect values provided and validation not passed',
  })
  find(@Query() filterExpression: Partial<ProductDto>) {
    return this.productsService.find(filterExpression);
  }

  @Patch('/:productId')
  @ApiOperation({
    summary: 'Updates the existing product by its .productId',
  })
  @ApiParam({
    name: 'productId',
    type: String,
    description: 'Unique identifier of product to update',
  })
  @ApiBody({
    type: UpdateProductDto,
    description: `Product fields to update`,
  })
  @ApiOkResponse({
    description: 'New product state',
    type: ProductDto,
  })
  update(
    @Param('productId')
    productId: ProductDto['productId'],
    @Body()
    updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(productId, updateProductDto);
  }
}
