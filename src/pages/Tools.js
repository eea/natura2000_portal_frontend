import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ConfigData from "./config/data_config.json";
import images from "../img/tools/images"

const Tools = () => {

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
                                                        <img src={images[item.Image]}></img>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="card-title">
                                                            {item.Name}
                                                        </div>
                                                        <div className="card-text">
                                                            {item.Description}
                                                        </div>
                                                        <button className="ui button primary"><a href={item.Link} target="_blank">Explore</a></button>
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
