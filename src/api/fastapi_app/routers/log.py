from fastapi import APIRouter, HTTPException
from sqlmodel import select
from ..utils.db_conf import get_session
from ..models.log import Log, LogResponse

router = APIRouter()

@router.get("/log", response_model=LogResponse, tags=['Log'])
def get_logs(lines_per_page: int, page_no: int):

    # return the latest logs according to the line per page and the current page no
    # logs are returned in reverse chronological order for the time being. 
    query = f"""
    SELECT id, timestamp, endpoint, method, query_params, request_body, response_status, client_ip
    FROM log
    ORDER BY timestamp DESC
    LIMIT {lines_per_page}
    OFFSET {page_no - 1} * {lines_per_page};
    """

    limit=lines_per_page
    offset=(page_no - 1) * lines_per_page

    try:
        with get_session() as session:
            statement = select(Log).order_by(Log.timestamp.desc()).offset(offset).limit(limit)
            log_items = session.exec(statement)
            # get total log count to send with response for pagination
            count = int(session.query(Log).count())

            return LogResponse(items = log_items, total = count)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unable to access logs. Error: {e}")