import jwt from "jsonwebtoken"
import db from "../../db.js"

export const getMostUsedDentist = payload => {
    payload = JSON.parse(payload);
    const token = jwt.decode(payload.token)

    if (!token) {
        return JSON.stringify({ httpStatus: 401, message: 'Unauthorized' });
    }

    if (`${token.id}` !== `${payload.userId}`) {
        return JSON.stringify({ httpStatus: 403, message: 'You may only check your own statistics on this endpoint.' });
    }

    try {
        const result = db.querySync(`
        select public.user.id, public.user.name, public.user.username, public.user.clinic_id,
            COUNT(*) AS appointment_count
        from
            appointment
        join timeslot ON appointment.timeslot_id = timeslot.id
        join public.user ON timeslot.dentist_id = public.user.id
        where appointment.patient_id = $1
            and EXTRACT(YEAR FROM timeslot.start_time) = EXTRACT(YEAR FROM CURRENT_DATE)
        group by public.user.id
        order by appointment_count DESC
        limit 1;
    
    `, [token.id]);

        return JSON.stringify({ httpStatus: 200, ...result[0] })
    } catch (err) {
        console.log(err)
        return JSON.stringify({ httpStatus: 500, message: "Some error occurred" })
    }

}

export const getNumberOfAppointmentsThisYear = payload => {
    payload = JSON.parse(payload);
    const token = jwt.decode(payload.token)

    if (!token) {
        return JSON.stringify({ httpStatus: 401, message: 'Unauthorized' });
    }

    if (`${token.id}` !== `${payload.userId}`) {
        return JSON.stringify({ httpStatus: 403, message: 'You may only check your own statistics on this endpoint.' });
    }

    try {
        const result = db.querySync(`
        SELECT COUNT(*) FROM public.appointment
        INNER JOIN public.timeslot ON appointment.timeslot_id = timeslot.id
        WHERE appointment.patient_id = $1 AND
        EXTRACT(YEAR FROM timeslot.start_time) = EXTRACT(YEAR FROM CURRENT_DATE)`,
            [token.id]);
        return JSON.stringify({ httpStatus: 200, numberOfAppointments: result[0].count })
    } catch (err) {
        console.log(err)
        return JSON.stringify({ httpStatus: 500, message: "Some error occurred" })
    }
}