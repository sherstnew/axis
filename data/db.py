import motor.motor_asyncio
from data.config import REFERENCE

# добавить ссылку в env
cluster = motor.motor_asyncio.AsyncIOMotorClient(REFERENCE)
SquareBuilds = cluster.DriveHack.SquareBuild
TransportNetworkWorkloads = cluster.DriveHack.TransportNetworkWorkload
WorkloadOnStations = cluster.DriveHack.WorkloadOnStation