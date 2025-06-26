import { makeid } from "../utils";

export const meshCreatePayload = {
  entity: {
    name: `QA Test Mesh ${makeid()}`,
    entity_type: "mesh",
    label: "MSH",
    description:
      "Construction project data mesh with synthetic demo data for testing and demonstration",
    purpose: "Demo and testing of construction data workflows and analytics",
    assignees: [
      {
        email: process.env.OWNER_EMAIL || "",
        full_name: process.env.OWNER_NAME || "",
        role: "Owner",
      },
    ],
    security_policy: [],
  },
  entity_info: {
    owner: process.env.OWNER_EMAIL || "",
    contact_ids: [],
    links: [],
  },
};
