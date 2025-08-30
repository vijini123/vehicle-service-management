import * as Yup from 'yup';

class BookingYup {
    addBooking = Yup.object().shape({
        // email: Yup.string().email().required(),
        name: Yup.string().required(),
        email: Yup.string().required(),
        service: Yup.string().required(),
        date: Yup.date().required(),
        time: Yup.string().required(),
        vehicle: Yup.string().required()
    });

    getBooking = Yup.object().shape({
        id: Yup.string().required()
    });

    deleteBooking = Yup.object().shape({
        id: Yup.string().required()
    });

    updateBooking = Yup.object().shape({
        // id: Yup.string().required(),
        name: Yup.string().required(),
        email: Yup.string().required(),
        service: Yup.string().required(),
        date: Yup.date().required(),
        time: Yup.string().required(),
        vehicle: Yup.string().required()
    });
}

export default new BookingYup();
