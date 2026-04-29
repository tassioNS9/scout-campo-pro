import { auth } from "../src/lib/auth";

async function main() {
  const email = `direct${Date.now()}@mail.com`;
  const req = new Request("http://localhost:3000/api/auth/sign-up/email", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "http://localhost:3000",
    },
    body: JSON.stringify({
      name: "Direct Test",
      email,
      password: "12345678",
      profileType: "Analista",
    }),
  });

  const res = await auth.handler(req);
  const text = await res.text();
  console.log("status", res.status);
  console.log(text);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
