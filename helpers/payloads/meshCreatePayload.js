import { makeid } from "../../utils/index";

export default {
  entity: {
    name: `QA Test Mesh ${makeid()}`,
    entity_type: "mesh",
    label: "MSH",
    description:
      "Construction project data mesh with synthetic demo data for testing and demonstration",
    purpose: "Demo and testing of construction data workflows and analytics",
    assignees: [
      {
        email: process.env.OWNER_EMAIL || "qa@example.com",
        full_name: process.env.OWNER_NAME || "QA User",
        role: "Owner",
      },
    ],
    security_policy: [],
  },
  entity_info: {
    owner: process.env.OWNER_EMAIL || "qa@example.com",
    contact_ids: [],
    links: [],
  },
};
