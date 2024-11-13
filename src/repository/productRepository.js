import productDao from "../dao/productDao.js";

class productRepository{
  async createProduct(data){
    return await productDao.save(data);
  };

  async getProductById(id){
    return await productDao.findById(id);
  };

  async getProducts(query){
    return await productDao.find(query);
  };

  async updateProduct(id, data){
    return await productDao.update(id, data);
  };

  async delete(id){
    return await productDao.delete(id);
  };
};

export default new productRepository();
