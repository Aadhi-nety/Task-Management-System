// backend/src/repositories/BaseRepository.js
export class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    try {
      const document = new this.model(data);
      return await document.save();
    } catch (error) {
      throw new Error(`Error creating document: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw new Error(`Error finding document by ID: ${error.message}`);
    }
  }

  async find(filter = {}, options = {}) {
    try {
      let query = this.model.find(filter);
      
      if (options.populate) {
        query = query.populate(options.populate);
      }
      
      if (options.sort) {
        query = query.sort(options.sort);
      }
      
      return await query.exec();
    } catch (error) {
      throw new Error(`Error finding documents: ${error.message}`);
    }
  }

  async update(id, data) {
    try {
      return await this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    } catch (error) {
      throw new Error(`Error updating document: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error deleting document: ${error.message}`);
    }
  }
}