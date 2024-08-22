import styles from "./HomePage.module.scss";
import { Layout } from "../../components/Layout/Layout";
import { useEffect, useRef, useState } from "react";
import { TextInput, Button, Icon, Select, Label } from "@gravity-ui/uikit";
import { Plus, TrashBin, MathOperations } from "@gravity-ui/icons";
import { Station } from "../../static/types/Station";
import { Polygon } from "../../static/types/Polygon";
import { renderToString } from 'react-dom/server';
import { Street } from '../../static/types/Street';

declare const ymaps: any;

const defaultPoints: [number, number][] = [
  [55.74656, 37.680364],
  [55.751411, 37.685987],
  [55.753643, 37.673654],
  [55.750167, 37.670645],
];

export const HomePage = () => {

  const ref = useRef(null);

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

  const [newName, setNewName] = useState("");
  const [newFlowMorning, setNewFlowMorning] = useState(0);
  const [newFlowEvening, setNewFlowEvening] = useState(0);
  const [newCapacity, setNewCapacity] = useState(0);

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

    myMap.events.add(['mousedown'], function(event: any) {
      const placemark = new ymaps.Placemark(event.get('coords'), {
        balloonContentBody: renderToString(
          <div className={styles.balloon}>
            <header className={styles.balloon_header}>Создать остановку</header>
            <input type="text" placeholder='Название' className={styles.input} onChange={(evt) => setNewName(evt.target.value)} id="name" />
            <input type="text" placeholder='Пассажиропоток утром' className={styles.input} id="flow_morning" />
            <input type="text" placeholder='Пассажиропоток вечером' className={styles.input} id="flow_evening" />
            <input type="text" placeholder='Пропускная способность' className={styles.input} id="capacity" />
          </div>
        ),
        hintContent: 'Создать остановку'
      });
      myMap.geoObjects.add(placemark);
      placemark.balloon.open();
      placemark.events.add(['balloonclose'], function () {
        myMap.geoObjects.remove(placemark);
      })
      placemark.balloon.events.add(['dblclick'], function () {
        createStation(myMap, placemark, (document.querySelector('#name') as any).value ?? "", Number((document.querySelector('#capacity') as any).value), Number((document.querySelector('#flow_morning') as any).value), Number((document.querySelector('#flow_evening') as any).value), placemark.geometry.getCoordinates());
      })
    })

    setMap(myMap);
  }

  // init map
  useEffect(() => {
    setStations([
      {
        name: "Станция Серп и Молот",
        coords: [55.748078, 37.682548],
        id: 0,
        capacity: 100,
        flowMorning: 100,
        flowEvening: 100,
      },
      {
        name: "Метро Площадь Ильича",
        coords: [55.74711, 37.68155],
        id: 1,
        capacity: 100,
        flowMorning: 100,
        flowEvening: 100,
      },
      {
        name: "Метро Римская",
        coords: [55.746233, 37.681245],
        id: 2,
        capacity: 100,
        flowMorning: 100,
        flowEvening: 100,
      },
      {
        name: "Станция Москва-Товарная",
        coords: [55.745656, 37.688315],
        id: 3,
        capacity: 100,
        flowMorning: 100,
        flowEvening: 100,
      },
      {
        name: "Станция Курская",
        coords: [55.757992, 37.66221],
        id: 4,
        capacity: 100,
        flowMorning: 100,
        flowEvening: 100,
      },
    ]);
    setStreets([
      {
        "id": 0,
        "name": "Волочаевская улица",
        "coords": [
          55.754041,
          37.679888
        ]
      },
      {
        "id": 1,
        "name": "Строгановский проезд",
        "coords": [
          55.753174,
          37.676232
        ]
      },
      {
        "id": 2,
        "name": "Средний Золоторожский переулок",
        "coords": [
          55.749106,
          37.679385
        ]
      },
      {
        "id": 3,
        "name": "Золоторожская улица",
        "coords": [
          55.750317,
          37.673825
        ]
      },
      {
        "id": 4,
        "name": "Верхний Золоторожский переулок",
        "coords": [
          55.750292,
          37.679897
        ]
      },
    ]);
    if (!map) {
      ymaps.ready(init);
    }
  }, []);

  // init polygon
  useEffect(() => {
    if (map && polygons.length === 1) {

      createPolygons(map, polygons);
      
      // const nearestStreets: Street[] = [];

      // const center = calcCenter(polygons[0].points);

      // ymaps
      //   .geocode(center, { kind: "street", results: 10 })
      //   .then(function (res: any) {
      //     res.geoObjects.each((object: any) => {
      //       const name = object.properties.get("name");
      //       const coords = object.geometry._coordinates;
      //       nearestStreets.push({
      //         id: 0,
      //         name: name,
      //         coords: coords
      //       })
      //     });
          
      // });
      stations.forEach(station => {
        const placemark = new ymaps.Placemark(station.coords, {
          balloonContentBody: renderToString(<div className={styles.balloon}>{station.name}</div>),
          hintContent: station.name
        });
        map.geoObjects.add(placemark);
      })
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
    }

    // const center = calcCenter(points);

    // ymaps
    //   .geocode(center, { kind: "metro", results: 10 })
    //   .then(function (res: any) {

    // res.geoObjects.each((object: any) => {
    //   const name = object.properties.get("name");
    //   const coords = object.geometry._coordinates;
    // nearestStations.push({
    //   name: name,
    //   coords: coords
    // });
    // });
    // });
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
    setStations(stations => stations.filter(station => station.id !== id));
  }

  function deleteStreet(id: number) {    
    setStreets(streets => streets.filter(street => street.id !== id));
  }

  function createStation(map: any, placemark: any, newName: string, newCapacity: number, newFlowMorning: number, newFlowEvening: number, coords: [number, number]) {
    setStations(stations => [...stations, {name: newName, coords: coords, id: stations.length + 1, capacity: newCapacity, flowMorning: newFlowMorning, flowEvening: newFlowEvening}])
    setNewName("");
    setNewCapacity(0);
    setNewFlowEvening(0);
    setNewFlowMorning(0);
    map.geoObjects.remove(placemark);
    if (ref.current) {
      (ref.current as any).scrollIntoView({ behavior: 'smooth' });
    }
  }

  useEffect(() => {
    if (map) {
      stations.forEach(station => {
        const placemark = new ymaps.Placemark(station.coords, {
          balloonContentBody: renderToString(<div className={styles.balloon}>{station.name}</div>),
          hintContent: station.name
        });
        map.geoObjects.add(placemark);
      })
    }
  }, [stations]);

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
          {polygons[currentPolygon].points
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
            placeholder="Кол-во зданий"
            type="number"
            size="l"
            endContent={<Label size="m">зд.</Label>}
          />
        </div>
        <label className={styles.inputs_subheader}>Жилплощадь</label>
        <div className={styles.block}>
          <TextInput
            defaultValue='0'
            label="Апартаменты"
            type="number"
            endContent={<Label size="m">м²</Label>}
            size="l"
          />
        </div>
        <div className={styles.block}>
          <TextInput
            defaultValue='0'
            label="Многоквартирные"
            type="number"
            endContent={<Label size="m">м²</Label>}
            size="l"
          />
        </div>
        <div className={styles.block}>
          <TextInput
            defaultValue='0'
            label="Нежилая площадь"
            type="number"
            endContent={<Label size="m">м²</Label>}
            size="l"
          />
        </div>
        <div className={styles.block}>
          <div className={styles.inputs_subheader}>Станции</div>
          <div className={styles.block}>
            {
              stations.map((station, index) => (
                <div className={styles.block} key={station.id}>
                  <label>Станция {index + 1}</label>
                  <TextInput size="l" defaultValue={station.name} label="Название" placeholder='Введите текст' />
                  <TextInput size="l" defaultValue='0' label="Пассажиропоток утром" endContent={<Label size="m">пасс</Label>} placeholder='Введите число' />
                  <TextInput size="l" defaultValue='0' label="Пассажиропоток вечером" endContent={<Label size="m">пасс</Label>} placeholder='Введите число' />
                  <TextInput size="l" defaultValue='0' label="Пропускная способность" endContent={<Label size="m">пасс./день</Label>} placeholder='Введите число' />
                  <Button size="l" view="outlined-danger" onClick={() => deleteStation(station.id)}>
                    <Icon data={TrashBin} /> 
                    Удалить станцию
                  </Button>
                </div>
              ))
            }
          </div>
          {/* вместо stations.length надо max id */}
          {/* <Button ref={ref} size="l" onClick={() => setStations([...stations, {name: newName, coords: [0, 0], id: stations.length + 1, capacity: newCapacity, flowMorning: newFlowMorning, flowEvening: newFlowEvening}])}>
            <Icon data={Plus} /> 
            Добавить станцию
          </Button> */}
        </div>
      <Button size="xl">
        <Icon data={MathOperations} size={20}/>
        Рассчитать данные
      </Button>
      </div>
      <div className={styles.streets}>
        <div className={styles.inputs_header}>Улицы и дороги</div>
        {
          streets.map((street, index) => (
            <div className={styles.block} key={street.id}>
                  <label>Улица {index + 1}</label>
                  <TextInput size="l" defaultValue={street.name} label="Название" placeholder='Введите текст' />

                  <TextInput size="l" defaultValue='0' label="ТС/час" endContent={<Label size="m">тс/час</Label>} placeholder='Введите число' />
                  <TextInput size="l" defaultValue='0' label="Пропускная способность" endContent={<Label size="m">тс/час</Label>} placeholder='Введите число' />
                  <Select
                    size="l"
                    label='Баллов в час пик:'
                    defaultValue={["1"]}
                    options={[...Array(11).keys()]
                      .filter((number) => number !== 0)
                      .map((number) => {
                        return {
                          value: String(number),
                          content: String(number),
                        };
                      })}
                  />

                  <Button size="l" view="outlined-danger" onClick={() => deleteStreet(street.id)}>
                    <Icon data={TrashBin} /> 
                    Удалить улицу
                  </Button>
              </div>
          ))
        }
      </div>
    </Layout>
  );
};
