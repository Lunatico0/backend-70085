import productRepository from "../repository/productRepository.js";

class productService{
  async createProduct(data){
    return await productRepository.createProduct(data);
  };

  async getProductById(id){
    return await productRepository.getProductById(id);
  }

  async getProduct(query){
    return await productRepository.getProducts(query);
  }

  async updateProduct(id, data){
    return await productRepository.updateProduct(id, data);
  };

  async delete(id){
    return await productRepository.delete(id);
  }
}

export default new productService();
