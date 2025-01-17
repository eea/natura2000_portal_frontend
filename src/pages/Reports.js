import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import * as Utils from "./components/Utils";
import ConfigData from "./utils/data_config.json";
import {
    Accordion,
    AccordionTitle,
    AccordionContent,
} from "semantic-ui-react"

const Reports = () => {

    const [active, setActive] = useState([]);
    const [showDescription, setShowDescription] = useState(false);

    useEffect(() => {
        Utils.toggleDescription(showDescription, setShowDescription);
    }, [showDescription]);

    const toggleAccordion = (value) => {
        let values;
        if(active.includes(value)) {
            values = active.filter(e => e !== value);
        } else {
            values = active.concat(value);
        }
        setActive(values);
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
                            <div className="document-list">
                                {
                                    ConfigData.Reports.map((item, i) =>
                                        <Accordion key={"a"+i}>
                                            <AccordionTitle
                                                active={active.includes(i)}
                                                index={i}
                                                onClick={() => toggleAccordion(i)}
                                            >
                                                <i aria-hidden="true" className="small icon ri-arrow-down-s-line"></i>
                                                <div className="document-text">
                                                    <div className="document-title">{item.Name}</div>
                                                    <div className="document-description">{item.Description}</div>
                                                </div>
                                            </AccordionTitle>
                                            <AccordionContent active={active.includes(i)}>
                                                {
                                                    ConfigData.ReportReleases.map((release, j) =>
                                                        <div className="document-release" key={"r"+j}>
                                                            <AccordionTitle
                                                                active={active.includes(i+"."+j)}
                                                                index={i+"."+j}
                                                                onClick={() => toggleAccordion(i+"."+j)}
                                                            >
                                                                <i aria-hidden="true" className="small icon ri-arrow-down-s-line"></i>
                                                                {release.ReleaseName + " (" + release.ReleaseDate + ")"}
                                                            </AccordionTitle>
                                                            <AccordionContent active={active.includes(i+"."+j)}>
                                                                {
                                                                    ConfigData.Countries.map((country, k) =>
                                                                        <div className="document" key={"c"+k}>
                                                                            <div className="document-image">
                                                                                <i className="ri-file-text-line"></i>
                                                                            </div>
                                                                            <div className="document-text">
                                                                                {country.CountryName + "_" + release.ReleaseName + "_" + release.ReleaseDate}.pdf
                                                                            </div>
                                                                            <div className="document-button">
                                                                                <button className="ui button primary">Download</button>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                }
                                                                
                                                            </AccordionContent>
                                                        </div>
                                                    )
                                                }
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
