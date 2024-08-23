from engine.engine import Engine
from data.models import SquareBuild, TransportNetworkWorkload, WorkloadOnStation



async def analytics(road_location):
    engine = Engine()   
    response_data_SquareBuild = await SquareBuild.find_all().to_list() 
    response_data_TransportNetworkWorkload = await TransportNetworkWorkload.find_all().to_list()
    response_data_WorkloadOnStation = await WorkloadOnStation.find_all().to_list()
    
    
    # response_data_RegionParams = await RegionParams.find_all().to_list()
    
        
    engine.recalc_all_traffic([response_data_SquareBuild], [response_data_TransportNetworkWorkload], [response_data_WorkloadOnStation], [road_location], (0.57, 0.70, 0.8, 1.2, 0.1, 0.35))
 