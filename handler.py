
from datetime import datetime, timedelta
from beanie.operators import And
from data.db import init_db
from data.models import DatedDocument
import calendar


async def users_per_day(collection: DatedDocument) -> int:
    current_time = datetime.now()

    start_of_day = datetime(current_time.year, current_time.month, current_time.day)
    end_of_day = start_of_day + timedelta(days=1)
    
    count = await collection.find(And(collection.date >= start_of_day, collection.date < end_of_day)).count()

    return count

async def users_per_week(collection: DatedDocument) -> int:
    current_time = datetime.now()
    current_weekday = current_time.weekday()
    
    start_of_week = current_time - timedelta(days=current_weekday)
    end_of_week = start_of_week + timedelta(days=7)
    
    # week = {"date": {"$gt": start_of_week, "$lt": end_of_week}}
    # count = await collection.count_documents(week)
    count = await collection.find(And(collection.date >= start_of_week, collection.date < end_of_week)).count()
    
    return count

async def users_per_mounth(collection: DatedDocument) -> int:
    current_time = datetime.now()
    current_day = current_time.day
    count_days_in_mounth = calendar.monthrange(current_time.year, current_time.month)
    
    start_of_mounth = current_day - (current_day - 1)
    end_of_mounth = start_of_mounth + count_days_in_mounth[1] + 1
    
    count = await collection.find(And(collection.date >= start_of_mounth, collection.date < end_of_mounth))
    
    return count

    
    
    
    