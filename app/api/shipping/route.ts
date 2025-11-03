export async function POST(req: Request) {
  console.log(req, "req");
  // const body = await req.json();
  // console.log(body, " --- REQUEST BODY IN SHIPPING ROUTE");
  // handle input
  // call external API (google maps address validation api)
  // handle output

  //
  return new Response(
    JSON.stringify({ message: "Address validation not yet implemented" }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
