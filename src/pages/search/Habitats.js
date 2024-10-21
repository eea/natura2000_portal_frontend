import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ConfigJson from "../../config.json";
import ConfigData from "../config/data_config.json";
import {
    Select,
    Accordion,
    AccordionTitle,
    AccordionContent,
    Radio,
    Checkbox,
    Input,
    Loader
} from "semantic-ui-react"

const Search = () => {

    const [active, setActive] = useState([0]);
    const [searchParams, setSearchParams] = useSearchParams();
    const params = Object.fromEntries([...searchParams]);
    const [filters, setFilters] = useState(params);
    const [data, setData] = useState([]);
    const [releases, setReleases] = useState([]);
    const [loadingReleases, setLoadingReleases] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [errorLoading, setErrorLoading] = useState(false);
    const [showDescription, setShowDescription] = useState(false);

    useEffect(() => {
        if(!showDescription) {
            if(document.querySelector(".page-description")?.scrollHeight < 6*16) {
                setShowDescription("all");
            }
            else {
                setShowDescription("hide");
            }
        }
    });

    useEffect(() => {
        if(!params.release) {
            setFilters({ ...filters, "release": ConfigData.Releases[0].ReleaseId.toString()});
        }
    }, [searchParams]);

    useEffect(() => {
        if(!releases.length) {
            loadReleases();
        }
        if(Object.keys(params).length > 0 && !data.length) {
            loadData();
        }
    }, []);

    const loadReleases = () => {
        setLoadingReleases(true);
        let promises = [];
        let url = ConfigJson.LoadReleases;
        promises.push(
            fetch(url)
            .then(response =>response.json())
            .then(data => {
                if(data?.Success) {
                    setReleases(ConfigData.Releases);
                }
                else {
                    setErrorLoading(true);
                }
            })
        );
        Promise.all(promises)
        .then(results => {
            setLoadingReleases(false);
        });
    }

    const loadData = () => {
        setLoadingData(true);
        let url = ConfigJson.LoadReleases;
        fetch(url)
        .then(response =>response.json())
        .then(data => {
            if(data?.Success) {
                setData(ConfigData.Habitats);
            }
            else {
                setErrorLoading(true);
            }
            setLoadingData(false);
        })
    }

    const formatDate = (date) => {
        date = new Date(date);
        var d = date.getDate();
        var m = date.getMonth() + 1;
        var y = date.getFullYear();
        date = (d <= 9 ? "0" + d : d) + "/" + (m <= 9 ? "0" + m : m) + "/" + y;
        return date;
    };

    const toggleAccordion = (value) => {
        let values;
        if (active.includes(value)) {
            values = active.filter(e => e !== value);
        } else {
            values = active.concat(value);
        }
        setActive(values);
    }

    const onChangeFilters = (event, data) => {
        let field = data.name;
        let value = data.value;
        if(field === "country" || field === "bioregion") {
            if(data.checked) {
                let values = filters[field] ? filters[field].split(",").filter(Boolean) : [];
                values.push(value);
                value = values.join(",");
            }
            else {
                value = filters[field]?.split(",").filter(item => item !== value).join(",");
            }
        }
        if(value === "") {
            setFilters(Object.entries(filters).reduce((a,[k,v]) => (k !==field ? (a[k]=v, a) : a), {}));
        }
        else {
            setFilters({ ...filters, [field]: value});
        }
    }

    const addParameters = () => {
        setSearchParams(filters);
        setLoadingData(true);
        setData([]);
        loadData();
    }

    const removeParameters = () => {
        setFilters({"release": ConfigData.Releases[0].ReleaseId.toString()});
    }

    const setSitesUrl = () => {
        let params = new URLSearchParams(searchParams);
        if(!params.has("release")) {
            params.set("release", ConfigData.Releases[0].ReleaseId);
        }
        params.delete("habitat");
        params.delete("type");
        return params.toString();
    } 

    return (
        <div className="main">
            <Header active="search/habitats" />
            <div id="page-header" className="habitats">
                <div className="eea banner">
                    <div className="image">
                        <div className="gradient">
                            <div className="ui container">
                                <div className="content">
                                    <h1 className="documentFirstHeading title">Search by Habitats</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="ui basic segment">
                <main>
                    <div id="view">
                        <div id="page-document" className="ui container">
                            <div className="ui form search habitats">
                                <div className={"page-description " + showDescription}>
                                    <p>
                                        Retrieve a habitat data from a given release.
                                    </p>
                                    <p>
                                        A release is defined by the official deadline for the data submission (eg. END2022: data submitted by END of 2022), and the date in bracket corresponds to the publication of the corresponding European database (eg. 12/03/2024) as a downloadable data and in the Natura 2000 viewer.
                                    </p>
                                    <p>
                                        Use the filter to select one or many habitats from the release.
                                    </p>
                                    <p>
                                        Results are presented as “cards”, that let you see the sites where the habitats appear. The whole results can also be download as a table.
                                    </p>
                                    {showDescription !== "all" &&
                                        <button className="ui button text" onClick={() => setShowDescription(prevCheck => prevCheck === "show" ? "hide" : "show")}>
                                            {showDescription === "show" ? "Hide description" : "Show description"}
                                        </button>
                                    }
                                </div>
                                <Accordion>
                                    <AccordionTitle
                                        active={active.includes(0)}
                                        index={0}
                                        onClick={() => toggleAccordion(0)}
                                    >
                                        <i aria-hidden="true" className="small icon ri-arrow-down-s-line"></i>
                                        Filters
                                    </AccordionTitle>
                                    <AccordionContent active={active.includes(0)}>
                                        <div className="field" id="field_releases">
                                            <label htmlFor="field_releases">Releases</label>
                                            <Select
                                                placeholder="Select a release"
                                                name="release"
                                                options=
                                                    {
                                                        releases && releases.map((item, i) => (
                                                            {
                                                                key: item.ReleaseId, value: item.ReleaseId.toString(), text: (item.ReleaseName + " (" + item.ReleaseDate + ")")
                                                            }
                                                        ))
                                                    }
                                                value={filters.release}
                                                onChange={onChangeFilters}
                                                selectOnBlur={false}
                                                loading={loadingReleases}
                                                disabled={loadingReleases}
                                            />
                                        </div>
                                        <div className="field" id="field_types">
                                            <label htmlFor="field_types">Habitat groups</label>
                                            <div className="ui grid">
                                                {
                                                    ConfigData.HabitatGroups.map((item, i) =>
                                                        <div className="three wide computer twelve wide mobile six wide tablet column column-blocks-wrapper py-1" key={i}>
                                                            <Radio
                                                                label={item.HabitatGroupName}
                                                                name="type"
                                                                value={item.HabitatGroupCode}
                                                                checked={item.HabitatGroupCode === filters.type}
                                                                onChange={onChangeFilters}
                                                            />
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                        <div className="field">
                                            <label>Habitats</label>
                                            <Input
                                                type="text"
                                                placeholder="Search by habitat code or habitat name"
                                                name="habitat"
                                                value={filters.habitat ? filters.habitat : ""}
                                                onChange={onChangeFilters}
                                                autoComplete="off"
                                            />
                                        </div>
                                        <div className="field" id="field_countries">
                                            <label htmlFor="field_countries">Member States</label>
                                            <div className="ui grid">
                                                {
                                                    ConfigData.Countries.map((item, i) =>
                                                        <div className="three wide computer twelve wide mobile six wide tablet column column-blocks-wrapper py-1" key={i}>
                                                            <Checkbox
                                                                label={item.CountryName}
                                                                name="country"
                                                                value={item.CountryCode}
                                                                checked={filters.country ? filters.country.includes(item.CountryCode) : false}
                                                                onChange={onChangeFilters}
                                                            />
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                        <div className="field" id="field_bioregions">
                                            <label htmlFor="field_bioregions">Biogeographical Regions</label>
                                            <div className="ui grid">
                                                {
                                                    ConfigData.Bioregions.map((item, i) =>
                                                        <div className="three wide computer twelve wide mobile six wide tablet column column-blocks-wrapper py-1" key={i}>
                                                            <Checkbox
                                                                label={item.BioregionName}
                                                                name="bioregion"
                                                                value={item.BioregionCode}
                                                                checked={filters.bioregion ? filters.bioregion.includes(item.BioregionCode) : false}
                                                                onChange={onChangeFilters}
                                                            />
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </Accordion>
                                <div className="search-buttons mt-3">
                                    <button className="ui button" onClick={()=>addParameters()}>Search</button>
                                    <button className="ui button text" onClick={()=>removeParameters()}>Clear filters</button>
                                </div>
                            </div>
                            <hr className="my-3" />
                            <div className="search-list habitats">
                                {   
                                    !loadingData &&
                                    <div className="search-results">
                                        <div className="search-counter">
                                            <span className="search-number">{data.length}</span> results
                                        </div>
                                        <button className="ui button inverted" disabled={data.length === 0}><i className="icon ri-download-line"></i>Download results</button>
                                    </div>
                                }
                                <div className="ui grid">
                                    {
                                         loadingData ? <Loader active={loadingData} inline="centered" className="my-6"/> :
                                         data.length === 0 ? <div className="noresults">No results found</div> :
                                         data && data.map((item, i) =>
                                            <div className="four wide computer twelve wide mobile six wide tablet column column-blocks-wrapper" key={i}>
                                                <div className="card search habitats">
                                                    <a href={"/search/sites?"+setSitesUrl()+"&habitat="+item.HabitatCode}>
                                                        <div className="card-image">
                                                            <img src={item.HabitatImageUrl} alt="Habitat image" />
                                                        </div>
                                                        <div className="card-body">
                                                            <div className="card-title">
                                                                {item.HabitatName}
                                                            </div>
                                                            <div className="card-text">
                                                                {ConfigData.HabitatGroups.find(a=>a.HabitatGroupCode === item.HabitatCode.charAt()).HabitatGroupName}
                                                            </div>
                                                            <div className="card-counters">
                                                                <div className="card-counter">
                                                                    <div className="card-number">{item.HabitatCode}</div>
                                                                    <div className="card-value">Habitat code</div>
                                                                </div>
                                                            </div>
                                                            <div className="card-links">
                                                                Found in <b>{item.SitesNumber} sites</b>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default Search;
