from datetime import datetime
from pydantic import BaseModel, conint

        
class SquareBuild(BaseModel):
    date: datetime
    count_houses: int
    no_living_square: int
    apartments: int
    block_of_flats: int

class TransportNetworkWorkload(BaseModel):
    date: datetime
    transport_in_hour: int
    rush_hour: int = conint(ge=1, le=10)
    max_load: int

class WorkloadOnStation(BaseModel):
    date: datetime
    name: str
    passengerflow_mornind: int
    passengerflow_evening: int
    capacity: int

# доделать для получения данных и аналитику
