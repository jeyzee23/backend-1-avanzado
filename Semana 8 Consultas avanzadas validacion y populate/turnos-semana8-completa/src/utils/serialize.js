const asId = (value) => {
  if (value == null) return value;
  return String(value);
};

export const asPublicService = (doc) => {
  if (!doc) return null;

  return {
    _id: asId(doc._id),
    id: asId(doc._id),
    name: doc.name,
    description: doc.description,
    duration: doc.duration,
    price: doc.price,
    category: doc.category,
    available: doc.available,
  };
};

const asPublicServiceRef = (service) => {
  if (service == null) return service;
  if (typeof service === "object" && service.name) {
    return asPublicService(service);
  }
  return asId(service);
};

export const asPublicBooking = (doc) => {
  if (!doc) return null;

  return {
    _id: asId(doc._id),
    id: asId(doc._id),
    clientName: doc.clientName,
    clientEmail: doc.clientEmail,
    date: doc.date,
    time: doc.time,
    status: doc.status,
    services: (doc.services || []).map((item) => ({
      service: asPublicServiceRef(item.service),
      quantity: item.quantity,
    })),
  };
};
