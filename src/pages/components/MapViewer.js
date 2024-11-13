import React from "react";
import { loadModules } from "esri-loader";

class MapViewer extends React.Component {

    constructor(props) {
        super(props);
        this.mapDiv = this.props.container ? this.props.container : "mapDiv";
        this.map = null;
    }

    componentDidMount(){
        loadModules(
            ["esri/Map", "esri/views/MapView", "esri/widgets/Zoom", "esri/layers/FeatureLayer"],
            { css: true }
          ).then(([Map, MapView, Zoom, FeatureLayer]) => {
            let layers = [];

            this.map = new Map({
                basemap: "osm",
                layers: layers
            });

            let siteLayer = new FeatureLayer({
                url: this.props.mapUrl,
                id: 3,
                popupEnabled: false,
                listMode: "hide",
                definitionExpression: "SiteCode = '" + this.props.siteCode + "' AND ReleaseId = " + this.props.release,
                renderer: {
                    type: "simple",
                    symbol: {
                        type: "simple-fill",
                        color: "transparent",
                        outline: {
                            style: "none",
                        }
                    },
                },
            });
            this.map.add(siteLayer);

            let mapFeats = {
                container: this.mapDiv,
                map: this.map,
                center: [0,40],
                zoom: 5,
                ui: {
                    components: ["attribution"]
                }
            }
            this.view = new MapView(mapFeats);
            
            this.setState({});

            this.zoom = new Zoom({
                view: this.view
            });
            this.view.ui.add(this.zoom, {
                position: "top-right"
            });

            this.getReportedGeometry(siteLayer, this.props.siteCode, this.props.release);
        });
    }

    getReportedGeometry(layer, code, release){
        let query = layer.createQuery();
        query.where = "SiteCode = '" + code + "' AND ReleaseId = " + release;

        layer.queryFeatures(query)
        .then(
            res => {
                for(let i in res.features){
                    let feat = res.features[i];
                    this.view.goTo({
                        extent: feat?.geometry?.extent,
                        target: feat?.geometry
                    })
                    .catch((error) => {
                        if(error.name !== "AbortError") {
                            console.error(error);
                        }
                    });
                    
                    let polylineSymbol = {
                        type: "simple-fill",
                        color: "transparent",
                        style: "solid",
                        outline: {
                            color: "#000015",
                            width: 2
                        }
                    };
                    feat.symbol = polylineSymbol;
                    this.view.graphics.add(feat);
                }
            }
        );
    }

    render(){
        return(
            <>
                <div id={this.mapDiv} style={{ width: '100%', height: '600px' }} />
            </>
        );
    }
}

export default MapViewer;
