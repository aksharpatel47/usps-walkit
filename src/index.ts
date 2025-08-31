import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { getAddress } from "./usps.js";

const app = new Hono();

app.get("/address", async (c) => {
  const queryParams = c.req.query();
  const data = await getAddress(queryParams);
  return c.json(data);
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
