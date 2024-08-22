from fastapi import APIRouter
from data.db import SquareBuilds, TransportNetworkWorkloads, WorkloadOnStations
from data.models import SquareBuild, TransportNetworkWorkload, WorkloadOnStation



router = APIRouter()

@router.post("/")
async def create_SquareBuild(new_SquareBuild: SquareBuild, new_TransportNetworkWorkload: TransportNetworkWorkload, new_WorkloadOnStation: WorkloadOnStation):
    new1 = SquareBuilds.insert_one(dict(new_SquareBuild))
    new2 = TransportNetworkWorkloads.insert_one(dict(new_TransportNetworkWorkload))
    new3 = WorkloadOnStations.insert_one(dict(new_WorkloadOnStation))
    return "succesfull :)"

# @router.get("/h")
# async def analytics():
#     pass