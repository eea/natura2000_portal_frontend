import React, { useState, useRef } from "react";
import ConfigData from "../utils/data_config.json";
import flag from "../../img/eu_flag.png";
import logo from "../../img/natura2000_logo.svg";
import logoWhite from "../../img/natura2000_logo_white.svg";
import menu from "../../img/icons/menu-icon.svg";
import close from "../../img/icons/close-icon.svg";
import {
    AccordionTitle,
    AccordionContent,
    Accordion,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    ItemContent
} from "semantic-ui-react"

const Header = (props) => {

    const [showSearch, setShowSearch] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const refMenu = useRef(null)
    
    const closeMenu = (e) => {
        if(showMenu && !refMenu.current?.contains(e.target) && !document.querySelector(".menu .search").contains(e.target) && !document.querySelector(".burger-action").contains(e.target)) {
            setShowMenu(false);
        }
    }
    document.addEventListener("mousedown",(e) => closeMenu(e));

    return (
        <header className="eea header" aria-label="Site">
            <div className="top bar">
                <div className="ui container">
                    <div className="item header-top-item official-union">
                        <img src={flag} alt="European Union flag" className="ui image"/>
                        <Dropdown text="An official website of the European Union | How do you know?" aria-label="An official website of the European Union | How do you know?" icon="chevron down" closeOnBlur={false}>
                            <DropdownMenu role="option">
                                <ItemContent>
                                    <p>All official European Union website addresses are in the <b>europa.eu</b> domain.</p>
                                    <a href="https://europa.eu/european-union/contact/institutions-bodies_en" target="_blank" rel="noreferrer">See all EU institutions and bodies</a>
                                </ItemContent>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div className="item header-top-item">
                        <Dropdown id="theme-sites" text="Environmental information systems" icon="chevron down" aria-label="Environmental information systems" closeOnBlur={false}>
                            <DropdownMenu role="option">
                                <div className="wrapper">
                                    {ConfigData.HomeLinks.map((item, i) => <DropdownItem key={i}><a href={item.Link} className="site" target="_blank" rel="noreferrer">{item.Name}</a></DropdownItem>)}
                                </div>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
            </div>
            <div>
                <div className="ui sticky">
                    <div className="main bar transparency">
                        <div className="ui container main-bar-container">
                            <div className="ui grid">
                                <div className="logo">
                                    <a title="Site logo" className="logo" href="/.">
                                        <img title="Site" src={props.active === "home" ? logoWhite : logo} alt="Natura 2000" className="ui image eea-logo"/>
                                    </a>
                                </div>
                                <div className={"main-menu" + (props.active === "home" ? " inverted" : "")}>
                                    <nav aria-label="Main">
                                        <ul className="ui text eea-main-menu tablet or lower hidden menu" id="navigation">
                                            <li className={"item search" + (showMenu || props.active.includes("search") ? " active" : "")} onClick={(e)=>{e.preventDefault(); setShowMenu(prevCheck => !prevCheck); setShowSearch(prevCheck => !prevCheck)}}>
                                                <a title="Search" href="/#/search/sites">Search</a>
                                            </li>
                                            <li className={"item" + (props.active === "tools" ? " active" : "")}>
                                                <a title="Tools" href="/#/tools">Tools</a>
                                            </li>
                                            <li className={"item" + (props.active === "reports" ? " active" : "")}>
                                                <a title="Reports" href="/#/reports">Reports</a>
                                            </li>
                                            <li className={"item" + (props.active === "downloads" ? " active" : "")}>
                                                <a title="Downloads" href="/#/downloads">Downloads</a>
                                            </li>
                                            <li className={"item" + (props.active === "about" ? " active" : "")}>
                                                <a title="About us" href="/#/about">About us</a>
                                            </li>
                                        </ul>
                                    </nav>
                                    <button className="burger-action mobile " onClick={()=>setShowMenu(prevCheck => !prevCheck)}>
                                        <img src={showMenu ? close : menu} alt="Menu navigation" className="ui image"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div id="mega-menu" className="slide down transition" hidden={showMenu ? "" : " hidden"} ref={refMenu}>
                            <div className="ui container">
                                <div className="menu-content tablet hidden mobile hidden">
                                    <div className="ui four column grid">
                                        <div className="column">
                                            <a title="Search by Natura 2000 sites" className={"sub-title" + (props.active.includes("sites") ? " active" : "")} id="publications-sub-title" href="/#/search/sites">
                                                <span>Search by Natura 2000 sites</span>
                                            </a>
                                        </div>
                                        <div className="column">
                                            <a title="Seach by Habitats" className={"sub-title" + (props.active.includes("habitats") ? " active" : "")} id="publications-sub-title" href="/#/search/habitats">
                                                <span>Seach by Habitats</span>
                                            </a>
                                        </div>
                                        <div className="column">
                                            <a title="Search by Species" className={"sub-title" + (props.active.includes("species") ? " active" : "")} id="publications-sub-title" href="/#/search/species">
                                                <span>Search by Species</span>
                                            </a>
                                        </div>
                                        <div className="column">
                                            <a title="EUNIS" className="sub-title" id="publications-sub-title" href="https://eunis.eea.europa.eu/" target="_blank" rel="noreferrer">
                                                <span>EUNIS<i className="icon ri-external-link-line"></i></span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="tablet only mobile only">
                                    <Accordion>
                                        <AccordionTitle
                                            active={showSearch}
                                            index={0}
                                            onClick={()=>setShowSearch(prevCheck => !prevCheck)}
                                            title="Search"
                                        >
                                            Search<i aria-hidden="true" className="small icon ri-arrow-down-s-line"></i>
                                        </AccordionTitle>
                                        <AccordionContent active={showSearch}>
                                            <a title="Search by Natura 2000 sites" className={"item sub-title" + (props.active.includes("sites") ? " active" : "")} id="publications-sub-title" href="/#/search/sites">
                                                <span>Search by Natura 2000 sites</span>
                                            </a>
                                            <a title="Seach by Habitats" className={"item sub-title" + (props.active.includes("habitats") ? " active" : "")} id="publications-sub-title" href="/#/search/habitats">
                                                <span>Seach by Habitats</span>
                                            </a>
                                            <a title="Search by Species" className={"item sub-title" + (props.active.includes("species") ? " active" : "")} id="publications-sub-title" href="/#/search/species">
                                                <span>Search by Species</span>
                                            </a>
                                            <a title="EUNIS" className="item sub-title" id="publications-sub-title" href="https://eunis.eea.europa.eu/" target="_blank" rel="noreferrer">
                                                <span>EUNIS<i className="icon ri-external-link-line"></i></span>
                                            </a>
                                        </AccordionContent>
                                        <a className={"title" + (props.active === "tools" ? " active" : "")} href="/#/tools" title="Tools">Tools</a>
                                        <a className={"title" + (props.active === "reports" ? " active" : "")} href="/#/reports" title="Reports">Reports</a>
                                        <a className={"title" + (props.active === "downloads" ? " active" : "")} href="/#/downloads" title="Downloads">Downloads</a>
                                        <a className={"title" + (props.active === "about" ? " active" : "")} href="/#/about" title="About us">About us</a>
                                    </Accordion>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
  
export default Header;
