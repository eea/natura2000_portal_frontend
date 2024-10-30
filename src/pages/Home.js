import React, { useState } from 'react';
import Header from "./components/Header";
import Footer from "./components/Footer";
import * as Utils from "./components/Utils";
import ConfigJson from "../config.json";
import background from '../img/home_background.jpg';
import sites from '../img/sites_image.jpg';
import habitats from '../img/habitats_image.jpg';
import species from '../img/species_image.jpg';
import {
    Loader
} from "semantic-ui-react"

const Home = () => {

    const [loadingData, setLoadingData] = useState(false);
    const [data, setData] = useState({});

    const formatNumber = (value) => {
        return value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    const loadData = () => {
        setLoadingData(true);
        let url = ConfigJson.GetLastReleaseData;
        fetch(url)
        .then(response =>response.json())
        .then(data => {
            if(data?.Success) {
                setData(data.Data);
            }
            setLoadingData(false);
        })
    }

    if(!loadingData && Object.keys(data).length === 0) {
        loadData();
    }


    return (
        <div className="main">
            <Header active="home"/>
            <div id="page-header" className="hidden transition">
                <h1>Natura 2000 portal</h1>
            </div>
            <div className="ui basic segment content-area">
                <main>
                    <div id="view">
                        <div id="page-document" className="ui container">
                            <div className="eea hero-block inverted full-height">
                                <div className="hero-block-image-wrapper full-width">
                                    <div className="hero-block-image"
                                        style={{backgroundImage: "url("+background+")"}}>
                                    </div>
                                    <div className="dark-overlay"></div>
                                </div>
                            </div>
                            <div className="ui hidden section divider"></div>
                            <div className="search-container">
                                <h2 id="eea-in-numbers" className="mb-3">Search by</h2>
                                <div className="ui form">
                                    <div className="ui grid">
                                        <div className="four wide computer twelve wide mobile six wide tablet column column-blocks-wrapper">
                                            <div className="card home sites">
                                                <div className="card-image">
                                                    <img src={sites} alt="Natura 2000 sites"/>
                                                </div>
                                                <div className="card-body">
                                                    <div className="card-title title">
                                                        Natura 2000 sites
                                                    </div>
                                                    <div className="ui input">
                                                        <input type="text" placeholder="Search by site code or site name"/>
                                                    </div>
                                                    <a className="ui button" href="/#/search/sites">Search</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="four wide computer twelve wide mobile six wide tablet column column-blocks-wrapper">
                                            <div className="card home habitats">
                                                <div className="card-image">
                                                    <img src={habitats} alt="Habitats"/>
                                                </div>
                                                <div className="card-body">
                                                    <div className="card-title title">
                                                        Habitats
                                                    </div>
                                                    <div className="ui input">
                                                        <input type="text" placeholder="Search by habitat code or habitat name"/>
                                                    </div>
                                                    <a className="ui button" href="/#/search/habitats">Search</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="four wide computer twelve wide mobile six wide tablet column column-blocks-wrapper">
                                            <div className="card home species">
                                                <div className="card-image">
                                                    <img src={species} alt="Species"/>
                                                </div>
                                                <div className="card-body">
                                                    <div className="card-title title">
                                                        Species
                                                    </div>
                                                    <div className="ui input">
                                                        <input type="text" placeholder="Search by species code or species name"/>
                                                    </div>
                                                    <a className="ui button" href="/#/search/sites">Search</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="ui hidden section divider"></div>
                            <div className="statistics-container content-box">
                                <div className="content-box-inner pb-0">
                                    <h2 id="eea-in-numbers" className="mt-3">Natura 2000 in numbers</h2>
                                    <div>
                                        Search in the last release
                                        {
                                            (!loadingData || Object.keys(data).length < 0) &&
                                            <>
                                                Search in the last release ({Utils.formatDate(data.ReleaseDate)}) by:
                                            </>
                                        }
                                    </div>
                                </div>
                                <div className="ui grid">
                                    <div className="four wide computer twelve wide mobile six wide tablet column column-blocks-wrapper">
                                        <div className="ui small one statistics center">
                                            <span className="ui statistic">
                                                {
                                                    (loadingData || Object.keys(data).length === 0) ?
                                                    <Loader active={loadingData} inline="centered" />
                                                    :
                                                    <div className="value slate text-center secondary">
                                                        <p>{formatNumber(data.SitesNumber)}</p>
                                                    </div>
                                                }
                                                <div className="label slate text-center tertiary">
                                                    <p>Natura 2000 sites</p>
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="four wide computer twelve wide mobile six wide tablet column column-blocks-wrapper">
                                        <div className="ui small one statistics center">
                                            <span className="ui statistic">
                                                {
                                                    (loadingData || Object.keys(data).length === 0) ?
                                                    <Loader active={loadingData} inline="centered" />
                                                    :
                                                    <div className="value slate text-center secondary">
                                                        <p>{formatNumber(data.HabitatsNumber)}</p>
                                                    </div>
                                                }
                                                <div className="label slate text-center tertiary">
                                                    <p>Habitats</p>
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="four wide computer twelve wide mobile six wide tablet column column-blocks-wrapper">
                                        <div className="ui small one statistics center">
                                            <span className="ui statistic">
                                                {
                                                    (loadingData || Object.keys(data).length === 0) ?
                                                    <Loader active={loadingData} inline="centered" />
                                                    :
                                                    <div className="value slate text-center secondary">
                                                        <p>{formatNumber(data.SpeciesNumber)}</p>
                                                    </div>
                                                }
                                                <div className="label slate text-center tertiary">
                                                    <p>Species</p>
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <Footer/>
        </div>
    );
};
  
export default Home;
