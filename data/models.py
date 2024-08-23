from datetime import datetime
from pydantic import conint
from beanie import Document

class DatedDocument(Document):
    date: datetime = datetime.now()
    
        
class SquareBuild(DatedDocument):
    count_houses: int
    no_living_square: int
    apartments: int
    block_of_flats: int
    
    coordinates: list[float]
    # сделать зависимость от WorkloadOnStation
    neeres_stations: list[str]
    # сделать зависимость от TransportNetworkWorkload
    roads: list[str]
    
    class Settings:
        name = "SquareBuild"
        
    class Config:
        json_schema_extra = {
            "example": {
                "date": datetime.now(),
                "count_houses": 0,
                "no_living_square": 100,
                "apartments": 50,
                "block_of_flats": 50,
                "coordinates": [59.851393, 30.301184],
                "neeres_stations": ["Rimskay", "Ilich Square"],
                "roads": ["Enthusiasts Higway", "MKAD"]
            }
        }

class TransportNetworkWorkload(DatedDocument):
    transport_in_hour: int
    rush_hour: int = conint(ge=1, le=10)
    max_load: int
    road_location: list[int]
    
    class Settings:
        name = "TransportNetworkWorkload"
        
        
    class Config:
        json_schema_extra = {
            "example": {
                "date": datetime.now(),
                "transport_in_hour": 40,
                "rush_hour": 4,
                "max_load": 50,
                "road_location":[8, 10]
            }
        }

class WorkloadOnStation(DatedDocument):
    name: str
    passengerflow_mornind: int
    passengerflow_evening: int
    capacity: int
    
    class Settings:
        name = "WorkloadOnStation"
    
    class Config:
        json_schema_extra = {
            "example": {
                "date": datetime.now(),
                "name": "Rimskay",
                "passengerflow_mornind": 16000,
                "passengerflow_evening": 13000,
                "capacity": 18000
            }
        }
# class RegionParams(DatedDocument):
#     percent_of_working_people: float
#     public_transport_usage: float
#     traffic_to_center: float
#     personal_transport_passenger_rate: float
#     road_percent_living_load: float
#     road_percent_working_load: float
    
#     class Settings:
#         name = "RegionParams"
#     class Config:
#         json_schema_extra = {
#             "example": {
#                 "date": datetime.now(),
#                 "percent_of_working_people": 9.2,
#                 "public_transport_usage": 2.2,
#                 "traffic_to_center": 1.1,
#                 "personal_transport_passenger_rate": 6.6,
#                 "road_percent_living_load": 3.3,
#                 "road_percent_working_load": 5.5
#             }
#         }    
# доделать для получения данных и аналитику
