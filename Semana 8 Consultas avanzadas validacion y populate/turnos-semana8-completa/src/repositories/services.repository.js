import { ServicesDAO } from "../dao/services.dao.js";
import { asPublicService } from "../utils/serialize.js";

export class ServicesRepository {
  constructor(dao = new ServicesDAO()) {
    this.dao = dao;
  }

  async create(data) {
    const created = await this.dao.create(data);
    return asPublicService(created.toObject ? created.toObject() : created);
  }

  async getById(id) {
    return asPublicService(await this.dao.findById(id));
  }

  async listAll() {
    const items = await this.dao.findAll();
    return items.map(asPublicService);
  }

  async listPaginated(filter, options) {
    const { items, totalDocs } = await this.dao.findPaginated(filter, options);
    return {
      items: items.map(asPublicService),
      totalDocs,
    };
  }

  async updateById(id, data) {
    return asPublicService(await this.dao.updateById(id, data));
  }

  deleteById(id) {
    return this.dao.deleteById(id);
  }
}
