import React, { useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

const About = () => {

    const scrollTo = (item) => {
        let element = document.querySelector("[name="+item+"]");
        const y = element.getBoundingClientRect().top + window.scrollY;
        window.scroll({
            top: y,
            behavior: "instant"
        });
    }

    document.querySelectorAll(".about-menu li").forEach(item => {
        item.addEventListener("click", (e) => {
            let item = e.currentTarget.dataset.content;
            window.history.replaceState(null, "New Page Title", "#/about" + "#" + item);
            scrollTo(item);
        })
    });

    useEffect(() => {
        let item = window.location.href.split('#').pop();
        if(item) {
            scrollTo(item);
        }
    },[]);

    return (
        <div className="main">
            <Header active="about" />
            <div id="page-header">
                <div className="eea banner">
                    <div className="image">
                        <div className="gradient">
                            <div className="ui container">
                                <div className="content">
                                    <h1 className="documentFirstHeading title">About</h1>
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
                            <div className="ui-grid">
                                <div>
                                    <p>
                                        The NATURA 2000 programme is based on two important directives:
                                    </p>
                                    <ul>
                                        <li>
                                            Council Directive 79/409/EEC on the conservation of wild birds
                                        </li>
                                        <li>
                                            Council Directive 92/43/EEC and 97/62/EEC on the conservation of natural habitats and of wild fauna and flora
                                        </li>
                                    </ul>
                                    <p>
                                        Protection of the biodiversity is one of the main topics in the framework of this programme, but the Natura2000 network also interacts with other Commission policies. Data for building up the network is provided by the different Member states. More information can be found on <a href="https://environment.ec.europa.eu/topics/nature-and-biodiversity/natura-2000_en" target="_blank" rel="noreferrer">https://environment.ec.europa.eu/topics/nature-and-biodiversity/natura-2000_en</a>
                                    </p>
                                </div>
                                <h3 className="green">Contents</h3>
                                <ul className="about-menu">
                                    <li data-content="about">
                                        About the GIS for Natura 2000 Intranet web-application
                                    </li>
                                    <li data-content="layout">
                                        Layout of the Intranet Application
                                    </li>
                                    <li data-content="disclaimer">
                                        Technical Disclaimer
                                    </li>
                                    <ul>
                                        <li data-content="data">
                                            On the Data
                                        </li>
                                        <li data-content="application">
                                            On the Application
                                        </li>
                                    </ul>
                                    <li data-content="database">
                                        Database information
                                    </li>
                                    <li data-content="contact">
                                        Points of contact
                                    </li>
                                </ul>
                                <h3 name="about" className="green">About the GIS for Natura 2000 Intranet web-application</h3>
                                <p>
                                    The GIS for Natura 2000 Intranet web-application was developed to make Natura2000 data accessible to a large(r) amount of people within the European Commission through an easy-to-use intuitive interface. Currently an ESRI ArcObjects desktop application (developed by JRC/SADL) serves this purpose within the Commission. This desktop application has some limitations : it uses the ESRI Personal Geodatabase which is not a centralized solution (every user has his own version of the data); the application needs to be installed on each individual client computer and requires an ArcGIS license, which makes deployment costly.
                                </p>
                                <p>
                                    As Natura2000 data need to be consulted by many people within the Commission, EEA proposed to develop a GIS web-application to dynamically generate maps via the Internet. This tool allows broader access to the Natura 2000 data stored in the GIS database (SQL Server/ESRI ARCSDE) using only a web browser. No extra software is needed on the client side (no extra costs). The tool will provide basic mapping and querying possibility similar to the currently used desktop application, and will add some extra functionality which Desk Officers indicated as important (based on use cases).
                                </p>
                                <p>
                                    The information contained on the Natura 2000-Gis Intranet Web-Application should be available to the Commission services at a first stage.
                                </p>
                                <h3 name="layout" className="green">Layout of the Intranet Application</h3>
                                <p>The application provides 7 ways of working with Natura2000 data:</p>
                                <ul>
                                    <li><b>Sites:</b> View/Print the Standard Data Form for a given site code or site name and look at the geographical location.</li>
                                    <li><b>Browse by Member State:</b> View/Print the Standard Data Forms for a given Member State and look at the geographical location.</li>
                                    <li><b>Species List:</b> Search for species by Latin name or group type, view a representative image and look at the geographical location.</li>
                                    <li><b>Statistics:</b> Obtain statistical information about Natura2000 database.</li>
                                    <li><b>Map Viewer:</b> Mapping tools for interactive site selection and geographical analysis.</li>
                                    <li><b>Printable Maps:</b> View/Print static map files for each Member State in PDF format.</li>
                                    <li><b>Downloads:</b> Search for different Natura2000 contents to be downloaded.</li>
                                </ul>
                                <p>
                                    Sites allows the user to view and print Standard Data Form for a certain site. This is the most common request for DG-Environment Desk Officers. On entering the sitecode or sitename, the application generates the SDF from the database. The user has also the option to add a simple map showing the site and go to its geographical location through Google Earth.

                                </p>
                                <p>
                                    Species List allows the user to search for Natura2000 species by Latin name or group type: amphibians, fishes, plants, reptiles, invertebrates, mammals and birds). The user can also visualize a representative image of the selected species and its geographical location in the Natura2000 map viewer.
                                </p>
                                <p>
                                    Statistics provides users different statistical information about Natura2000 geodatabase. These statistics shows discrepancies between descriptive and spatial data and the total area dedicated to Natura2000 sites by the different Member States and site types (C, SPA and SCI). In parallel, the user can generate more specific statistical values through a customizable interface.
                                </p>
                                <p>
                                    Map Viewer allows the user to interactively select sites, display the SDF for each selected site and print an overview report for the selected sites. To select the sites, standard GIS navigation functions are provided (zoom, pan …) and an extra query box. The extended query box provides functionality for selecting sites with following attributes (and combinations of them):
                                </p>
                                <ul>
                                    <li>SiteCode</li>
                                    <li>SiteName</li>
                                    <li>Selecting Biogeographical region</li>
                                    <li>Selecting Habitat Code / Name (in English)</li>
                                    <li>Selecting Species Code / Name (Latin Name only)</li>
                                    <li>Using Life project code</li>
                                    <li>Region (Country) (default value from welcome screen)</li>
                                </ul>
                                <p>
                                    The user will also have a tool box with basic GIS analysis tools (e.g. buffer) and an access dialog to load other background layer datasets (e.g. LUCAS).
                                </p>
                                <p>
                                    Printable Maps displays a set of predefined maps in PDF format for downloading and printing. These include an overview map of Nature2000 for the whole of Europe and an overview map for each country.
                                </p>
                                <p>
                                    In Downloads the user will have access to different Natura2000 contents to be downloaded.
                                </p>
                                <h3 name="disclaimer" className="green">Technical Disclaimer</h3>
                                <h4 name="data" className="green">On the data:</h4>
                                <p>
                                    The Natura 2000 database contains a generalized polygon layer at a scale of 1/100.000. Although is possible with GIS software to view these data with greater detail (zoom levels that zoom to as much as 1/100 or greater scales), these operations are seldom useful and do not give the user more accurate depictions of reality.
                                </p>
                                <p>
                                    It is advisable to not print maps with scales larger than 1/100 000 for analytical use.
                                </p>
                                <p>
                                    All data in the Natura 2000 database is currently only for use within the European Commission - DG ENVIRONMENT and EEA, and is not suitable for publication to the public. All available Natura 2000 sites are in the database, including sites with sensitive information of various natures.
                                </p>
                                <p>
                                    User discretion is advised.
                                </p>
                                <h4 name="application" className="green">On the application:</h4>
                                <p>
                                    The GIS for Natura 2000 Intranet application features several powerful querying possibilities. However it is not equipped to handle every possible query with the Natura 2000 data. For Advanced GIS users, use of the desktop GIS software such as ESRI's ARCGIS is preferable over the Intranet application.
                                </p>
                                <p>
                                    There is a proper tool for every job. Use it wisely.
                                </p>
                                <p>
                                    The performance of the application is closely related to the performance of the database. Due to the nature of the spatial data, and the chosen software platform, loading times are sometimes rather long. If you do not immediately see the requested page displayed, please be patient.
                                </p>
                                <p>
                                    Loading times can be quite long depending on your query. Be patient.
                                </p>
                                <h3 name="database" className="green">Database information</h3>
                                <p>The database is made available in the GCS_WGS_1984 coordinate system.</p>
                                <p>Projection parameters:</p>
                                <table className="ui basic unstackable table about-table">
                                    <tbody>
                                        <tr>
                                            <td>Name</td>
                                            <td>ETRS_1989_LAEA</td>
                                        </tr>
                                        <tr>
                                            <td>False easting</td>
                                            <td>4321000</td>
                                        </tr>
                                        <tr>
                                            <td>False northing</td>
                                            <td>3210000</td>
                                        </tr>
                                        <tr>
                                            <td>Central Meridian</td>
                                            <td>10</td>
                                        </tr>
                                        <tr>
                                            <td>Latitude of Origin</td>
                                            <td>52</td>
                                        </tr>
                                        <tr>
                                            <td>Linear Unit</td>
                                            <td>Meter</td>
                                        </tr>
                                        <tr>
                                            <td>Datum</td>
                                            <td>D_WGS_1984</td>
                                        </tr>
                                        <tr>
                                            <td>Spheroid</td>
                                            <td>GRS_1980</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <p>
                                    Current version of the database (date of the last update of the database): <b>07/01/2013</b>
                                </p>
                                <h3 name="contact" className="green">Points of contact</h3>
                                <div className="contact-list">
                                    <div className="contact">
                                        <div className="contact-image">
                                            <i className="ri-mail-line"></i>
                                        </div>
                                        <div className="contact-body">
                                            <div className="contact-name">Bruno Combal</div>
                                            <div className="contact-email">
                                                <a href="mailto: bruno.combal@ec.europa.eu">bruno.combal@ec.europa.eu</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="contact">
                                        <div className="contact-image">
                                            <i className="ri-mail-line"></i>
                                        </div>
                                        <div className="contact-body">
                                            <div className="contact-name">Mette Lund</div>
                                            <div className="contact-email">
                                                <a href="mailto: mette.lund@eea.europa.eu">mette.lund@eea.europa.eu</a>
                                            </div>
                                        </div>
                                    </div>
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
  
export default About;
