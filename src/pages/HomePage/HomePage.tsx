import styles from "./HomePage.module.scss";
import { Layout } from "../../components/Layout/Layout";
import { useEffect, useRef, useState } from "react";
import { TextInput, Button, Icon, Select, Label } from "@gravity-ui/uikit";
import { Plus, TrashBin, MathOperations } from "@gravity-ui/icons";
import { Station } from "../../static/types/Station";
import { Polygon } from "../../static/types/Polygon";
import { renderToString } from "react-dom/server";
import { Street } from "../../static/types/Street";
import { Result } from "../../static/types/Result";

declare const ymaps: any;

const defaultPoints: [number, number][] = [
  [55.74656, 37.680364],
  [55.751411, 37.685987],
  [55.753643, 37.673654],
  [55.750167, 37.670645],
];

export const HomePage = () => {
  const [results, setResults] = useState<Result>();

  const stationRef = useRef(null);
  const streetRef = useRef(null);

  const [map, setMap] = useState<any>(null);

  const [stations, setStations] = useState<Station[]>([]);
  const [streets, setStreets] = useState<Street[]>([]);

  const [polygons, setPolygons] = useState<Polygon[]>([
    {
      name: "Полигон 1",
      points: defaultPoints,
    },
  ]);

  const [currentPolygon, setCurrentPolygon] = useState(0);

  const [apartments, setApartments] = useState(0);
  const [blocks, setBlocks] = useState(0);
  const [noLiving, setNoLiving] = useState(0);
  const [countHouses, setCountHouses] = useState(0);

  const [newName, setNewName] = useState("");

  function init() {
    const myMap = new ymaps.Map(
      "map",
      {
        center: [55.74966820000001, 37.678202799999994],
        zoom: 15,
        controls: [],
      },
      {
        searchControlProvider: "yandex#search",
      }
    );

    myMap.events.add(["dblclick"], function (event: any) {
      const placemark = new ymaps.Placemark(event.get("coords"), {
        balloonContentBody: renderToString(
          <div className={styles.balloon}>
            <select defaultValue="station" id="select">
              <option value="station">Станция</option>
              <option value="street">Улица</option>
            </select>
            <header className={styles.balloon_header}>Создать объект</header>
            <input
              type="text"
              placeholder="Название"
              className={styles.input}
              defaultValue={""}
              onChange={(evt) => setNewName(evt.target.value)}
              id="name"
            />
          </div>
        ),
        hintContent: "Создать улицу",
      });

      myMap.geoObjects.add(placemark);
      placemark.balloon.open();
      placemark.events.add(["balloonclose"], function () {
        myMap.geoObjects.remove(placemark);
      });
      placemark.balloon.events.add(["dblclick"], function () {
        alert("Объект успешно добавлен!");
        createObject(
          myMap,
          placemark,
          (document.querySelector("#name") as any).value ?? "",
          placemark.geometry.getCoordinates(),
          (document.querySelector("#select") as any).value ?? ""
        );
      });
    });
    setMap(myMap);
  }

  // init map
  useEffect(() => {
    // setStations([
    //   {
    //     name: "Станция Серп и Молот",
    //     coords: [55.748078, 37.682548],
    //     id: 0,
    //     capacity: 100,
    //     flowMorning: 100,
    //     flowEvening: 100,
    //   },
    //   {
    //     name: "Метро Площадь Ильича",
    //     coords: [55.74711, 37.68155],
    //     id: 1,
    //     capacity: 100,
    //     flowMorning: 100,
    //     flowEvening: 100,
    //   },
    //   {
    //     name: "Метро Римская",
    //     coords: [55.746233, 37.681245],
    //     id: 2,
    //     capacity: 100,
    //     flowMorning: 100,
    //     flowEvening: 100,
    //   },
    //   {
    //     name: "Станция Москва-Товарная",
    //     coords: [55.745656, 37.688315],
    //     id: 3,
    //     capacity: 100,
    //     flowMorning: 100,
    //     flowEvening: 100,
    //   },
    //   {
    //     name: "Станция Курская",
    //     coords: [55.757992, 37.66221],
    //     id: 4,
    //     capacity: 100,
    //     flowMorning: 100,
    //     flowEvening: 100,
    //   },
    // ]);
    // setStreets([
    //   {
    //     id: 0,
    //     name: "Волочаевская улица",
    //     coords: [55.754041, 37.679888],
    //     transport_in_hour: 0,
    //     rush_hour: 1,
    //     max_load: 0,
    //   },
    //   {
    //     id: 1,
    //     name: "Строгановский проезд",
    //     coords: [55.753174, 37.676232],
    //     transport_in_hour: 0,
    //     rush_hour: 1,
    //     max_load: 0,
    //   },
    //   {
    //     id: 2,
    //     name: "Средний Золоторожский переулок",
    //     coords: [55.749106, 37.679385],
    //     transport_in_hour: 0,
    //     rush_hour: 1,
    //     max_load: 0,
    //   },
    //   {
    //     id: 3,
    //     name: "Золоторожская улица",
    //     coords: [55.750317, 37.673825],
    //     transport_in_hour: 0,
    //     rush_hour: 1,
    //     max_load: 0,
    //   },
    //   {
    //     id: 4,
    //     name: "Верхний Золоторожский переулок",
    //     coords: [55.750292, 37.679897],
    //     transport_in_hour: 0,
    //     rush_hour: 1,
    //     max_load: 0,
    //   },
    // ]);
    if (!map) {
      ymaps.ready(init);
    }
  }, []);

  // init polygon
  useEffect(() => {
    if (map && polygons.length === 1) {
      createPolygons(map, polygons);
    }
  }, [map]);

  function editPoint(
    value: string,
    polygon_index: number,
    point_index: number,
    index_xy: number
  ) {
    if (!isNaN(Number(value))) {
      setPolygons((polygons) => {
        if (map) {
          map.geoObjects.remove(map.geoObjects.get(0));
          createPolygons(map, polygons);
        }
        return polygons.map((polygon, index) => {
          if (index === polygon_index) {
            polygon.points = polygon.points.map((point, i) => {
              if (i === point_index) {
                point[index_xy] = Number(value);
                return point;
              } else {
                return point;
              }
            });
            return polygon;
          } else {
            return polygon;
          }
        });
      });
    }
  }

  function calcCenter(points: [number, number][]) {
    let sum_x = 0;
    let sum_y = 0;
    let points_len = points.length;

    points.forEach((point: [number, number]) => {
      sum_x += point[0];
      sum_y += point[1];
    });

    return [sum_x / points_len, sum_y / points_len];
  }

  function createPolygons(map: any, polygons: Polygon[]) {
    if (map) {
      map.geoObjects.removeAll();
      polygons.forEach((polygonData, polygonIndex) => {
        const polygon = new ymaps.Polygon(
          [polygonData.points],
          {
            hintContent: `Полигон ${polygonIndex + 1}`,
          },
          {
            fillColor:
              polygonIndex === currentPolygon ? "#00A36C70" : "#ef575470",
            strokeColor:
              polygonIndex === currentPolygon ? "#00A36C" : "#ef5754",
            strokeWidth: 5,
          }
        );

        polygon.events.add(["geometrychange"], function (event: any) {
          const coords =
            event.get("target").geometry._coordPath._coordinates[0];
          setPolygons((polygons) =>
            polygons.map((polygon, index) => {
              if (index === polygonIndex) {
                return {
                  name: polygonData.name,
                  points: coords.filter(
                    (_coord: any, index: number) => index !== coords.length - 1
                  ),
                };
              } else {
                return polygon;
              }
            })
          );
        });

        map.geoObjects.add(polygon);

        if (polygonIndex === currentPolygon) {
          polygon.editor.startEditing();
        }
      });

      const nearestStreets: Street[] = [];
      const nearestStations: Station[] = [];
      const center = polygons[currentPolygon]
        ? calcCenter(polygons[currentPolygon].points)
        : [55.750167, 37.670645];

      ymaps
        .geocode(center, { kind: "metro", results: 5 })
        .then(function (res: any) {
          res.geoObjects.each((object: any) => {
            const name = object.properties.get("name");
            const coords = object.geometry._coordinates;
            nearestStations.push({
              id: Math.floor(Math.random() * 1000),
              name: name,
              coords: coords,
              capacity: 0,
              flowMorning: 0,
              flowEvening: 0,
            });
          });
          ymaps
            .geocode(center, { kind: "street", results: 5 })
            .then(function (res: any) {
              res.geoObjects.each((object: any) => {
                const name = object.properties.get("name");
                const coords = object.geometry._coordinates;
                nearestStreets.push({
                  id: Math.floor(Math.random() * 1000),
                  name: name,
                  coords: coords,
                  transport_in_hour: 0,
                  rush_hour: 1,
                  max_load: 0,
                });
              });
              setStreets(nearestStreets);
              setStations(nearestStations);
            });
        });
    }
  }

  function createPolygon() {
    if (map) {
      const mapCenter: [number, number] = map.getCenter();

      const side = 0.003476;

      const newPolygon: Polygon = {
        name: `Полигон ${polygons.length + 1}`,
        points: [
          [mapCenter[0] + side, mapCenter[1] - side],
          [mapCenter[0] + side, mapCenter[1] + side],
          [mapCenter[0] - side, mapCenter[1] + side],
          [mapCenter[0] - side, mapCenter[1] - side],
        ],
      };
      createPolygons(map, [...polygons, newPolygon]);
      setCurrentPolygon(polygons.length);
      setPolygons((polygons) => [...polygons, newPolygon]);
    }
  }

  useEffect(() => {
    if (map) {
      createPolygons(map, polygons);
    }
  }, [currentPolygon]);

  function deleteStation(id: number) {
    setStations((stations) => stations.filter((station) => station.id !== id));
  }

  function deleteStreet(id: number) {
    setStreets((streets) => streets.filter((street) => street.id !== id));
  }

  function createObject(
    map: any,
    placemark: any,
    newName: string,
    coords: [number, number],
    createType: string
  ) {
    if (createType === "station") {
      setStations((stations) => [
        ...stations,
        {
          name: newName,
          coords: coords,
          id: stations.length + 1,
          capacity: 0,
          flowMorning: 0,
          flowEvening: 0,
        },
      ]);
      map.geoObjects.remove(placemark);
      if (stationRef.current) {
        (stationRef.current as any).scrollIntoView({ behavior: "smooth" });
      }
    } else {
      setStreets((streets) => [
        ...streets,
        {
          name: newName,
          coords: coords,
          id: stations.length + 1,
          transport_in_hour: 0,
          rush_hour: 1,
          max_load: 0,
        },
      ]);
      map.geoObjects.remove(placemark);
      if (streetRef.current) {
        (streetRef.current as any).scrollIntoView({ behavior: "smooth" });
      }
    }
    setNewName("");
  }

  useEffect(() => {
    if (map) {
      stations.forEach((station) => {
        const placemark = new ymaps.Placemark(station.coords, {
          balloonContentBody: renderToString(
            <div className={styles.balloon}>{station.name}</div>
          ),
          hintContent: station.name,
        });
        map.geoObjects.add(placemark);
      });
    }
  }, [stations]);

  useEffect(() => {
    if (map) {
      streets.forEach((street) => {
        const placemark = new ymaps.Placemark(street.coords, {
          balloonContentBody: renderToString(
            <div className={styles.balloon}>{street.name}</div>
          ),
          hintContent: street.name,
        });
        map.geoObjects.add(placemark);
      });
    }
  }, [streets]);

  useEffect(() => {
    if (map) {
      stations.forEach((station) => {
        const placemark = new ymaps.Placemark(station.coords, {
          balloonContentBody: renderToString(
            <div className={styles.balloon}>{station.name}</div>
          ),
          hintContent: station.name,
        });
        map.geoObjects.add(placemark);
      });
      streets.forEach((street) => {
        const placemark = new ymaps.Placemark(street.coords, {
          balloonContentBody: renderToString(
            <div className={styles.balloon}>{street.name}</div>
          ),
          hintContent: street.name,
        });
        map.geoObjects.add(placemark);
      });
    }
  }, [map]);

  function editField(
    objects: Street[] | Station[],
    id: number,
    field: string,
    value: string | number
  ) {
    return objects.map((object) => {
      if (object.id === id) {
        object[field] = value;
      }
      return object;
    });
  }

  function calcRoads(streets: Street[], center: number[]) {
    return streets.map((street) => {
      const x = Math.abs(street.coords[0] - center[0]);
      const y = Math.abs(street.coords[1] - center[1]);
      return Math.sqrt(x * x + y * y);
    });
  }

  function calculateData() {
    
    if (
      !isNaN(apartments) &&
      !isNaN(blocks) &&
      !isNaN(countHouses) &&
      !isNaN(noLiving) &&
      streets.length > 0 &&
      stations.length > 0 &&
      polygons.length > 0 &&
      apartments > 0 &&
      blocks > 0 &&
      countHouses > 0 &&
      noLiving > 0
    ) {
      fetch(`http://172.16.18.126:8000/info`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coordinates: [],
          apartments: apartments,
          block_of_flats: blocks,
          count_houses: countHouses,
          road_location: calcRoads(
            streets,
            calcCenter(polygons[currentPolygon].points)
          ),
          neeres_stations: stations.map((station) => {
            return {
              name: station.name,
              passengerflow_mornind: station.flowMorning,
              passengerflow_evening: station.flowEvening,
              capacity: station.capacity,
            };
          }),
          no_living_square: noLiving,
          roads: streets.map((street) => {
            return {
              transport_in_hour: street.transport_in_hour,
              rush_hour: Math.round(
                (street.transport_in_hour / street.max_load) * 10
              ),
              max_load: street.max_load,
            };
          }),
        }),
      })
        .then((data) => data.json())
        .then((res) => {
          setResults(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("Проверьте вводимые данные!");
    }
  }

  return (
    <Layout>
      <div className={styles.location}>
        <div className={styles.map_wrapper}>
          <div className={styles.map} id="map"></div>
        </div>
        <div className={styles.points}>
          <header className={styles.points_header}>
            {polygons[currentPolygon]?.name}
          </header>
          <div className={styles.btns}>
            <Button size="l" onClick={createPolygon}>
              <Icon data={Plus} />
              Добавить полигон
            </Button>
            <Select
              value={[String(currentPolygon)]}
              size="l"
              options={polygons.map((polygon, index) => {
                return {
                  value: String(index),
                  content: polygon.name,
                };
              })}
              onUpdate={(value) => setCurrentPolygon(Number(value))}
            />
          </div>
          {polygons[currentPolygon]
            ? polygons[currentPolygon].points.map((point, index) => (
                <div className={styles.point} key={index}>
                  <label>Точка {index + 1}</label>
                  <TextInput
                    value={String(point[0])}
                    onChange={(evt) =>
                      editPoint(evt.target.value, currentPolygon, index, 0)
                    }
                    label="X: "
                  />
                  <TextInput
                    value={String(point[1])}
                    onChange={(evt) =>
                      editPoint(evt.target.value, currentPolygon, index, 1)
                    }
                    label="Y: "
                  />
                </div>
              ))
            : ""}
        </div>
      </div>
      <div className={styles.inputs}>
        <div className={styles.inputs_header}>Данные на ввод</div>
        <div className={styles.block}>
          <label>Количество зданий</label>
          <TextInput
            onUpdate={(value) => setCountHouses(Number(value))}
            placeholder="Кол-во зданий"
            type="number"
            size="l"
            defaultValue='0'
            endContent={<Label size="m">зд.</Label>}
          />
        </div>
        <label className={styles.inputs_subheader}>Жилплощадь</label>
        <div className={styles.block}>
          <TextInput
            onUpdate={(value) => setApartments(Number(value))}
            defaultValue="0"
            label="Апартаменты"
            type="number"
            endContent={<Label size="m">м²</Label>}
            size="l"
          />
        </div>
        <div className={styles.block}>
          <TextInput
            onUpdate={(value) => setBlocks(Number(value))}
            defaultValue="0"
            label="Многоквартирные"
            type="number"
            endContent={<Label size="m">м²</Label>}
            size="l"
          />
        </div>
        <div className={styles.block}>
          <TextInput
            onUpdate={(value) => setNoLiving(Number(value))}
            defaultValue="0"
            label="Нежилая площадь"
            type="number"
            endContent={<Label size="m">м²</Label>}
            size="l"
          />
        </div>
        <div className={styles.block}>
          <div className={styles.inputs_subheader}>Станции</div>
          <div className={styles.block} ref={stationRef}>
            {stations.map((station, index) => (
              <div className={styles.block} key={station.id}>
                <label>Станция {index + 1}</label>
                <TextInput
                  size="l"
                  defaultValue={station.name}
                  label="Название"
                  placeholder="Введите текст"
                  onUpdate={(value) =>
                    setStations(
                      editField(
                        stations,
                        station.id,
                        "name",
                        value
                      ) as Station[]
                    )
                  }
                />
                <TextInput
                  size="l"
                  defaultValue="0"
                  label="Пассажиропоток утром"
                  endContent={<Label size="m">тыс. пасс</Label>}
                  placeholder="Введите число"
                  type="number"
                  onUpdate={(value) =>
                    setStations(
                      editField(
                        stations,
                        station.id,
                        "flowMorning",
                        Number(value)
                      ) as Station[]
                    )
                  }
                />
                <TextInput
                  size="l"
                  defaultValue="0"
                  label="Пассажиропоток вечером"
                  endContent={<Label size="m">тыс. пасс</Label>}
                  placeholder="Введите число"
                  type="number"
                  onUpdate={(value) =>
                    setStations(
                      editField(
                        stations,
                        station.id,
                        "flowEvening",
                        Number(value)
                      ) as Station[]
                    )
                  }
                />
                <TextInput
                  size="l"
                  defaultValue="0"
                  label="Пропускная способность"
                  endContent={<Label size="m">тыс. пасс./час</Label>}
                  type="number"
                  placeholder="Введите число"
                  onUpdate={(value) =>
                    setStations(
                      editField(
                        stations,
                        station.id,
                        "capacity",
                        Number(value)
                      ) as Station[]
                    )
                  }
                />
                <Button
                  size="l"
                  view="outlined-danger"
                  onClick={() => deleteStation(station.id)}
                >
                  <Icon data={TrashBin} />
                  Удалить станцию
                </Button>
              </div>
            ))}
          </div>
        </div>
        <Button size="xl" onClick={calculateData}>
          <Icon data={MathOperations} size={20} />
          Рассчитать данные
        </Button>
      </div>
      <div className={styles.streets} ref={streetRef}>
        <div className={styles.inputs_header}>Улицы и дороги</div>
        {streets.map((street, index) => (
          <div className={styles.block} key={street.id}>
            <label>Улица {index + 1}</label>
            <TextInput
              size="l"
              defaultValue={street.name}
              label="Название"
              placeholder="Введите текст"
              onUpdate={(value) =>
                setStreets(
                  editField(streets, street.id, "name", value) as Street[]
                )
              }
            />

            <TextInput
              size="l"
              defaultValue="0"
              label="ТС/час"
              endContent={<Label size="m">тс/час</Label>}
              placeholder="Введите число"
              type="number"
              onUpdate={(value) =>
                setStreets(
                  editField(
                    streets,
                    street.id,
                    "transport_in_hour",
                    Number(value)
                  ) as Street[]
                )
              }
            />
            <TextInput
              size="l"
              defaultValue="0"
              label="Пропускная способность"
              endContent={<Label size="m">тс/час</Label>}
              placeholder="Введите число"
              type="number"
              onUpdate={(value) =>
                setStreets(
                  editField(
                    streets,
                    street.id,
                    "max_load",
                    Number(value)
                  ) as Street[]
                )
              }
            />
            {/* <Select
              size="l"
              label="Баллов в час пик:"
              defaultValue={["1"]}
              options={[...Array(11).keys()]
                .filter((number) => number !== 0)
                .map((number) => {
                  return {
                    value: String(number),
                    content: String(number),
                  };
                })}
              onUpdate={(value) =>
                setStreets(
                  editField(
                    streets,
                    street.id,
                    "rush_hour",
                    Number(value[0])
                  ) as Street[]
                )
              }
            /> */}

            <Button
              size="l"
              view="outlined-danger"
              onClick={() => deleteStreet(street.id)}
            >
              <Icon data={TrashBin} />
              Удалить улицу
            </Button>
          </div>
        ))}
      </div>
      {results && results.length > 0 ? (
        <div className={styles.results}>
          <div className={styles.block}>
            <div className={styles.inputs_header}>Станции</div>
            <div className={styles.block}>
              {results[0][0].map((result, index) => (
                <div className={styles.block}>
                  <div className={styles.inputs_header}>
                    {stations[index].name}
                  </div>
                  <div className={styles.block} style={{ paddingLeft: 30 }}>
                    <div className={styles.inputs_subheader}>
                      Утренний час пик
                    </div>
                    <label style={{ paddingLeft: 30 }}>
                      Увеличение на {result[0].toFixed(5)} тыс. человек
                    </label>
                    <label style={{ paddingLeft: 30 }}>
                      Процент загруженности станции - {result[1].toFixed(5)}%
                    </label>
                    <label style={{ paddingLeft: 30 }}>
                      Процент увеличения пассажиропотока относ. загруженности
                      станции - {result[2].toFixed(5)}%
                    </label>
                  </div>
                  <div className={styles.block} style={{ paddingLeft: 30 }}>
                    <div className={styles.inputs_subheader}>
                      Вечерний час пик
                    </div>
                    <label style={{ paddingLeft: 30 }}>
                      Увеличение на {results[0][1][index][0].toFixed(5)} тыс.
                      человек
                    </label>
                    <label style={{ paddingLeft: 30 }}>
                      Процент загруженности станции -{" "}
                      {results[0][1][index][1].toFixed(5)}%
                    </label>
                    <label style={{ paddingLeft: 30 }}>
                      Процент увеличения пассажиропотока относ. загруженности
                      станции - {results[0][1][index][2].toFixed(5)}%
                    </label>
                  </div>
                </div>
              ))}
              {/* {
                  results[0][1].map((result, index) => (
                    <div className={styles.block}>
                      <div className={styles.inputs_subheader}>{stations[index].name}: Вечерний час пик</div>
                      <label>Увеличение на {result[0].toFixed(5)} тыс. человек</label>
                      <label>Процент загруженности станции - {result[1].toFixed(5)}%</label>
                      <label>Процент увеличения пассажиропотока относ. загруженности станции - {result[2].toFixed(5)}%</label>
                    </div>
                  ))
                } */}
            </div>
          </div>
          <div className={styles.block}>
            <div className={styles.inputs_header}>Улицы</div>
            {results[1].map((result) => (
              <div className={styles.block} style={{ paddingLeft: 30 }}>
                <div className={styles.inputs_subheader}>
                  Загруженность дороги
                </div>
                <label style={{ paddingLeft: 30 }}>
                  Увеличение на {result[0].toFixed(5)} т.с.
                </label>
                <label style={{ paddingLeft: 30 }}>
                  Балл загруженности дороги - {result[1].toFixed(0)} баллов
                </label>
                <label style={{ paddingLeft: 30 }}>
                  Увеличение на {result[2].toFixed(0)} баллов
                </label>
              </div>
            ))}
          </div>
        </div>
      ) : (
        ""
      )}
    </Layout>
  );
};
