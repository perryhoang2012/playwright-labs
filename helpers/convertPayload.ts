import meshCreatePayload from "./payloads/meshCreatePayload";
import sourceCreatePayload from "./payloads/sourceCreatePayload";
import systemCreatePayload from "./payloads/systemCreatePayload";

export default function convertPayload(body: any) {
  let payload;
  switch (body) {
    case "meshCreatePayload":
      payload = meshCreatePayload;
      break;
    case "systemCreatePayload":
      payload = systemCreatePayload;
      break;
    case "sourceCreatePayload":
      payload = sourceCreatePayload;
      break;
    default:
      payload = body || {};
      break;
  }
  return payload;
}
