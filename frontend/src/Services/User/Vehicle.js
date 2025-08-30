import axios from "axios";
import BaseService from "../Base/BaseService";

class VehicleService {
    constructor() {
        BaseService.getBaseURL();
        this.GET_VEHICLE = "vehicle/getVehicle";
        this.GET_ALL_VEHICLES = "vehicle/getAllVehicles";
        this.ADD_VEHICLE = "vehicle/addVehicle";
        this.UPDATE_VEHICLE = "vehicle/updateVehicle";
        this.DELETE_VEHICLE = "vehicle/deleteVehicle";
    }

    getAllVehicles(email) {
        let data = {
            email
        };
        return axios.post(this.GET_ALL_VEHICLES, data, BaseService.getHeader());
    }

    getVehicle(id) {
        let data = {
            id: id
        };
        return axios.post(this.GET_VEHICLE, data, BaseService.getHeader());
    }

    addVehicle(email, input) {
        let data = {
            email: email,
            vehicleType: input.vehicleType,
            numberPlate: input.numberPlate,
            frontTyre: input.frontTyre,
            rearTyre: input.rearTyre,
            lastServiceDate: input.lastServiceDate,
            brand: input.brand,
            yearOfManufacture:input.yearOfManufacture,
            mileage: input.mileage,
            fuelType: input.fuelType,
            registrationDocument: input.registrationDocument,
            insuranceDocument: input.insuranceDocument
        };
        console.log(data);
        return axios.post(this.ADD_VEHICLE, data, BaseService.getHeader());
    }

    updateVehicle(id, input) {
        let data = {
            id: id,
            email: input.email,
            vehicleType: input.vehicleType,
            numberPlate: input.numberPlate,
            frontTyre: input.frontTyre,
            rearTyre: input.rearTyre,
            lastServiceDate: input.lastServiceDate,
            brand: input.brand,
            yearOfManufacture:input.yearOfManufacture,
            mileage: input.mileage,
            fuelType: input.fuelType,
            registrationDocument: input.registrationDocument,
            insuranceDocument: input.insuranceDocument
        };
        return axios.put(this.UPDATE_VEHICLE, data, BaseService.getHeader());
    }

    deleteVehicle(id) {
        let data = {
            id: id
        };
        return axios.delete(this.DELETE_VEHICLE, { ...BaseService.getHeader(), data: data });
    }
}

export default VehicleService = new VehicleService();
