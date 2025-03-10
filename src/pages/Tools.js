import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import * as Utils from "./components/Utils";
import ConfigData from "./utils/data_config.json";
import ToolsImages from "../img/tools/images";

const Tools = () => {

    const [showDescription, setShowDescription] = useState(false);

    useEffect(() => {
        Utils.toggleDescription(showDescription, setShowDescription);
    }, [showDescription]);

    return (
        <div className="main">
            <Header active="tools" />
            <div id="page-header">
                <div className="eea banner">
                    <div className="image">
                        <div className="gradient">
                            <div className="ui container">
                                <div className="content">
                                    <h1 className="documentFirstHeading title">Tools</h1>
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
                                    All tools related to Natura 2000. Some are publicly accessible, other are restricted to authorised staff.
                                </p>
                                {showDescription !== "all" &&
                                    <button className="ui button text" onClick={() => setShowDescription(prevCheck => prevCheck === "show" ? "hide" : "show")}>
                                        {showDescription === "show" ? "Hide description" : "Show description"}
                                    </button>
                                }
                            </div>
                            <div className="tool-list">
                                <div className="ui grid">
                                    {
                                        ConfigData.Tools.map((item, i) =>
                                            <div className="four wide computer twelve wide mobile six wide tablet column column-blocks-wrapper" key={i}>
                                                <div className="card tools">
                                                    <div className="card-image">
                                                        <img src={ToolsImages[item.Image]} alt="Tool screenshot"></img>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="card-title">
                                                            {Utils.highlightSensitiveText(item.Name)}
                                                        </div>
                                                        <div className="card-text">
                                                            {Utils.highlightSensitiveText(item.Description)}
                                                        </div>
                                                        <a className="ui button primary" href={item.Link} target="_blank" rel="noreferrer">Explore</a>
                                                    </div>
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

export default Tools;
