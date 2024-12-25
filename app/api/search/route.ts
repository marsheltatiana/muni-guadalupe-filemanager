import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    const SUPERSEARCH_ENDPOINT = process.env.SUPERSEARCH_ENDPOINT;

    if (!SUPERSEARCH_ENDPOINT) {
      return NextResponse.json(
        { error: "Super Search Endpoint isn't available" },
        { status: 500 }
      );
    }

    const request = {
      "query": query,
      "top_k": 5,
    }

    const response = await fetch(SUPERSEARCH_ENDPOINT, {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    console.log(data)

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `Internal Server Error : ${error}` },
      { status: 500 }
    );
  }
}
