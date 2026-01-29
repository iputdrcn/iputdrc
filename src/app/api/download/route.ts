import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const url = searchParams.get("url");
    const filename = searchParams.get("filename") || "video.mp4";

    if (!url) {
        return new NextResponse("Missing URL", { status: 400 });
    }

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch video: ${response.statusText}`);
        }

        const headers = new Headers(response.headers);
        headers.set("Content-Disposition", `attachment; filename="${filename}"`);
        // Remove headers that might cause issues or are not relevant for the proxied response
        // keeping Content-Length if available is good for progress bars, but dangerous if mismatch
        // Let's pass it if it exists

        return new NextResponse(response.body, {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error("Download error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
