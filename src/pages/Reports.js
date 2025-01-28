import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import * as Utils from "./components/Utils";
import ConfigJson from "../config.json";
import ConfigData from "./utils/data_config.json";
import {
    Accordion,
    AccordionTitle,
    AccordionContent,
    Loader,
    Message
} from "semantic-ui-react"

const Reports = () => {

    const [active, setActive] = useState([]);
    const [activeCountry, setActiveCountry] = useState([]);
    const [showDescription, setShowDescription] = useState(false);
    const [data, setData] = useState({});
    const [loadingData, setLoadingData] = useState(false);
    const [downloading, setDownloading] = useState([]);
    const [errorDownloading, setErrorDownloading] = useState(false);

    useEffect(() => {
        Utils.toggleDescription(showDescription, setShowDescription);
    }, [showDescription]);

    useEffect(() => {
        if(Object.keys(data).length === 0 && !loadingData) {
            loadData();
        }
    });

    const loadData = () => {
        setLoadingData(true);
        let reports = ConfigData.Reports.map(a => a.Product);
        reports.forEach(report => {
            let url = ConfigJson.GetReports + "?section=" +report;
            fetch(url)
            .then(response => response.json())
            .then(data => {
                if(data?.Success) {
                    let reportData = {};
                    data.Data.forEach(item => {
                        let country = item.split("\\")[0];
                        let files = item.split("\\")[1];
                        if(country in reportData) {
                            reportData[country].push(files);
                        }
                        else {
                            reportData[country] = [files];
                        }
                    });
                    setData(prev => { return {...prev, [report] : reportData}});
                }
                setLoadingData(false);
            })
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

    const toggleCountry = (value) => {
        let values;
        if(activeCountry.includes(value)) {
            values = activeCountry.filter(e => e !== value);
        } else {
            values = activeCountry.concat(value);
        }
        setActiveCountry(values);
    }

    const toggleDownloading = (value, show) => {
        let values;
        if(!show) {
            values = downloading.filter(e => e !== value);
        } else {
            values = downloading.concat(value);
        }
        setDownloading(values);
    }

    const downloadFile = (section, country, file) => {
        toggleDownloading(file, true);
        let url = ConfigJson.DownloadReports + "?section=" + section + "&filename=" + country + "\\\\" + file;
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
                        toggleDownloading(file);
                    })
            } else {
                setErrorDownloading(true);
                toggleDownloading(file);
            }
        });
    }
    
    return (
        <div className="main">
            <Header active="reports" />
            <div id="page-header">
                <div className="eea banner">
                    <div className="image">
                        <div className="gradient">
                            <div className="ui container">
                                <div className="content">
                                    <h1 className="documentFirstHeading title">Reports</h1>
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
                            <div className={"page-description " + showDescription}>
                                <p>
                                   This is a description for the reports.
                                </p>
                                {showDescription !== "all" &&
                                    <button className="ui button text" onClick={() => setShowDescription(prevCheck => prevCheck === "show" ? "hide" : "show")}>
                                        {showDescription === "show" ? "Hide description" : "Show description"}
                                    </button>
                                }
                            </div>
                            <Message error hidden={!errorDownloading} onDismiss={() => setErrorDownloading(false)}>
                                <i className="triangle exclamation icon"></i>
                                Something went wrong with the download
                            </Message>
                            <div className="document-list">
                                {
                                    ConfigData.Reports.map((report, i) =>
                                        <Accordion key={report.Product}>
                                            <AccordionTitle
                                                active={active.includes(report.Product)}
                                                index={i}
                                                onClick={() => toggleAccordion(report.Product)}
                                            >
                                                <i aria-hidden="true" className="small icon ri-arrow-down-s-line"></i>
                                                <div className="document-text">
                                                    <div className="document-title">{report.Name}</div>
                                                    <div className="document-description">{report.Description}</div>
                                                </div>
                                            </AccordionTitle>
                                            <AccordionContent active={active.includes(report.Product)}>
                                                {
                                                    !(report.Product in data) ? <Loader active={loadingData} inline="centered" className="mt-2 mb-6"/> :
                                                    Object.entries(data[report.Product]).map(([country, files]) =>
                                                        <div className="document-country" key={country}>
                                                            <AccordionTitle
                                                                active={activeCountry.includes(report.Product+country)}
                                                                index={country}
                                                                onClick={() => toggleCountry(report.Product+country)}
                                                            >
                                                                <i aria-hidden="true" className="small icon ri-arrow-down-s-line"></i>
                                                                <div className="document-text">
                                                                    {ConfigData.ReportsCountries.find(a => a.CountryCode === country).CountryName}
                                                                </div>
                                                            </AccordionTitle>
                                                            <AccordionContent active={activeCountry.includes(report.Product+country)}>
                                                                {
                                                                    files.map(file => 
                                                                        <div className="document" key={file}>
                                                                            <div className="document-image">
                                                                                <i className="ri-file-text-line"></i>
                                                                            </div>
                                                                            <div className="document-text">
                                                                                {file}
                                                                            </div>
                                                                            <div className="document-button">
                                                                                <button className="ui button primary" disabled={downloading.includes(file)} onClick={() => downloadFile(report.Product, country, file)}>
                                                                                    {downloading.includes(file) ? <Loader active={true} size='mini'></Loader> : <i className="icon ri-download-line"></i>}Download
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                }
                                                            </AccordionContent>
                                                        </div>
                                                    )}
                                            </AccordionContent>
                                        </Accordion>
                                    )
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

export default Reports;
