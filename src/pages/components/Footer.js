import React from "react";
import Logo from "../../img/eea_logo_white.svg";

const Footer = () => {
    
    return (
        <footer id="footer">
            <div className="footer-wrapper">
                <div className="ui container">
                    <div className="subfooter">
                        <div className="ui grid flex-items-center">
                            <div className="six wide computer six wide tablet twelve wide mobile column">
                                <div className="item">
                                    <div className="site logo mb-2">
                                        <a href="https://www.eea.europa.eu/">
                                            <img src={Logo} alt="EEA Logo" className="ui image"/>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="six wide computer six wide tablet twelve wide mobile column">
                                <div className="item">
                                    <div className="contact-block">
                                        <div className="contact">
                                            <a className="bold" href="/#/about">About us</a>
                                        </div>
                                        <div className="contact">
                                            <a className="bold" href="/#/about#contact">Contact us</a>
                                        </div>
                                        <div className="contact">
                                            <p>
                                                <i className="ri-map-pin-fill"></i> European Environment Agency (EEA), Kongens Nytorv 6, 1050 Copenhagen K, Denmark
                                            </p>
                                            <p>
                                                <i className="ri-phone-fill"></i> <a href="tel:+45 33 36 71 00" rel="noopener">+45 33 36 71 00</a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="menu">
                        <div className="ui grid">
                            <div className="twelve wide column">
                                <div className="actions">
                                    <a href="https://www.eea.europa.eu/en/privacy" target="_blank" rel="noreferrer">
                                        Privacy statement
                                    </a>
                                    <a href="https://www.eea.europa.eu/en/accessibility" target="_blank" rel="noreferrer">
                                        Accessibility
                                    </a>
                                    <a href="https://www.eea.europa.eu/en/legal-notice" target="_blank" rel="noreferrer">
                                        Legal notice
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;
