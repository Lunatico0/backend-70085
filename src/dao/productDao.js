import productModel from './models/product.model.js'

class ProductDao {
  async findById(id){
    return await productModel.findById(id);
  }

  async find(query){
    return await productModel.find(query);
  }

  async save(data){
    return await productModel.create(data);
  }

  async update(id, data){
    return await productModel.updateOne({_id: id}, {$set: data});
  }

  async delete(id){
    return await productModel.deleteOne({_id: id});
  }
}

export default new ProductDao();
