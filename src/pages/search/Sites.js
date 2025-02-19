import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import * as Utils from "../components/Utils";
import ConfigJson from "../../config.json";
import ConfigData from "../utils/data_config.json";
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
    Popup,
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
    const [downloadParams, setDownloadParams] = useState({});
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
        if((params.habitat || params.species) && !active.includes(1)) {
            let values = active.concat(1);
            setActive(values);
        }
        let url = ConfigJson.GetReleases + ConfigData.ReleasesFilters.PortalSDFSensitive;
        fetch(url)
        .then(response => response.json())
        .then(data => {
            if(data?.Success) {
                let releases = data.Data.sort((a, b) => new Date(b.ReleaseDate) - new Date(a.ReleaseDate));
                releases = releases.map(a => ({...a, "ReleaseDate": Utils.formatDate(a.ReleaseDate)}));
                setReleases(releases);
                let predefinedFilters = {...filters};
                if(!filters.releaseId) {
                    predefinedFilters.releaseId = releases[0].ReleaseId.toString();
                }
                if(!filters.siteType) {
                    predefinedFilters.siteType = "ABC";
                }
                setFilters(predefinedFilters);
            }
            else {
                setErrorLoading(true);
            }
            setLoadingReleases(false);
        })
    }

    const loadData = () => {
        setLoadingData(true);
        setDownloadParams(filters);
        let url = ConfigJson.GetSites + "?" + new URLSearchParams(filters);
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
        if(field === "country" || field === "bioregion" || field === "sensitive") {
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
        setFilters({"releaseId": releases[0].ReleaseId.toString(), siteType: "ABC"});
        setSearchParams({});
    }

    const onChangePage = (event, data) => {
        let page = data.activePage;
        setActivePage(page);
        document.querySelector(".search-list").scrollIntoView({behavior: "smooth"});
    }

    const downloadResults = () => {
        setDownloading(true);
        let url = ConfigJson.DownloadResultsSites + "?" + new URLSearchParams(downloadParams);
        fetch(url)
        .then(data => {
            if(data?.ok) {
                const regExp = /filename=(?<filename>.*);/;
                const filename = regExp.exec(data.headers.get('Content-Disposition'))?.groups?.filename ?? null;
                const release = releases.find(a => a.ReleaseId === parseInt(downloadParams.releaseId)).ReleaseName.replaceAll(" ", "_");
                data.blob()
                  .then(blobresp => {
                    var blob = new Blob([blobresp], { type: "octet/stream" });
                    var url = window.URL.createObjectURL(blob);
                    let link = document.createElement("a");
                    link.download = release + "_" + filename;
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
            <Header active="search/sites" />
            <div id="page-header" className="sites">
                <div className="eea banner">
                    <div className="image">
                        <div className="gradient">
                            <div className="ui container">
                                <div className="content">
                                    <h1 className="documentFirstHeading title">Search by Natura 2000 sites</h1>
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
                            <div className="ui form search sites">
                                <div className={"page-description " + showDescription}>
                                    <p>
                                        Retrieve a site data from a given release.
                                    </p>
                                    <p>
                                        A release is defined by the official deadline for the data submission (eg. END2022: data submitted by END of 2022), and the date in bracket corresponds to the publication of the corresponding European database (eg. 12/03/2024) as a downloadable data and in the Natura 2000 viewer.
                                    </p>
                                    <p>
                                        Use the filter to select one or many sites from the release.
                                    </p>
                                    <p>
                                        Results are presented as “cards”, that let you display each site SDF or as a map. The whole results can also be download as a table.
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
                                            <label htmlFor="field_types">Site types</label>
                                            <div className="ui grid">
                                                {
                                                    ConfigData.SiteTypes.map((item, i) =>
                                                        <div className="three wide computer twelve wide mobile six wide tablet column column-blocks-wrapper py-1" key={i}>
                                                            <Radio
                                                                label={item.SiteTypeName}
                                                                name="siteType"
                                                                value={item.SiteTypeCode}
                                                                checked={item.SiteTypeCode === filters.siteType}
                                                                onChange={onChangeFilters}
                                                            />
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                        <div className="field" >
                                            <label>Site</label>
                                            <Input
                                                type="text"
                                                placeholder="Search by site code or site name"
                                                name="site"
                                                value={filters.site ? filters.site : ""}
                                                onChange={onChangeFilters}
                                                autoComplete="off"
                                            />
                                        </div>
                                        <div className="field" id="field_sensitive">
                                            <label htmlFor="field_sensitive">Sensitive species</label>
                                            <div className="ui grid">
                                                <div className="twelve wide column column-blocks-wrapper py-1">
                                                    <Checkbox
                                                        label="Sites containing sensitive species"
                                                        name="sensitive"
                                                        value="true"
                                                        checked={filters.sensitive === "true"}
                                                        onChange={onChangeFilters}
                                                    />
                                                </div>
                                            </div>
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
                                    <AccordionTitle
                                        active={active.includes(1)}
                                        index={1}
                                        onClick={() => toggleAccordion(1)}
                                    >
                                        <i aria-hidden="true" className="small icon ri-arrow-down-s-line"></i>
                                        Advanced filters
                                    </AccordionTitle>
                                    <AccordionContent active={active.includes(1)}>
                                        <div className="field">
                                            <label>Habitat</label>
                                            <Input
                                                type="text"
                                                placeholder="Search by habitat code or habitat name"
                                                name="habitat"
                                                value={filters.habitat ? filters.habitat : ""}
                                                onChange={onChangeFilters}
                                                autoComplete="off"
                                            />
                                        </div>
                                        <div className="field">
                                            <label>Species</label>
                                            <Input
                                                type="text"
                                                placeholder="Search by species code or species name"
                                                name="species"
                                                value={filters.species ? filters.species : ""}
                                                onChange={onChangeFilters}
                                                autoComplete="off"
                                            />
                                        </div>
                                    </AccordionContent>
                                </Accordion>
                                <div className="search-buttons mt-3">
                                    <button className="ui button" disabled={loadingData} onClick={()=>addParameters()}>Search</button>
                                    <button className="ui button text" disabled={loadingData} onClick={()=>removeParameters()}>Clear filters</button>
                                </div>
                            </div>
                            <hr className="my-3" />
                            <div className="search-list sites">
                                {
                                    !loadingData && !errorLoading &&
                                    <div className="search-results">
                                        <div className="search-counter">
                                            <span className="search-number">{results}</span> results
                                        </div>
                                        {data &&
                                            <div className="legend-sensitive">
                                                <i className="ri-alert-line"></i>
                                                Contains sensitive species
                                            </div>
                                        }
                                        <button className="ui button inverted" disabled={data.length === 0 || !data || downloading} onClick={()=>downloadResults()}>
                                            {downloading ? <Loader active={true} size='mini'></Loader> : <i className="icon ri-download-line"></i>}Download results
                                        </button>
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
                                                <div className="card search sites">
                                                    <div className="card-body">
                                                        <div className="card-title">
                                                            {item.SiteName} - {item.SiteCode}
                                                        </div>
                                                        <div className="card-text">
                                                            {ConfigData.SiteTypes.find(a => a.SiteType.includes(item.SiteTypeCode)).SiteTypeName}
                                                        </div>
                                                        <div className="card-counters">
                                                            <div className="card-counter">
                                                                <div className="card-number">{item.SiteArea} ha</div>
                                                                <div className="card-value">Area</div>
                                                            </div>
                                                            <div className="card-counter">
                                                                <div className="card-number">{item.HabitatsNumber}</div>
                                                                <div className="card-value">Habitats</div>
                                                            </div>
                                                            <div className="card-counter">
                                                                <div className="card-number">{item.SpeciesNumber}</div>
                                                                <div className="card-value">Species</div>
                                                            </div>
                                                        </div>
                                                        <div className="card-links">
                                                            <a href={"#/sdf?sitecode=" + item.SiteCode + "&release=" + filters.releaseId + "&sensitive=" + item.IsSensitive} target="_blank" rel="noreferrer">SDF<i className="icon ri-external-link-line"></i></a>
                                                            <a href={"https://natura2000.eea.europa.eu/?sitecode=" + item.SiteCode} target="_blank" rel="noreferrer">Natura 2000 viewer<i className="icon ri-external-link-line"></i></a>
                                                            {item.IsSensitive &&
                                                                <div className="sensitive">
                                                                    <i className="ri-alert-line"></i>
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                                {
                                    !loadingData && !errorLoading && data.length > 0 &&
                                    <div className="ui grid">
                                        <Pagination
                                            className="sites"
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
