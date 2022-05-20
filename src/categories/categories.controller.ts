import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FindCategoryDto } from './dto/find-category.dto';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CategoryDto } from './dto/category.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Creates new category',
    description:
      'Creating the new category you may provide .parentCategoryName (optional)',
  })
  @ApiOkResponse({
    description:
      'Category created. New category is presented into response body',
    type: CategoryDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Category with provided .categoryName already exists',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Incorrect values provided and validation not passed',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Provided .parentCategory does not exist',
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Returns list of existing categories',
    description: `Using optional query params you may get list of categories 
    filtered by the value of any field.
     (for e.g by .parentCategoryName)`,
  })
  @ApiOkResponse({
    description: 'List of found categories',
    type: CategoryDto,
    isArray: true,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Incorrect values provided and validation not passed',
  })
  find(@Query() filterExpression: FindCategoryDto) {
    return this.categoriesService.find(filterExpression);
  }

  @Patch('/:categoryName')
  @ApiOperation({
    summary: 'Updates the existing category by its .categoryName',
  })
  @ApiParam({
    name: 'categoryName',
    type: String,
    description: 'Name of category to update',
  })
  @ApiBody({
    type: UpdateCategoryDto,
  })
  @ApiOkResponse({
    description: 'Updated category',
    type: CategoryDto,
  })
  update(
    @Param('categoryName')
    categoryName: CreateCategoryDto['categoryName'],
    @Body()
    updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(categoryName, updateCategoryDto);
  }

  @Delete('/:categoryName')
  @ApiOperation({
    summary: 'Removes the existing category by its .categoryName',
  })
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'categoryName',
    type: String,
    description: 'Name of category to delete',
  })
  @ApiOkResponse({
    description: 'Removed category',
    type: CategoryDto,
  })
  remove(
    @Param('categoryName') categoryName: CreateCategoryDto['categoryName'],
  ) {
    return this.categoriesService.remove(categoryName);
  }
}
