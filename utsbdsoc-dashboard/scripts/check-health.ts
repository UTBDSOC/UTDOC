const url = process.env.HEALTHCHECK_URL;
const expectedStatus = process.env.HEALTHCHECK_EXPECTED_STATUS ?? "ok";

if (!url) {
  console.error("HEALTHCHECK_URL is missing. Set it to your deployed health endpoint URL.");
  process.exit(1);
}

const response = await fetch(url, {
  method: "GET",
  headers: {
    Accept: "application/json",
  },
});

if (!response.ok) {
  console.error(`Health check failed with status ${response.status}: ${url}`);
  process.exit(1);
}

let payload: unknown = null;
try {
  payload = await response.json();
} catch {
  console.error(`Health check did not return JSON payload: ${url}`);
  process.exit(1);
}

const status = typeof payload === "object" && payload !== null ? (payload as { status?: string }).status : undefined;
if (status !== expectedStatus) {
  console.error(
    `Health check JSON status mismatch. Expected "${expectedStatus}" but received "${String(
      status
    )}". URL: ${url}`
  );
  process.exit(1);
}

console.log(`Health check passed (${response.status}) with status="${status}": ${url}`);

export {};
