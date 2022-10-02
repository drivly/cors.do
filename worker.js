import { json } from 'https://pkg.do/itty-router-extras'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
  'Access-Control-Max-Age': '86400',
}

export default {
  fetch: req => {
    if (req.method === 'OPTIONS') {
      return handleOptions(req)
    } else {
      handleRequest(req)
    }
  }
}

async function handleRequest(request) {
  const { origin, pathname } = new URL(request.url)

  const target = 'https:/' + pathname

  // Rewrite request to point to API URL. This also makes the request mutable
  // so you can add the correct Origin header to make the API server think
  // that this request is not cross-site.
  request = new Request(target, request);
  request.headers.set('Origin', new URL(target).origin);
  let response = await fetch(request);

  // Recreate the response so you can modify the headers
  response = new Response(response.body, response);

  // Set CORS headers
  response.headers.set('Access-Control-Allow-Origin', url.origin);

  // Append to/Add Vary header so browser will cache response correctly
  response.headers.append('Vary', 'Origin');

  return response;
}

function handleOptions(request) {
  // Make sure the necessary headers are present
  // for this to be a valid pre-flight request
  let headers = request.headers
  if (
    headers.get('Origin') !== null &&
    headers.get('Access-Control-Request-Method') !== null &&
    headers.get('Access-Control-Request-Headers') !== null
  ) {
    // Handle CORS pre-flight request.
    // If you want to check or reject the requested method + headers
    // you can do that here.
    let respHeaders = {
      ...corsHeaders,
      // Allow all future content Request headers to go back to browser
      // such as Authorization (Bearer) or X-Client-Name-Version
      'Access-Control-Allow-Headers': request.headers.get('Access-Control-Request-Headers'),
    }

    return new Response(null, {
      headers: respHeaders,
    })
  } else {
    // Handle standard OPTIONS request.
    // If you want to allow other HTTP Methods, you can do that here.
    return new Response(null, {
      headers: {
        Allow: 'GET, HEAD, POST, OPTIONS',
      },
    })
  }
}
