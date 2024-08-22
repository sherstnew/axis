
from datetime import datetime, timedelta
from data.db import db
import calendar


async def users_per_day(collection: str) -> int:
    collection = db[collection]
    current_time = datetime.now()

    start_of_day = datetime(current_time.year, current_time.month, current_time.day)
    end_of_day = start_of_day + timedelta(days=1)
    
    day = {"date": {"$gt": start_of_day, "$lt": end_of_day}}
    count = await collection.count_documents(day)


    return count

async def users_per_week(collection: str) -> int:
    collection = db[collection]
    current_time = datetime.now()
    current_weekday = current_time.weekday()
    
    start_of_week = current_time - timedelta(days=current_weekday)
    end_of_week = start_of_week + timedelta(days=7)
    
    week = {"data": {"$gt": start_of_week, "$lt": end_of_week}}
    count = await collection.count_documents(week)
    
    return count

async def users_per_mounth(collection: str) -> int:
    collection = db[collection]
    current_time = datetime.now()
    current_day = current_time.day
    count_days_in_mounth = calendar.monthrange(current_time.year, current_time.month)
    
    start_of_mounth = current_day - (current_day - 1)
    end_of_mounth = start_of_mounth + count_days_in_mounth[1] + 1
    
    mounth = {"data": {"$gt": start_of_mounth, "$lt": end_of_mounth}}
    count = await collection.count_documents(mounth)
    
    return count

    
    
    
    