// irritating utility function here to expose a client-side accessible api route to the /plant/get/image endpoint on the api so we can use the endpoint as the src for image tags for plants. 

import axios from 'axios';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const plantName = searchParams.get('plantName') ?? '';

  try {
    // Get the image as binary data
    const res = await axios.get(`${process.env.API_ENDPOINT}/plant/get/image/${plantName}`, {
      responseType: 'arraybuffer',
    });

    return new Response(res.data, {
      status: res.status,
      headers: {
        'Content-Type': res.headers['content-type'] || 'image/png',
      },
    });
  } catch (error: any) {
    if (error.response?.status === 404) {
      return new Response(null, { status: 404 });
    }
    return new Response('Unknown error', { status: 500 });
  }
}