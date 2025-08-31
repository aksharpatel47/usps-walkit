import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { getAddress } from "./usps.js";
const app = new Hono();
app.get("/address", (c) => {
    const queryParams = c.req.query();
    return getAddress(queryParams);
});
serve({
    fetch: app.fetch,
    port: 3000,
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
});
