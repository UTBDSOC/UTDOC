const url = process.env.HEALTHCHECK_URL;

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

console.log(`Health check passed (${response.status}): ${url}`);
