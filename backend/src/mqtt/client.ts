import mqtt from "mqtt";

export const createMqttClient = () => {
  const url = process.env.MQTT_URL ?? "mqtt://localhost:1883";
  const client = mqtt.connect(url);

  client.on("connect", () => {
    console.log("MQTT client connected to", url);
  });

  client.on("error", (err) => {
    console.error("MQTT error", err.message);
  });

  return client;
};
