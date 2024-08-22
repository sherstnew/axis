import motor.motor_asyncio
from data.config import REFERENCE


cluster = motor.motor_asyncio.AsyncIOMotorClient(REFERENCE)
db = cluster["DriveHack"]

SquareBuilds = db["SquareBuild"]
WorkloadOnStations = db["WorkloadOnStations"]
TransportNetworkWorkloads = db["TransportNetworkWorkloads"]
# SquareBuilds = cluster.DriveHack.SquareBuild
# TransportNetworkWorkloads = cluster.DriveHack.TransportNetworkWorkload
# WorkloadOnStations = cluster.DriveHack.WorkloadOnStation