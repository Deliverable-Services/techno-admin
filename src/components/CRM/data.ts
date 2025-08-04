// components/CRM/data.ts



import { Task } from "./types";

export const initialTasks: Task[] = [
  {
    id: "1",
    ticketId: "NUC-344",
    title: "Optimize experience for mobile web",
    description: "On mobile, pages load slowly when network is weak. Need to implement skeleton loaders and reduce bundle size.",
    status: "TODO",
    tags: ["BILLING"],
    comments: [],
  },
  {
    id: "2",
    ticketId: "NUC-342",
    title: "Fast trip search",
    description: "Improve search algorithm and caching for faster results.",
    status: "IN_PROGRESS",
    tags: ["ACCOUNTS"],
    comments: [],
  },
  {
    id: "3",
    ticketId: "NUC-367",
    title: "Revise and streamline booking flow",
    description: "Reevaluate the booking UX and remove redundant steps.",
    status: "IN_REVIEW",
    tags: ["ACCOUNTS"],
    comments: [],
  },
  {
    id: "4",
    ticketId: "NUC-340",
    title: "High outage: Software bug fix",
    description: "Patch and test the issue causing periodic system outages.",
    status: "DONE",
    tags: ["BILLING"],
    comments: [],
  },
  {
    id: "5",
    ticketId: "NUC-360",
    title: "Onboard workout options (OWO)",
    description: "Add new vendor workout plans to the catalog.",
    status: "TODO",
    tags: ["ACCOUNTS"],
    comments: [],
  },
  {
    id: "6",
    ticketId: "NUC-341",
    title: "Shopping cart purchasing error",
    description: "Resolve bug that prevents purchase in multi-item cart.",
    status: "IN_PROGRESS",
    tags: ["FORMS"],
    comments: [],
  },
   {
    id: "7",
    ticketId: "NUC-334",
    title: "Internal code error",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eu felis diam. Curabitur maximus sapien ut hendrerit rutrum. Aliquam ullamcorper auctor odio vel gravida. Donec eu risus ut mi sagittis rutrum. Nullam eleifend, nibh quis tincidunt tincidunt, ipsum justo fringilla erat, ut vehicula tortor lacus id augue. Donec eget enim id diam pharetra tempus ut vitae sem. Morbi ultrices posuere consequat.",
    status: "DONE",
    tags: ["FORMS"],
    comments: [],
  },
];