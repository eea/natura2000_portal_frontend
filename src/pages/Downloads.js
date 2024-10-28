import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import * as Utils from "./components/Utils";
import ConfigJson from "../config.json";
import ConfigData from "./utils/data_config.json";
import {
    Select,
    Input,
    Message,
    Modal,
    ModalHeader,
    ModalContent,
    ModalActions
} from "semantic-ui-react"

const Downloads = () => {

    const [showModal, setShowModal] = useState(false);
    const [downloadType, setDownloadType] = useState("");
    const [fields, setFields] = useState({});
    const [errors, setErrors] = useState({});
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [data, setData] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorLoading, setErrorLoading] = useState(false);
    const [showDescription, setShowDescription] = useState(false);

    useEffect(() => {
        Utils.toggleDescription(showDescription, setShowDescription);
    }, [showDescription]);

    useEffect(() => {
        if(showModal && !data) {
            loadData();
        }
    }, [showModal, data]);

    const loadData = () => {
        setLoading(true);
        let promises = [];
        let url = ConfigJson.LoadReleases;
        promises.push(
            fetch(url)
            .then(response =>response.json())
            .then(data => {
                if(data?.Success) {
                    setData(ConfigData.Releases);
                }
                else {
                    setErrorLoading(true);
                }
            })       
        );
        Promise.all(promises)
        .then(results => {
            setLoading(false);
        });
    }

    const onChangeFields = (event, data) => {
        let field = data.name;
        let value = data.value;
        if(value === "") {
            setFields(Object.entries(fields).reduce((a,[k,v]) => (k !==field ? (a[k]=v, a) : a), {}));
        }
        else {
            setFields({ ...fields, [field]: value});
        }
        if(errors[field]) {
            setErrors({ ...errors, [field]: false});
        }
    }

    const openModal = (product) => {
        setShowModal(true);
        setDownloadType(product);
    }

    const closeModal = () => {
        setShowModal(false);
        setFields({});
        setErrors({});
        setData(false);
    }

    const renderModal = () => {
        let modal = ConfigData.Downloads.find(a=>a.Product === downloadType);
        
        let fields = []
        for(let i in modal.Fields) {
            fields.push(
                renderFields(modal.Fields[i])
            );
        }
        return (
            <>
                <ModalHeader>{modal.Name}</ModalHeader>
                <ModalContent>
                    <div className="description mb-2">
                        {modal.Description}
                    </div>
                    <div className="ui form">
                        {
                            fields.map((item, i) => 
                                <React.Fragment key={i}>{item}</React.Fragment>
                            )
                        }
                    </div>
                    <Message success hidden={!showSuccessMessage} onDismiss={()=>setShowSuccessMessage(false)}>
                        <i className="check circle icon"></i>
                        You will receive your download by email
                    </Message>
                    <Message error hidden={loading || !errorLoading}>
                        <i className="triangle exclamation icon"></i>
                        Something went wrong
                    </Message>
                </ModalContent>
                <ModalActions>
                    <button className="ui button cancel" onClick={()=>closeModal()}>Cancel</button>
                    <button className="ui button primary ok submit" disabled={loading ||errorLoading} onClick={(e)=>downloadProduct(e, modal.Product)}>Download</button>
                </ModalActions>
            </>
        )
    }

    const renderFields = (field) => {
        switch (field) {
            case "country":
                return (
                    <div className="field">
                        <label>Member State</label>
                        <Select
                            placeholder="Select a country"
                            name="country"
                            options=
                                {
                                    ConfigData.Countries.map((item, i) => (
                                        {
                                            key: item.CountryCode, value: item.CountryCode, text: item.CountryName, selected: fields[field] === item.CountryCode
                                        }
                                    ))
                                }
                            value={fields[field]}
                            onChange={onChangeFields}
                            selectOnBlur={false}
                            error={errors[field]}
                            loading={loading}
                            disabled={loading ||errorLoading}
                        />
                    </div>
                );
            case "release":
                return (
                    <div className="field">
                        <label>Release</label>
                        <Select
                            placeholder="Select a release"
                            name="release"
                            options=
                                {
                                    data && data.map((item, i) => (
                                        {
                                            key: item.ReleaseId, value: item.ReleaseId.toString(), text: (item.ReleaseName + " (" + item.ReleaseDate + ")"), selected: fields[field] === item.ReleaseId
                                        }
                                    ))
                                }
                            value={fields[field]}
                            onChange={onChangeFields}
                            selectOnBlur={false}
                            error={errors[field]}
                            loading={loading}
                            disabled={loading ||errorLoading}
                        />
                    </div>
                );
            case "delivery":
                return (
                    <div className="field">
                        <label>Delivery date</label>
                        <Select
                            placeholder="Select a release"
                            name="delivery"
                            options=
                                {
                                    ConfigData.Releases.map((item, i) => (
                                        {
                                            key: item.ReleaseId, value: item.ReleaseId.toString(), text: (item.ReleaseName + " (" + item.ReleaseDate + ")"), selected: fields[field] === item.ReleaseId
                                        }
                                    ))
                                }
                            value={fields[field]}
                            onChange={onChangeFields}
                            selectOnBlur={false}
                            error={errors[field]}
                        />
                    </div>
                );
            case "releasefrom":
                return (
                    <div className="field">
                        <label>Release from</label>
                        <Select
                            placeholder="Select a release"
                            name="to"
                            options=
                                {
                                    ConfigData.Releases.map((item, i) => (
                                        {
                                            key: item.ReleaseId, value: item.ReleaseId.toString(), text: (item.ReleaseName + " (" + item.ReleaseDate + ")"), selected: fields[field] === item.ReleaseId
                                        }
                                    ))
                                }
                            value={fields[field]}
                            onChange={onChangeFields}
                            selectOnBlur={false}
                            error={errors[field]}
                        />
                    </div>
                );
            case "releaseto":
                return (
                    <div className="field">
                        <label>Release to</label>
                        <Select
                            placeholder="Select a release"
                            name="to"
                            options=
                                {
                                    ConfigData.Releases.map((item, i) => (
                                        {
                                            key: item.ReleaseId, value: item.ReleaseId.toString(), text: (item.ReleaseName + " (" + item.ReleaseDate + ")"), selected: fields[field] === item.ReleaseId
                                        }
                                    ))
                                }
                            value={fields[field]}
                            onChange={onChangeFields}
                            selectOnBlur={false}
                            error={errors[field]}
                        />
                    </div>
                );
            case "consecutive":
                return (
                    <div className="field">
                        <label>Releases</label>
                        <Select
                            placeholder="Select a release"
                            name="consecutive"
                            options=
                                {
                                    ConfigData.Releases.map((item, i) => (
                                        {
                                            key: item.ReleaseId, value: item.ReleaseId.toString(), text: (item.ReleaseName + " (" + item.ReleaseDate + ")"), selected: fields[field] === item.ReleaseId
                                        }
                                    ))
                                }
                            value={fields[field]}
                            onChange={onChangeFields}
                            selectOnBlur={false}
                            error={errors[field]}
                        />
                    </div>
                );
            case "email":
                return (
                    <div className="field">
                        <label>Email address</label>
                        <Input
                            type="text"
                            placeholder="Enter your email adress"
                            name="email"
                            value={fields.email}
                            onChange={onChangeFields}
                            autoComplete="off"
                            error={errors.email}
                            disabled={loading ||errorLoading}
                        />
                    </div>
                );
            default:
                return;
        }
    }

    const downloadProduct = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        if(validateFields(product)) {
            // send request
            setShowSuccessMessage(true);
        }
    }

    const validateFields = (product) => {
        let productErrors = {};
        let productFields = ConfigData.Downloads.find(a=>a.Product === product).Fields;
        for (let item in productFields) {
            let field = productFields[item];
            let value = fields[field];
            productErrors[field] = !value ? true : false;
        }
        setErrors(productErrors);
        return Object.values(productErrors).every(a=>a===false);
    }

    return (
        <div className="main">
            <Header active="downloads"/>
            <div id="page-header">
                <div className="eea banner">
                    <div className="image">
                        <div className="gradient">
                            <div className="ui container">
                                <div className="content">
                                    <h1 className="documentFirstHeading title">Downloads</h1>
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
                                    Data processing functions that generate ready-to-download results.

                                </p>
                                {showDescription !== "all" &&
                                    <button className="ui button text" onClick={() => setShowDescription(prevCheck => prevCheck === "show" ? "hide" : "show")}>
                                        {showDescription === "show" ? "Hide description" : "Show description"}
                                    </button>
                                }
                            </div>
                            <div className="download-list">
                                {
                                    ConfigData.Downloads.map((item, i) => 
                                        <div className="download" key={i}>
                                            <div className="download-image">
                                                <i className="ri-inbox-archive-fill"></i>
                                            </div>
                                            <div className="download-text">
                                                <div className="download-title">{Utils.highlightSensitiveText(item.Name)}</div>
                                                <div className="download-description">{Utils.highlightSensitiveText(item.Description)}</div>
                                            </div>
                                            <div className="download-button">
                                                <button className="ui button primary" onClick={() => openModal(item.Product)}>Download</button>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <Footer/>
            <Modal
                closeIcon
                open={showModal}
                onClose={() => closeModal()}
            >
                {showModal && renderModal()}
            </Modal>
        </div>
    );
};

export default Downloads;
