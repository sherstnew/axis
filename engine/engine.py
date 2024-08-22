from engine.data_interfaces import SquareBuild, TransportNetworkWorkload, WorkloadOnStation


class Engine:
    def recalc_all_traffic(
            self,
            construction_areas: list[SquareBuild],
            all_public_transport_stations: list[WorkloadOnStation],
            all_roads_traffic: list[TransportNetworkWorkload],
            region_params: (int, int, int, int)
    ) -> (list, list):
        new_people = self._calc_new_people(construction_areas)
        new_road_traffic_count, new_public_transport_traffic_count = \
            self._implement_region_params(new_people, *region_params)
        public_transport_statistics = \
            self.calc_public_traffic(new_public_transport_traffic_count, all_public_transport_stations)
        roads_traffic_statistics = self.calc_roads_traffic(new_road_traffic_count, all_roads_traffic)
        return public_transport_statistics, roads_traffic_statistics

    @staticmethod
    def _calc_new_people(
            construction_areas: list[SquareBuild]
    ) -> int:
        new_people = 0
        for construction_area in construction_areas:
            new_people += construction_area.apartments / 25
            new_people += construction_area.block_of_flats / 45
            new_people += construction_area.no_living_square / 35
        return new_people

    @staticmethod
    def _implement_region_params(
            new_people: int,
            percent_of_working_people: int,
            public_transport_usage: int,
            traffic_to_center: int,
            personal_transport_passenger_rate: int
    ) -> (int, int):
        working_people = new_people * percent_of_working_people
        personal_transport_usage = 1 - public_transport_usage
        max_road_traffic = max(1 - traffic_to_center, traffic_to_center)
        road_traffic_count = working_people * \
                             personal_transport_usage / personal_transport_passenger_rate * max_road_traffic
        public_transport_traffic_count = working_people * public_transport_usage
        return road_traffic_count, public_transport_traffic_count

    def calc_public_traffic(
            self,
            new_public_transport_traffic: int,
            all_public_transport_stations: list[WorkloadOnStation]
    ) -> (list, list):
        morning_public_transport_statistics = []
        morning_public_traffic_percentage = self._get_morning_public_traffic_percentage(all_public_transport_stations)
        for station, morning_percentage in all_public_transport_stations, morning_public_traffic_percentage:
            new_morning_traffic = \
                self._calc_station_traffic(station.passengerflow, new_public_transport_traffic * morning_percentage)
            morning_public_traffic_statistics = self._make_morning_statistics(station, new_morning_traffic)
            morning_public_transport_statistics.append(morning_public_traffic_statistics)

        evening_public_transport_statistics = []
        evening_public_traffic_percentage = self._get_evening_public_traffic_percentage(station)
        for station, evening_percentage in all_public_transport_stations, evening_public_traffic_percentage:
            new_evening_traffic = \
                self._calc_station_traffic(station.passengerflow, new_public_transport_traffic * evening_percentage)
            evening_public_traffic_statistics = self._make_evening_statistics(station, new_evening_traffic)
            evening_public_transport_statistics.append(evening_public_traffic_statistics)

        return morning_public_traffic_statistics, evening_public_traffic_statistics

    @staticmethod
    def _get_morning_public_traffic_percentage(
            stations: list[WorkloadOnStation]
    ) -> list[int]:
        public_traffic_percentage_passengerflow = []
        all_passengerflow = sum(map(lambda x: x.passengerflow_morning, stations))
        for station in stations:
            percentage = station.passengerflow_morning / all_passengerflow
            public_traffic_percentage_passengerflow.append(percentage)
        return public_traffic_percentage_passengerflow

    @staticmethod
    def _get_evening_public_traffic_percentage(
            stations: list[WorkloadOnStation]
    ) -> list[int]:
        public_traffic_percentage_passengerflow = []
        all_passengerflow = sum(map(lambda x: x.passengerflow_evening, stations))
        for station in stations:
            percentage = station.passengerflow_morning / all_passengerflow
            public_traffic_percentage_passengerflow.append(percentage)
        return public_traffic_percentage_passengerflow

    @staticmethod
    def _calc_station_traffic(
            old_traffic: int,
            new_area_traffic: int
    ) -> int:
        new_traffic = old_traffic + new_area_traffic
        return new_traffic

    @staticmethod
    def _make_morning_statistics(
            station: WorkloadOnStation,
            new_morning_traffic: int
    ) -> list[int, int, int]:
        traffic_increase = new_morning_traffic - station.passengerflow_morning
        traffic_percentage = station.passengerflow_morning / station.capacity
        new_traffic_percentage = (traffic_increase + station.passengerflow_morning) / station.capacity
        traffic_percentage_increase = new_traffic_percentage - traffic_percentage
        return [traffic_increase, new_traffic_percentage, traffic_percentage_increase]

    @staticmethod
    def _make_evening_statistics(
            station: WorkloadOnStation,
            new_evening_traffic: int
    ) -> list[int, int, int]:
        traffic_increase = new_evening_traffic - station.passengerflow_evening
        traffic_percentage = station.passengerflow_evening / station.capacity
        new_traffic_percentage = (traffic_increase + station.passengerflow_evening) / station.capacity
        traffic_percentage_increase = new_traffic_percentage - traffic_percentage
        return [traffic_increase, new_traffic_percentage, traffic_percentage_increase]

    def calc_roads_traffic(
            self,
            new_road_transport_traffic: int,
            all_roads: list[TransportNetworkWorkload]
    ) -> list:
        roads_traffic_statistics = []
        roads_traffic_percentage = self._get_road_traffic_percentage(all_roads)
        for road, percentage in all_roads, roads_traffic_percentage:
            new_road_traffic = self._calc_road_traffic(road.transport_in_hour, new_road_transport_traffic * percentage)
            roads_traffic_statistic = self._make_road_traffic_statistics(road, new_road_traffic)
            roads_traffic_statistics.append(roads_traffic_statistic)

        return roads_traffic_statistics

    @staticmethod
    def _get_road_traffic_percentage(
            roads: list[TransportNetworkWorkload]
    ) -> list:
        roads_traffic_percentage = []
        all_roads_traffic = sum(map(lambda x: x.transport_in_hour, roads))
        for road in roads:
            percentage = road.transport_in_hour / all_roads_traffic
            roads_traffic_percentage.append(percentage)
        return roads_traffic_percentage

    @staticmethod
    def _calc_road_traffic(
            old_traffic: int,
            new_area_traffic: int
    ) -> int:
        new_traffic = old_traffic + new_area_traffic
        return new_traffic

    @staticmethod
    def _make_road_traffic_statistics(
            road: TransportNetworkWorkload,
            new_road_traffic: int
    ) -> list[int, int, int]:
        traffic_increase = new_road_traffic - road.transport_in_hour
        traffic_rush_hour = round(road.transport_in_hour / road.max_load, 1) * 10
        new_traffic_rush_hour = round((traffic_increase + road.transport_in_hour) / road.max_load, 1) * 10
        traffic_rush_hour_increase = new_traffic_rush_hour - traffic_rush_hour

        return [traffic_increase, new_traffic_rush_hour, traffic_rush_hour_increase]
