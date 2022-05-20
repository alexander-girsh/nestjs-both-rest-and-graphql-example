queries
---
mutation createCategory($category: CreateCategoryDto!) {
  createCategory(createCategoryDto: $category) {
    categoryName
    parentCategoryName
  }
}

mutation createProduct($product: CreateProductDto!) {
  createProduct(createProductDto: $product) {
    categoryName
    title
    price
    imageLinks
  }
}

query listProducts($filterExpression: FindProductDto!) {
  listProducts(findProductDto: $filterExpression) {
    title
    categoryName
    productId
    imageLinks
    category {
      categoryName
      parentCategoryName
    }
  }
}

query listCategories ($filterExpression2: FindCategoryDto!) {
  listCategories(findCategoryDto: $filterExpression2) {
    categoryName
    products {
    	title
      price
      status
    }
  }
}


variables
---
{
  "category": {
    "categoryName": "Books",
    "parentCategoryName": null
  },
  "product": {
    "categoryName": "Books",
    "title": "Some poetry book",
    "price": 100,
    "imageLinks": ["https://s3.lol.xxx.g2/1.png"]
  },
  "filterExpression": {
    
  },
  "filterExpression2": {
    
  }
}