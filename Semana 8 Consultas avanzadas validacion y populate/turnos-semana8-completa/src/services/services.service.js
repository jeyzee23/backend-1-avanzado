import { ServicesRepository } from "../repositories/services.repository.js";
import { HttpError } from "../utils/http-error.js";
import {
  buildPagination,
  buildPageMetadata,
  buildServiceFilter,
  buildSort,
} from "../utils/service-query.js";

export class ServicesService {
  constructor(repository = new ServicesRepository()) {
    this.repository = repository;
  }

  // Zod ya validó la query. Acá solo se traduce a algo que Mongo entienda
  // y se arma el JSON con payload + metadata de páginas.
  async list(query = {}) {
    const filter = buildServiceFilter(query); // { category, available } o {}
    const sort = buildSort(query); // { price: 1 } / { price: -1 } / etc.
    const { page, limit, skip } = buildPagination(query); // skip = (page - 1) * limit
    const { items, totalDocs } = await this.repository.listPaginated(filter, {
      skip,
      limit,
      sort,
    });

    return {
      payload: items,
      ...buildPageMetadata({
        totalDocs,
        page,
        limit,
        query,
      }),
    };
  }

  listAll() {
    return this.repository.listAll();
  }

  async getById(id) {
    const service = await this.repository.getById(id);
    if (!service) {
      throw new HttpError(404, "Servicio no encontrado");
    }
    return service;
  }

  create(data) {
    return this.repository.create(data);
  }

  async update(id, data) {
    const service = await this.repository.updateById(id, data);
    if (!service) {
      throw new HttpError(404, "Servicio no encontrado");
    }
    return service;
  }

  async remove(id) {
    const deleted = await this.repository.deleteById(id);
    if (!deleted) {
      throw new HttpError(404, "Servicio no encontrado");
    }
    return true;
  }
}
