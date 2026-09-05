import { ServiceModel } from "../models/service.model.js";

export class ServicesDAO {
  create(data) {
    return ServiceModel.create(data);
  }

  findById(id) {
    return ServiceModel.findById(id).lean();
  }

  findAll() {
    return ServiceModel.find().sort({ name: 1 }).lean();
  }

  // Mongo aplica la cadena EN ORDEN:
  //   find(filter)  → qué docs (category, available). {} = todos.
  //   sort(sort)    → en qué orden ({ price: 1 } o { price: -1 })
  //   skip(skip)    → cuántos saltear. Página 1 → 0. Página 2 con limit 5 → 5.
  //   limit(limit)  → cuántos devolver después del skip.
  //   lean()        → objetos JS planos, no documentos Mongoose (más liviano).
  //
  // countDocuments usa el MISMO filter, pero no skip/limit:
  // cuenta todos los que matchean, para armar "página 2 de 3".
  async findPaginated(filter, { skip, limit, sort }) {
    const [items, totalDocs] = await Promise.all([
      ServiceModel.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      ServiceModel.countDocuments(filter),
    ]);

    return { items, totalDocs };
  }

  updateById(id, data) {
    return ServiceModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
  }

  async deleteById(id) {
    const deleted = await ServiceModel.findByIdAndDelete(id);
    return Boolean(deleted);
  }
}
