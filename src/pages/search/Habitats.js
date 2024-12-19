import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import * as Utils from "../components/Utils";
import ConfigJson from "../../config.json";
import ConfigData from "../utils/data_config.json";
import NoImage from "../../img/no_image_habitats.jpg";
import ErrorImage from "../../img/error_image.svg";
import NoresultsImage from "../../img/noresults_image.svg";
import {
    Select,
    Accordion,
    AccordionTitle,
    AccordionContent,
    Radio,
    Checkbox,
    Input,
    Loader,
    Message,
    Pagination
} from "semantic-ui-react"

const Search = () => {

    const [active, setActive] = useState([0]);
    const [searchParams, setSearchParams] = useSearchParams();
    const params = Object.fromEntries([...searchParams]);
    const [filters, setFilters] = useState(params);
    const [data, setData] = useState(false);
    const [results, setResults] = useState(0);
    const [releases, setReleases] = useState([]);
    const [loadingReleases, setLoadingReleases] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [errorDownloading, setErrorDownloading] = useState(false);
    const [errorLoading, setErrorLoading] = useState(false);
    const [showDescription, setShowDescription] = useState(false);
    const [pageNumber, setPageNumber] = useState(10);
    const [activePage, setActivePage] = useState(1);
    const pageSize = 30;

    useEffect(() => {
        Utils.toggleDescription(showDescription, setShowDescription);
    }, [showDescription]);

    useEffect(() => {
        if(!releases.length && !errorLoading) {
            loadReleases();
        }
        if(Object.keys(params).length > 0 && !data && !loadingData && !errorLoading) {
            loadData();
        }
    });

    const loadReleases = () => {
        setLoadingReleases(true);
        let url = ConfigJson.GetReleases;
        fetch(url)
        .then(response => response.json())
        .then(data => {
            if(data?.Success) {
                let releases = data.Data.sort((a, b) => new Date(b.ReleaseDate) - new Date(a.ReleaseDate));
                releases = releases.map(a => ({...a, "ReleaseDate": Utils.formatDate(a.ReleaseDate)}));
                setReleases(releases);
                if(!filters.releaseId) {
                    setFilters({...filters, "releaseId": releases[0].ReleaseId.toString()});
                }
            }
            else {
                setErrorLoading(true);
            }
            setLoadingReleases(false);
        })
    }

    const loadData = () => {
        setLoadingData(true);
        let url = ConfigJson.GetHabitats + "?" + new URLSearchParams(filters);
        fetch(url)
        .then(response => response.json())
        .then(data => {
            if(data?.Success) {
                setData(data.Data);
                setPageNumber(Math.ceil(data.Data.length/pageSize));
                setResults(data.Count);
            }
            else {
                setErrorLoading(true);
            }
            setLoadingData(false);
        })
    }

    const toggleAccordion = (value) => {
        let values;
        if(active.includes(value)) {
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
        setActivePage(1);
        setData([]);
        loadData();
    }

    const removeParameters = () => {
        setFilters({"releaseId": releases[0].ReleaseId.toString()});
        setSearchParams({});
    }

    const onChangePage = (event, data) => {
        let page = data.activePage;
        setActivePage(page);
        document.querySelector(".search-list").scrollIntoView({behavior: "smooth"});
    }

    const setSitesUrl = () => {
        let params = new URLSearchParams(searchParams);
        if(!params.has("releaseId")) {
            params.set("releaseId", releases[0].ReleaseId);
        }
        params.delete("habitat");
        params.delete("habitatGroup");
        return params.toString();
    }

    const downloadResults = () => {
        setDownloading(true);
        let url = ConfigJson.DownloadResultsHabitats + "?" + new URLSearchParams(filters);
        fetch(url)
        .then(data => {
            if(data?.ok) {
                const regExp = /filename=(?<filename>.*);/;
                const filename = regExp.exec(data.headers.get('Content-Disposition'))?.groups?.filename ?? null;
                data.blob()
                  .then(blobresp => {
                    var blob = new Blob([blobresp], { type: "octet/stream" });
                    var url = window.URL.createObjectURL(blob);
                    let link = document.createElement("a");
                    link.download = filename;
                    link.href = url;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  })
            } else {
                setErrorDownloading(true);
            }
            setDownloading(false);
        });
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
                                                name="releaseId"
                                                options=
                                                    {
                                                        releases && releases.map((item, i) => (
                                                            {
                                                                key: item.ReleaseId, value: item.ReleaseId.toString(), text: (item.ReleaseName + " (" + item.ReleaseDate + ")")
                                                            }
                                                        ))
                                                    }
                                                value={filters.releaseId}
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
                                                                name="habitatGroup"
                                                                value={item.HabitatGroupCode}
                                                                checked={item.HabitatGroupCode === filters.habitatGroup}
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
                                    <button className="ui button" disabled={loadingData} onClick={()=>addParameters()}>Search</button>
                                    <button className="ui button text" disabled={loadingData} onClick={()=>removeParameters()}>Clear filters</button>
                                </div>
                            </div>
                            <hr className="my-3" />
                            <div className="search-list habitats">
                                {
                                    !loadingData && !errorLoading &&
                                    <div className="search-results">
                                        <div className="search-counter">
                                            <span className="search-number">{results}</span> results
                                        </div>
                                        <button className="ui button inverted" disabled={data.length === 0 || !data || downloading} onClick={()=>downloadResults()}><i className="icon ri-download-line"></i>Download results</button>
                                    </div>
                                }
                                <Message error hidden={!errorDownloading} onDismiss={()=>setErrorDownloading(false)}>
                                    <i className="triangle exclamation icon"></i>
                                    Something went wrong with the results download
                                </Message>
                                <div className="ui grid">
                                    {
                                        loadingData ? <Loader active={loadingData} inline="centered" className="my-6"/> :
                                        errorLoading ? <div className="error-container"><img src={ErrorImage} alt="Error" />Something went wrong</div> :
                                        data.length === 0 || !data ? <div className="error-container"><img src={NoresultsImage} alt="No results" />No results found</div> :
                                        data && data.slice((activePage-1)*pageSize, activePage*pageSize).map((item, i) =>
                                            <div className="four wide computer twelve wide mobile six wide tablet column column-blocks-wrapper" key={i}>
                                                <div className="card search habitats">
                                                    <a href={"/#/search/sites?"+setSitesUrl()+"&habitat="+item.HabitatCode}>
                                                        <div className="card-image">
                                                            <img src={(!item.HabitatImageUrl || item.HabitatImageUrl === "UNAVAILABLE IN DEV") ? NoImage : item.HabitatImageUrl} alt="Habitat" />
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
                                {
                                    !loadingData && !errorLoading && data.length > 0 &&
                                    <div className="ui grid">
                                        <Pagination
                                            className="habitats"
                                            totalPages={pageNumber}
                                            defaultActivePage={activePage}
                                            firstItem={
                                                pageNumber > 5 &&
                                                {
                                                    disabled: pageNumber <= 1 || activePage === 1,
                                                    content: <div className="double-arrow"><i className="ri-arrow-left-s-line" /><i className="ri-arrow-left-s-line" /></div>
                                                }
                                            }
                                            lastItem={
                                                pageNumber > 5 &&
                                                {
                                                    disabled: pageNumber <= 1 || activePage === pageNumber,
                                                    content: <div className="double-arrow"><i className="ri-arrow-right-s-line" /><i className="ri-arrow-right-s-line" /></div>
                                                }
                                            }
                                            prevItem={
                                                {
                                                    disabled: pageNumber <= 1 || activePage === 1,
                                                    content: <i className="ri-arrow-left-s-line" />
                                                }
                                            }
                                            nextItem={
                                                {
                                                    disabled: pageNumber <= 1 || activePage === pageNumber,
                                                    content: <i className="ri-arrow-right-s-line" />
                                                }
                                            }
                                            onPageChange={onChangePage}
                                        ></Pagination>
                                    </div>
                                }
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
