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
