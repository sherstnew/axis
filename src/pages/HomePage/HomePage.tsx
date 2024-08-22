import styles from "./HomePage.module.scss";
import { Layout } from "../../components/Layout/Layout";
import { useEffect, useState } from "react";
import { TextInput, Button, Icon, Select, Label } from "@gravity-ui/uikit";
import { Plus } from "@gravity-ui/icons";
import { Station } from "../../static/types/Station";
import { Polygon } from "../../static/types/Polygon";

declare const ymaps: any;

const defaultPoints: [number, number][] = [
  [55.74656, 37.680364],
  [55.751411, 37.685987],
  [55.753643, 37.673654],
  [55.750167, 37.670645],
];

export const HomePage = () => {
  const [map, setMap] = useState<any>(null);

  const [stations, setStations] = useState<Station[]>([]);

  const [polygons, setPolygons] = useState<Polygon[]>([
    {
      name: "Полигон 1",
      points: defaultPoints,
    },
  ]);

  const [currentPolygon, setCurrentPolygon] = useState(0);

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

    setMap(myMap);
  }

  // init map
  useEffect(() => {
    setStations([
      {
        name: "Станция Серп и Молот",
        coords: [55.748078, 37.682548],
      },
      {
        name: "Метро Площадь Ильича",
        coords: [55.74711, 37.68155],
      },
      {
        name: "Метро Римская",
        coords: [55.746233, 37.681245],
      },
      {
        name: "Станция Москва-Товарная",
        coords: [55.745656, 37.688315],
      },
      {
        name: "Станция Курская",
        coords: [55.757992, 37.66221],
      },
    ]);
    ymaps.ready(init);
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
    }

    // const center = calcCenter(points);

    // ymaps
    //   .geocode(center, { kind: "metro", results: 10 })
    //   .then(function (res: any) {
    // NOT IN DEV MODE

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
      console.log(polygons);

      createPolygons(map, polygons);
    }
  }, [currentPolygon]);

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
          <label>Апартаменты</label>
          <TextInput
            placeholder="Апартаменты"
            type="number"
            endContent={<Label size="m">м²</Label>}
            size="l"
          />
        </div>
        <div className={styles.block}>
          <label>Многоквартирные</label>
          <TextInput
            placeholder="Многоквартирные"
            type="number"
            endContent={<Label size="m">м²</Label>}
            size="l"
          />
        </div>
        <div className={styles.block}>
          <label>Нежилая площадь</label>
          <TextInput
            placeholder="Нежилая площадь"
            type="number"
            endContent={<Label size="m">м²</Label>}
            size="l"
          />
        </div>
        <div className={styles.block}>
          <label className={styles.inputs_subheader}>Загруженность ТС в час пик (баллы) 1-10</label>
          <Select
            size="l"
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
        </div>
        <div className={styles.block}>
          <div className={styles.inputs_subheader}>Станции</div>
          <div className={styles.block}>
            {
              stations.map(station => (
                <div className={styles.block}>
                  <TextInput defaultValue={station.name} size="l" />
                  <TextInput placeholder='Пассажиропоток' size="l" />
                  <TextInput placeholder='Пропускная способность' size="l" />
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </Layout>
  );
};
