import * as mqtt from "mqtt"

const client = mqtt.connect(process.env.BROKER_URL)
console.log(`Broker URL: ${process.env.BROKER_URL}`)

client.on("connect", () => {
    console.log("statistics-service connected to broker")
    client.subscribe("test", (err) => {
      if (!err) {
        client.publish("test", "Hello from statistics-service");
      }
    });
  });

client.on("message", (topic, message) => {
  console.log(`received message: topic ${topic}, message: ${message.toString()}`)
})
