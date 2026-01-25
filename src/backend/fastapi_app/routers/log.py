from fastapi import APIRouter, HTTPException
from sqlmodel import select, func
import logging

from ..utils.db_conf import get_session
from ..models.log import Log, LogResponse

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/log", response_model=LogResponse, tags=['Log'])
def get_logs(lines_per_page: int, page_no: int):

    # return the latest logs according to the line per page and the current page no
    # logs are returned in reverse chronological order for the time being. 
    limit=lines_per_page
    offset=(page_no - 1) * lines_per_page

    try:
        with get_session() as session:
            # Get paginated log items
            log_statement = select(Log).order_by(Log.timestamp.desc()).offset(offset).limit(limit)
            log_items = session.exec(log_statement).all()
            
            # Get total log count using func.count()
            count_statement = select(func.count(Log.id))
            total_count = session.exec(count_statement).one()
            
            return LogResponse(items=log_items, total=total_count)
    except Exception as e:
        logger.critical("Encounted error handling request to /logs. Responding with 500 error.")
        raise HTTPException(status_code=500, detail=f"Unable to access logs. Error: {e}")