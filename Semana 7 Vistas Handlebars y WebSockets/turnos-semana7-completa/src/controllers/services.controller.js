import { ServiceManager } from "../managers/ServiceManager.js";
import { emitServicesUpdated } from "../config/socket.js";

const serviceManager = new ServiceManager();

export const getServices = async (req, res) => {
  try {
    const services = await serviceManager.getServices();
    res.status(200).json({ status: "success", payload: services });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al obtener los servicios" });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const { sid } = req.params;
    const service = await serviceManager.getServiceById(Number(sid));

    if (!service) {
      return res.status(404).json({
        status: "error",
        message: "Servicio no encontrado",
      });
    }

    res.status(200).json({ status: "success", payload: service });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al obtener el servicio" });
  }
};

export const createService = async (req, res) => {
  try {
    const service = await serviceManager.addService(req.body);
    await emitServicesUpdated();
    res.status(201).json({ status: "success", payload: service });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const { sid } = req.params;
    const service = await serviceManager.updateService(Number(sid), req.body);

    if (!service) {
      return res.status(404).json({
        status: "error",
        message: "Servicio no encontrado",
      });
    }

    await emitServicesUpdated();
    res.status(200).json({ status: "success", payload: service });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { sid } = req.params;
    const deleted = await serviceManager.deleteService(Number(sid));

    if (!deleted) {
      return res.status(404).json({
        status: "error",
        message: "Servicio no encontrado",
      });
    }

    await emitServicesUpdated();
    res.status(200).json({ status: "success", message: "Servicio eliminado" });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al eliminar el servicio" });
  }
};
