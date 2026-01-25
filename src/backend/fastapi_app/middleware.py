# utility to hold the functions to log requests to the database
from fastapi import Request, Response
from .utils.db_conf import get_session
from .models.log import Log
import datetime
from starlette.middleware.base import BaseHTTPMiddleware
import json

# this is the middleware that will intercept any api requests and log them to the db for us.
class LoggingMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, log_function):
        super().__init__(app)
        self.log = log_function

    async def dispatch(self, request: Request, call_next):
        # Read the body before passing the request on
        body = await request.body()
        form = await request.form()

        # Create a new request with the cached body so downstream can read it again
        request = Request(request.scope, receive=async_lambda(body))
        
        response = await call_next(request)
        
        # don't log the log requests. It gets a bit silly. Especially since this endpoint gets hammered by the log frontend component.
        if request.url.path != '/log':
            await self.log(request, response, body, form)
        
        return response


async def async_lambda(body):
    # Helper to wrap body bytes into an awaitable receive function
    # that mimics Starlette's receive interface.
    more_body = True

    async def receive():
        nonlocal body, more_body
        if more_body:
            more_body = False
            return {"type": "http.request", "body": body}
        else:
            return {"type": "http.request", "body": b""}
    
    return receive


async def log_function(request: Request, response: Response, body: bytes, form: bytes):
    query = """
    INSERT INTO log (timestamp, endpoint, method, query_params, request_body, response_status, client_ip)
    VALUES (%(timestamp)s, %(endpoint)s, %(method)s, %(query_params)s, %(request_body)s, %(response_status)s, %(client_ip)s);
    """

    content_type = request.headers.get("content-type","")
    print(f"received Content type: {content_type}")
    if "multipart/form-data" in content_type:
        print("Processing form data...")
        filtered_data = {}

        for key, value in form.items():
            # Check if value is a file upload (starlette's UploadFile)
            if hasattr(value, "filename") and value.filename:
                filtered_data[key] = f"<{value.content_type} file excluded>"
            else:
                filtered_data[key] = value

        request_body = json.dumps(filtered_data)
    else:
        request_body = body.decode("utf-8", errors="replace")

    log = Log(
        timestamp = datetime.datetime.now(),
        endpoint = request.url.path,
        method = request.method,
        query_params = json.dumps(request.query_params.multi_items()),
        request_body = request_body,  # decode for storage, optional
        response_status = response.status_code,
        client_ip = request.client.host if request.client else None,
    )

    try:
        with get_session() as session:
            session.add(log)
            session.commit()
    except Exception as e:
        print(f"error occurred making log entry: {e}")
