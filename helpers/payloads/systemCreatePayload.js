import { makeid } from "../../utils/index";

export default {
  entity: {
    name: `Data System Procore ${makeid()}`,
    entity_type: "data_system",
    label: "DSS",
    description:
      "Procore is a comprehensive construction management platform that captures detailed daily field activities, including work progress, crew attendance, and material usage. It provides real-time insights into on-site operations and supports accurate daily reporting.",
    owner_person: {
      email: process.env.OWNER_EMAIL || "",
      full_name: process.env.OWNER_USERNAME || "",
    },
  },
  entity_info: {
    owner: process.env.OWNER_EMAIL || "",
    contact_ids: [],
    links: [],
  },
};
