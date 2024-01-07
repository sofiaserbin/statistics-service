import * as mqtt from "mqtt"
import MqttRequest from "mqtt-request"
import { getMostUsedDentist, getNumberOfAppointmentsThisYear } from "./controllers/v1/user-statistics.js"

const client = mqtt.connect(process.env.BROKER_URL)

MqttRequest.timeout = 5000;

/** @type {MqttRequest}*/
export const mqttReq = new MqttRequest.default(client);

console.log(`Broker URL: ${process.env.BROKER_URL}`)

mqttReq.response("v1/statistics/most-used-dentist/users/read", getMostUsedDentist);
mqttReq.response("v1/statistics/appointments-in-year/users/read", getNumberOfAppointmentsThisYear);

client.on("connect", () => {
    console.log("scheduling-service connected to broker")
});
