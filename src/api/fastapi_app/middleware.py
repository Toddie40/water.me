# utility to hold the functions to log requests to the database
from fastapi import Request, Response
from .utils.db_conf import database_connection
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
        
        # Create a new request with the cached body so downstream can read it again
        request = Request(request.scope, receive=async_lambda(body))
        
        response = await call_next(request)
        
        # don't log the log requests. It gets a bit silly. Especially since this endpoint gets hammered by the log frontend component.
        if request.url.path != '/log':
            await self.log(request, response, body)
        
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


async def log_function(request: Request, response: Response, body: bytes):
    query = """
    INSERT INTO log (timestamp, endpoint, method, query_params, request_body, response_status, client_ip)
    VALUES (%(timestamp)s, %(endpoint)s, %(method)s, %(query_params)s, %(request_body)s, %(response_status)s, %(client_ip)s);
    """

    try:
        with database_connection() as conn:
            with conn.cursor() as curs:
                curs.execute(
                    query,
                    {
                        'timestamp': datetime.datetime.now(),
                        'endpoint': request.url.path,
                        'method': request.method,
                        'query_params': json.dumps(request.query_params.multi_items()),
                        'request_body': body.decode("utf-8", errors="replace"),  # decode for storage, optional
                        'response_status': response.status_code,
                        'client_ip': request.client.host if request.client else None,
                    },
                )
            conn.commit()
    except Exception as e:
        print(f"error occurred making log entry: {e}")
