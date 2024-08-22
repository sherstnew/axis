class Engine:
    @staticmethod
    def reculc_all_traffic(
            construction_areas: list[any],
            all_public_transport_stations: list[any],
            all_roads_traffic: list[any],
            region_params: any
    ):
        pass

    @staticmethod
    def implement_region_params(
            percent_of_working_people: int,
            public_transport_usage: int,
            traffic_to_center: int,
            personal_transport_passenger_rate: int
    ):
        pass

    @staticmethod
    def calc_public_traffic(
            new_public_transport_traffic: int,
            all_public_transport_stations: list[any]
    ):
        pass

    @staticmethod
    def get_public_traffic_percentage(
            stations_traffic: list[any]
    ):
        pass

    @staticmethod
    def calc_station_traffic(
            old_traffic: int,
            new_area_traffic: int
    ):
        pass

    @staticmethod
    def calc_roads_traffic(
            new_road_transport_traffic: int,
            all_roads_traffic: list[any]
    ):
        pass

    @staticmethod
    def get_road_traffic_percentage(
            roads_traffic: list[any]
    ):
        pass

    @staticmethod
    def calc_road_traffic(
            old_traffic: int,
            new_area_traffic: int
    ):
        pass
