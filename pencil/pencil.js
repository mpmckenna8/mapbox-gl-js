//'use strict';

window.style = {
    "buckets": {
        "park": {
            "filter": {
                "source": "mapbox.mapbox-streets-v5",
                "layer": "landuse",
                "class": "park"
            },
            "fill": true
        },
        "park_outline": {
            "filter": {
                "source": "mapbox.mapbox-streets-v5",
                "layer": "landuse",
                "class": "park",
                "feature_type": "fill"
            },
            "line": true
        },
        "wood": {
            "filter": {
                "source": "mapbox.mapbox-streets-v5",
                "layer": "landuse",
                "class": "wood"
            },
            "fill": true
        },
        "school": {
            "filter": {
                "source": "mapbox.mapbox-streets-v5",
                "layer": "landuse",
                "class": "school"
            },
            "fill": true
        },
        "cemetery": {
            "filter": {
                "source": "mapbox.mapbox-streets-v5",
                "layer": "landuse",
                "class": "cemetery"
            },
            "fill": true
        },
        "industrial": {
            "filter": {
                "source": "mapbox.mapbox-streets-v5",
                "layer": "landuse",
                "class": "industrial"
            },
            "fill": true
        },
        "water": {
            "filter": {
                "source": "mapbox.mapbox-streets-v5",
                "layer": "water"
            },
            "fill": true
        },
        "waterway": {
            "filter": {
                "source": "mapbox.mapbox-streets-v5",
                "layer": "waterway"
            },
            "line": true
        },
        "bridge_large": {
            "filter": {
                "source": "mapbox.mapbox-streets-v5",
                "layer": "bridge",
                "class": [
                    "motorway",
                    "main"
                ]
            },
            "line": true
        },
        "bridge_regular": {
            "filter": {
                "source": "mapbox.mapbox-streets-v5",
                "layer": "bridge",
                "class": [
                    "street",
                    "street_limited"
                ]
            },
            "line": true
        },
        "borders": {
            "filter": {
                "source": "mapbox.mapbox-streets-v5",
                "layer": "admin"
            },
            "line": true
        },
        "building": {
            "filter": {
                "source": "mapbox.mapbox-streets-v5",
                "layer": "building"
            },
            "fill": true
        },
        "building_outline": {
            "filter": {
                "source": "mapbox.mapbox-streets-v5",
                "layer": "building",
                "feature_type": "fill"
            },
            "line": true,
            "line-cap": "butt",
            "line-join": "bevel"
        },
        "road_large": {
            "filter": {
                "source": "mapbox.mapbox-streets-v5",
                "layer": "road",
                "class": [
                    "motorway",
                    "main"
                ]
            },
            "line": true,
            "line-cap": "butt",
            "line-join": "bevel"
        },
        "road_regular": {
            "filter": {
                "source": "mapbox.mapbox-streets-v5",
                "layer": "road",
                "class": [
                    "street"
                ]
            },
            "line": true,
            "line-cap": "butt",
            "line-join": "bevel"
        },
        "road_limited": {
            "filter": {
                "source": "mapbox.mapbox-streets-v5",
                "layer": "road",
                "class": [
                    "street_limited"
                ]
            },
            "line": true,
            "line-cap": "round",
            "line-join": "bevel",
            "line-round-limit": 0.7
        },
        "path": {
            "filter": {
                "source": "mapbox.mapbox-streets-v5",
                "layer": "road",
                "class": [
                    "path"
                ]
            },
            "line": true,
            "line-cap": "round",
            "line-join": "bevel"
        }
    },
    "sprite": "img/sprite",
    "constants": {
        "land": [
            0,
            0,
            0,
            0
        ],
        "water": "#73b6e6",
        "park": "#c8df9f",
        "road": "#fefefe",
        "border": "#6d90ab",
        "wood": "#33AA66",
        "building": "#d9ccbe",
        "building_outline": "#d2c6b9",
        "text": "#000000",
        "satellite_brightness_low": 0,
        "satellite_brightness_high": 1,
        "satellite_saturation": 2,
        "satellite_spin": 0
    },
    "layers": [
        {
            "id": "background",
            "bucket": "background"
        },
        {
            "id": "park",
            "bucket": "park"
        },
        {
            "id": "park_outline",
            "bucket": "park_outline"
        },
        {
            "id": "wood",
            "bucket": "wood"
        },
        {
            "id": "waterway",
            "bucket": "waterway"
        },
        {
            "id": "water",
            "bucket": "water"
        },
        {
            "id": "roads",
            "layers": [
                {
                    "id": "road_large_casing",
                    "bucket": "road_large"
                },
                {
                    "id": "road_regular_casing",
                    "bucket": "road_regular"
                },
                {
                    "id": "road_limited",
                    "bucket": "road_limited"
                },
                {
                    "id": "road_large",
                    "bucket": "road_large"
                },
                {
                    "id": "road_regular",
                    "bucket": "road_regular"
                },
                {
                    "id": "path",
                    "bucket": "path"
                },
                {
                    "id": "bridge_large_casing",
                    "bucket": "bridge_large"
                },
                {
                    "id": "bridge_large",
                    "bucket": "bridge_large"
                },
                {
                    "id": "bridge_regular_casing",
                    "bucket": "bridge_regular"
                },
                {
                    "id": "bridge_regular",
                    "bucket": "bridge_regular"
                }
            ]
        },
        {
            "id": "building",
            "bucket": "building"
        },
        {
            "id": "building_outline",
            "bucket": "building_outline"
        },
        {
            "id": "borders",
            "bucket": "borders"
        }
    ],
    "styles": {
        "default": {
            "background": {
                "fill-color": "land",
                "fill-image": "natural_paper"
            },
            "park": {
                "fill-color": "park",
                "fill-image": "shade_medium",
                "fill-antialias": true
            },
            "park_outline": {
                "line-image": "line_shade_22_1",
                "line-opacity": 0.7,
                "line-color": "#eeeeee",
                "line-width": {
                    "fn": "exponential",
                    "z": 8,
                    "val": 1,
                    "slope": 0.2,
                    "min": 1,
                    "max": 6
                }
            },
            "wood": {
                "fill-color": "wood",
                "fill-opacity": 0.08,
                "fill-antialias": true
            },
            "water": {
                "fill-color": "water",
                "fill-image": "shade_medium",
                "fill-antialias": true
            },
            "waterway": {
                "line-color": "water",
                "line-width": [
                    "linear",
                    8,
                    1,
                    0.5,
                    0.5
                ]
            },
            "roads": {
                "opacity": 1,
                "transition-opacity": {
                    "duration": 500,
                    "delay": 0
                }
            },
            "road_large_casing": {
                "line-color": [
                    0.6,
                    0.6,
                    0.6,
                    1
                ],
                "line-width": 0,
                "enabled": [
                    "min",
                    13
                ],
                "line-opacity": {
                    "fn": "linear",
                    "z": 14.5,
                    "val": 0,
                    "slope": 1,
                    "min": 0,
                    "max": 1
                },
                "transition-width": {
                    "duration": 500,
                    "delay": 0
                }
            },
            "road_regular_casing": {
                "line-color": [
                    0.6,
                    0.6,
                    0.6,
                    1
                ],
                "enabled": [
                    "min",
                    14.5
                ],
                "line-opacity": {
                    "fn": "linear",
                    "z": 14.5,
                    "val": 0,
                    "slope": 1,
                    "min": 0,
                    "max": 1
                },
                "line-width": {
                    "fn": "exponential",
                    "z": 9,
                    "val": -1,
                    "slope": 0.2,
                    "min": 1,
                    "max": 7
                }
            },
            "road_limited": {
                "line-dasharray": [
                    10,
                    2
                ],
                "line-color": "road",
                "line-image": "line_solid_7",
                "line-opacity": 0.7,
                "line-width": {
                    "fn": "exponential",
                    "z": 9,
                    "val": -1,
                    "slope": 0.2,
                    "min": 1,
                    "max": 7
                }
            },
            "road_large": {
                "line-color": "road",
                "line-image": "line_double_20",
                "line-width": {
                    "fn": "exponential",
                    "z": 8,
                    "val": -1,
                    "slope": 0.2,
                    "min": 1,
                    "max": 20
                }
            },
            "road_regular": {
                "line-image": "line_double_18",
                "line-color": "road",
                "line-width": {
                    "fn": "exponential",
                    "z": 9,
                    "val": -3,
                    "slope": 0.2,
                    "min": 1,
                    "max": 10
                }
            },
            "path": {
                "line-color": [
                    1,
                    1,
                    1,
                    1
                ],
                "line-dasharray": [
                    2,
                    2
                ],
                "line-image": "line_dotted_8",
                "line-opacity": 0.7,
                "line-width": 2
            },
            "building": {
                "fill-color": "building",
                "fill-antialias": true,
                "fill-image": "shade_medium",
                "fill-opacity": {
                    "fn": "linear",
                    "z": 13,
                    "val": 0,
                    "slope": 1,
                    "min": 0,
                    "max": 1
                },
                "transition-opacity": {
                    "duration": 500,
                    "delay": 500
                }
            },
            "building_outline": {
                "line-width": {
                    "fn": "exponential",
                    "z": 12,
                    "val": -1,
                    "slope": 0.2,
                    "min": 0,
                    "max": 3
                },
                "line-color": "land",
                "line-opacity": 0.5,
                "line-image": "line_solid_7"
            },
            "borders": {
                "line-color": [
                    0,
                    0,
                    0,
                    0.3
                ],
                "line-width": 1
            },
            "bridge_large_casing": {
                "line-color": [
                    0.6,
                    0.6,
                    0.6,
                    1
                ],
                "line-width": 0,
                "enabled": [
                    "min",
                    13
                ],
                "line-opacity": {
                    "fn": "linear",
                    "z": 13,
                    "val": 0,
                    "slope": 1,
                    "min": 0,
                    "max": 1
                },
                "transition-width": {
                    "duration": 500,
                    "delay": 0
                }
            },
            "bridge_large": {
                "line-color": "road",
                "line-image": "line_double_20",
                "line-width": {
                    "fn": "exponential",
                    "z": 8,
                    "val": -1,
                    "slope": 0.2,
                    "min": 1,
                    "max": 20
                }
            },
            "bridge_regular_casing": {
                "line-color": [
                    0.6,
                    0.6,
                    0.6,
                    1
                ],
                "enabled": [
                    "min",
                    14.5
                ],
                "line-opacity": {
                    "fn": "linear",
                    "z": 14.5,
                    "val": 0,
                    "slope": 1,
                    "min": 0,
                    "max": 1
                },
                "line-width": {
                    "fn": "exponential",
                    "z": 9,
                    "val": -1,
                    "slope": 0.2,
                    "min": 1,
                    "max": 7
                }
            },
            "bridge_regular": {
                "line-image": "line_double_18",
                "line-color": "road",
                "line-width": {
                    "fn": "exponential",
                    "z": 9,
                    "val": -3,
                    "slope": 0.2,
                    "min": 1,
                    "max": 10
                }
            }
        }
    }
};
