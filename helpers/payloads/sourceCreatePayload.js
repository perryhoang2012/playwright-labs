import { makeid } from "../../utils/index";

export default {
  entity: {
    name: `Data Source Field daily logs ${makeid()}`,
    entity_type: "origin",
    label: "SCD",
    description:
      "Mobile app-generated logs capturing comprehensive daily field activities, including work progress, crew attendance, and various on-site operations.",
  },
  entity_info: {
    owner: process.env.OWNER_EMAIL || "",
    contact_ids: [],
    links: [],
  },
};
