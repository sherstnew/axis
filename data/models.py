from datetime import date
from pydantic import BaseModel, conint

        
class SquareBuild(BaseModel):
    date: date
    count_houses: int
    no_living_square: int
    apartments: int
    block_of_flats: int

class TransportNetworkWorkload(BaseModel):
    date: date
    transport_in_hour: int
    rush_hour: int = conint(ge=1, le=10)

class WorkloadOnStation(BaseModel):
    date: date
    name: str
    passengerflow_mornind: int
    passengerflow_evening: int
    capacity: int

# доделать для получения данных и аналитику
