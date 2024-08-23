from fastapi import APIRouter
from data.models import SquareBuild, TransportNetworkWorkload, WorkloadOnStation#, RegionParams
from handler import users_per_day, users_per_week, users_per_mounth
from engine.engine import Engine
from beanie import PydanticObjectId
from utils import analytics



router = APIRouter()

@router.post("/")
async def create_SquareBuild(new_SquareBuild: SquareBuild, new_TransportNetworkWorkload: TransportNetworkWorkload, new_WorkloadOnStation: WorkloadOnStation) -> dict:
    await new_SquareBuild.create()
    await new_TransportNetworkWorkload.create()
    await new_WorkloadOnStation.create()
    # await new_RegionParams.create()
    return {"messege":"succesfull :)"}

@router.get("/{road_location}")
async def local(id: PydanticObjectId, road_location: str):
    await SquareBuild.get(id)
    # loc = {"roud_location":road_location}
    road_location = [int(x) for x in road_location.split(',')]
    analytics(road_location)
    # return  loc

@router.get("/using_of_day", response_model=None)
async def analyticsD():
    count = await users_per_day(SquareBuild)
    return count

@router.get("/using_of_week", response_model=None)
async def analyticsW():
    count = await users_per_week(SquareBuild)
    return count

@router.get("/using_of_mounth", response_model=None)
async def analyticsM():
    count = await users_per_mounth(SquareBuild)
    return count
