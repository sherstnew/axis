from fastapi import APIRouter
from data.db import SquareBuilds, TransportNetworkWorkloads, WorkloadOnStations
from data.models import SquareBuild, TransportNetworkWorkload, WorkloadOnStation
from handler import users_per_day, users_per_week, users_per_mounth



router = APIRouter()

@router.post("/")
async def create_SquareBuild(new_SquareBuild: SquareBuild, new_TransportNetworkWorkload: TransportNetworkWorkload, new_WorkloadOnStation: WorkloadOnStation):
    SquareBuilds.insert_one(dict(new_SquareBuild))
    TransportNetworkWorkloads.insert_one(dict(new_TransportNetworkWorkload))
    WorkloadOnStations.insert_one(dict(new_WorkloadOnStation))
    return "succesfull :)"


@router.get("/hl", response_model=None)
async def analytics():
    count = await users_per_day("SquareBuild")
    return count

@router.get("/hlp", response_model=None)
async def analytics():
    count = await users_per_week("SquareBuild")
    return count

@router.get("/hlpr", response_model=None)
async def analytics():
    count = await users_per_mounth("SquareBuild")
    return count


# @router.get("/h")
# async def analytics():
#     pass