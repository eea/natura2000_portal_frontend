import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ConfigJson from "../config.json";
import SDFStructure from "./components/SDFStructure";
import Logo from "../img/natura2000_logo.svg";
import {
    Select,
    Message,
    Loader
} from "semantic-ui-react"

const SDF = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [errorLoading, setErrorLoading] = useState(false);
    const [siteCode, setSiteCode] = useState("");
    const [release, setRelease] = useState("");
    const [releases, setReleases] = useState([]);
    const [sensitive, setSensitive] = useState(true);
    const [nav, setNav] = useState("");
    const [showScrollBtn, setShowScrollBtn] = useState(false);

    useEffect(() => {
        window.addEventListener("scroll", () => {
            if(window.scrollY === 0) {
                setShowScrollBtn(false);
            }
            else {
                setShowScrollBtn(true);
            }
        });
    }, []);

    useEffect(() => {
        if(nav && !isLoading && siteCode && siteCode !== "nodata" && data !== "nodata" && !errorLoading) {
            let element = document.getElementById(nav);
            const y = element.getBoundingClientRect().top + window.scrollY;
            window.scroll({
                top: y,
                behavior: "instant"
            });
        }
    }, [isLoading, nav, siteCode, data, errorLoading]);

    const getSiteCode = () => {
        let params = Object.fromEntries([...searchParams]);
        setSiteCode(params.sitecode ? params.sitecode : "nodata");
        setRelease(params.release ? parseInt(params.release) : "");
        setNav(params.nav);
    }

    const loadData = () => {
        if(siteCode !== "" && !isLoading) {
            setIsLoading(true);
            let url = sensitive ? ConfigJson.SensitiveSDF : ConfigJson.PublicSDF;
            if(release) {
                url += "?siteCode=" + siteCode + "&releaseId=" + release;
            }
            else {
                url += "?siteCode=" + siteCode;
            }
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if(data?.Success) {
                        if(!data.Data.SiteInfo.SiteCode) {
                            setData("nodata");
                        }
                        else {
                            let releases = data.Data.SiteInfo.Releases.sort((a, b) => new Date(b.ReleaseDate) - new Date(a.ReleaseDate));
                            setReleases(releases);
                            setData(formatData(data));
                            if(!release) {
                                let release = releases[0].ReleaseId;
                                setRelease(release);
                                setSearchParams({"sitecode": siteCode, "release": release});
                            }
                        }
                    }
                    else {
                        setErrorLoading(true);
                    }
                    setIsLoading(false);
                });
        }
        else {
            setData("nodata");
            setIsLoading(false);
        }
    }

    const formatData = (data) => {
        let siteCentre = Object.fromEntries(Object.entries(data.Data.SiteLocation).filter(([key, value]) => key === "Latitude" || key === "Longitude"));
        data.Data.SiteLocation.Longitude = siteCentre;
        delete data.Data.SiteLocation.Latitude;
        let siteCharacter = Object.fromEntries(Object.entries(data.Data.SiteDescription).filter(([key, value]) => key === "GeneralCharacter" || key === "OtherCharacteristics"));
        data.Data.SiteDescription.GeneralCharacter = siteCharacter;
        delete data.Data.SiteDescription.OtherCharacteristics;
        let threats = Object.fromEntries(Object.entries(data.Data.SiteDescription).filter(([key, value]) => key === "NegativeThreats" || key === "PositiveThreats"));
        data.Data.SiteDescription.NegativeThreats = threats;
        delete data.Data.SiteDescription.PositiveThreats;
        let documents = Object.fromEntries(Object.entries(data.Data.SiteDescription).filter(([key, value]) => key === "Documents" || key === "Links"));
        data.Data.SiteDescription.Documents = documents;
        delete data.Data.SiteDescription.Links;
        return data.Data;
    }

    if(!siteCode) {
        getSiteCode();
    }

    if(!isLoading && siteCode && siteCode !== "nodata" && Object.keys(data).length === 0 && !errorLoading) {
        loadData();
    }

    const changeRelease = (event, release) => {
        setSearchParams(searchParams => {
            searchParams.set("release", release.value);
            searchParams.delete("nav");
            return searchParams;
        });
        setSiteCode("");
        setRelease("");
        setData([]);
        setErrorLoading(false);
    }

    const formatDate = (date, ddmmyyyy) => {
        date = new Date(date);
        var d = date.getDate();
        var m = date.getMonth() + 1;
        var y = date.getFullYear();
        if(ddmmyyyy) {
            date = (d <= 9 ? "0" + d : d) + "/" + (m <= 9 ? "0" + m : m) + "/" + y;
        }
        else {
            date = (y + "-" + (m <= 9 ? "0" + m : m));
        }
        return date;
    };

    return (
        <div className="main">
            <div className="ui basic segment">
                <main>
                    <div id="view">
                        <div id="page-document" className="ui container">
                            <div className="sdf">
                                <div className="container--main min-vh-100">
                                    <div className="ui container">
                                        <div className="ui grid py-4">
                                            <div className="sdf-general">
                                                <div className="sdf-head">
                                                    <div className="logo">
                                                        <a title="Site logo" className="logo" href="/.">
                                                            <img title="Site" src={Logo} alt="Natura 2000" className="ui image eea-logo" />
                                                        </a>
                                                    </div>

                                                    <div>
                                                        <h1>NATURA 2000 - STANDARD DATA FORM</h1>
                                                        {release && releases.length > 0 && <b>RELEASE {releases.find(a => a.ReleaseId === release)?.ReleaseName} ({formatDate(releases.find(a => a.ReleaseId === release)?.ReleaseDate, true)})</b>}
                                                    </div>
                                                    <div className="select--right">
                                                        <Select
                                                            placeholder="Select a release"
                                                            name="release"
                                                            options=
                                                                {
                                                                    releases && releases.map((item, i) => (
                                                                        {
                                                                            key: item.ReleaseId, value: item.ReleaseId, text: (item.ReleaseName + " (" + formatDate(item.ReleaseDate, true) + ")")
                                                                        }
                                                                    ))
                                                                }
                                                            value={releases.find(a => a.ReleaseId === release) ? release : ""}
                                                            onChange={changeRelease}
                                                            selectOnBlur={false}
                                                            loading={isLoading}
                                                            disabled={isLoading || errorLoading}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {(errorLoading && !isLoading) &&
                                        <div className="ui container">
                                            <div className="ui grid py-4">
                                                <Message error>
                                                    <i className="triangle exclamation icon"></i>
                                                    Error loading data
                                                </Message>
                                            </div>
                                        </div>
                                    }
                                    {isLoading ?
                                        <Loader active={isLoading} inline="centered" className="my-6" />
                                        :
                                        siteCode === "nodata" || data === "nodata" ? <div className="nodata-container"><em>No Data</em></div> :
                                            siteCode && Object.keys(data).length > 0 &&
                                            <>
                                                <SDFStructure
                                                    data={data}
                                                    siteCode={siteCode}
                                                    release={release}
                                                    formatDate={formatDate}
                                                    mapUrl={ConfigJson.MapReleases}
                                                ></SDFStructure>
                                            </>
                                    }
                                    {showScrollBtn &&
                                        <div className="sdf-scroll">
                                            <button className="ui button secondary" onClick={() => window.scroll({ top: 0, behavior: "instant" })}>
                                                <i aria-hidden="true" className="ri-arrow-up-s-line"></i>
                                            </button>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SDF;
