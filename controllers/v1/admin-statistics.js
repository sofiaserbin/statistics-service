import jwt from "jsonwebtoken";
import db from "../../db.js";

export const numberOfSearches = payload => {
    payload = JSON.parse(payload);
    const token = jwt.decode(payload.token)

    if (!token) {
        return JSON.stringify({ httpStatus: 401, message: 'Unauthorized' });
    }

    if (token.role !== 'admin') {
        return JSON.stringify({ httpStatus: 403, message: 'Forbidden' });
    }

    try {
        const result = db.querySync(`
        select count(*)
        from "logs"
        where "timestamp" >= now() - interval '5 minutes' and "topic" like 'v1/timeslots/read/@request%';
`);
        return JSON.stringify({ httpStatus: 200, searches: result[0].count })
    } catch (err) {
        console.log(err)
        return JSON.stringify({ httpStatus: 500, message: "Some error occurred" })
    }

}

export const numberOfTimeslotsAvailable = payload => {
    payload = JSON.parse(payload);
    const token = jwt.decode(payload.token)

    if (!token) {
        return JSON.stringify({ httpStatus: 401, message: 'Unauthorized' });
    }
    if (token.role !== 'admin') {
        return JSON.stringify({ httpStatus: 403, message: 'Forbidden' });
    }

    try {
        // all timeslots that are not booked or cancelled
        const result = db.querySync(`
            select count(*)
            from "timeslot"
            left join "appointment" on "timeslot".id = "appointment".timeslot_id
            where "appointment".timeslot_id is null or "appointment"."cancelled" = true`
        );
        return JSON.stringify({ httpStatus: 200, timeslots: result[0].count })
    } catch (err) {
        console.log(err)
        return JSON.stringify({ httpStatus: 500, message: "Some error occurred" })
    }
}