import * as Yup from 'yup';

class VehicleYup {
    addVehicle = Yup.object().shape({
        // email: Yup.string().email().required(),
        vehicleType: Yup.string().required(),
        numberPlate:Yup.string().required(),
        frontTyre: Yup.string().required(),
        rearTyre: Yup.string().required(),
        lastServiceDate: Yup.string().required(),
        brand: Yup.string().required(),
        yearOfManufacture: Yup.string().required(),
        mileage: Yup.number().required().min(1),
        fuelType: Yup.string().required(),
        registrationDocument: Yup.string().required(),
        insuranceDocument: Yup.string().required()
    });

    getVehicle = Yup.object().shape({
        id: Yup.string().required()
    });

    deleteVehicle = Yup.object().shape({
        id: Yup.string().required()
    });

    updateVehicle = Yup.object().shape({
        // id: Yup.string().required(),
        email: Yup.string().email().required(),
        vehicleType: Yup.string().required(),
        numberPlate:Yup.string().required(),
        frontTyre: Yup.string().required(),
        rearTyre: Yup.string().required(),
        lastServiceDate: Yup.string().required(),
        brand: Yup.string().required(),
        yearOfManufacture: Yup.string().required(),
        mileage: Yup.number().required().min(1),
        fuelType: Yup.string().required(),
        registrationDocument: Yup.string().required(),
        insuranceDocument: Yup.string().required()
    });
}

export default new VehicleYup();
