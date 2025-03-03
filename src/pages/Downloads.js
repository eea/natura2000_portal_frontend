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
    ModalActions,
    Loader
} from "semantic-ui-react"

const Downloads = () => {

    const [showModal, setShowModal] = useState(false);
    const [downloadType, setDownloadType] = useState("");
    const [fields, setFields] = useState({});
    const [errors, setErrors] = useState({});
    const [data, setData] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorLoading, setErrorLoading] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [errorDownloading, setErrorDownloading] = useState(false);
    const [successDownloading, setSuccessDownloading] = useState(false);
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
        let url = ConfigJson.GetReleases + ConfigData.ReleasesFilters;
        promises.push(
            fetch(url)
            .then(response => response.json())
            .then(data => {
                if(data?.Success) {
                    let releases = data.Data.sort((a, b) => new Date(b.ReleaseDate) - new Date(a.ReleaseDate));
                    releases = releases.map(a => ({...a, "ReleaseDate": Utils.formatDate(a.ReleaseDate)}));
                    setData(releases);
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
        setDownloading(false);
        setSuccessDownloading(false);
        setErrorDownloading(false);
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
                <ModalHeader>{Utils.highlightSensitiveText(modal.Name)}</ModalHeader>
                <ModalContent>
                    <div className="description mb-2">
                        {Utils.highlightSensitiveText(modal.Description)}
                    </div>
                    <div className="ui form">
                        {
                            fields.map((item, i) => 
                                <React.Fragment key={i}>{item}</React.Fragment>
                            )
                        }
                    </div>
                    <Message success hidden={!successDownloading} onDismiss={()=>setSuccessDownloading(false)}>
                        <i className="check circle icon"></i>
                        You will receive your download by email
                    </Message>
                    <Message error hidden={loading || !errorDownloading} onDismiss={()=>setErrorDownloading(false)}>
                        <i className="triangle exclamation icon"></i>
                        Something went wrong
                    </Message>
                </ModalContent>
                <ModalActions>
                    <button className="ui button cancel" disabled={loading || errorLoading || downloading} onClick={()=>closeModal()}>Cancel</button>
                    <button className="ui button primary ok submit" disabled={loading || errorLoading || downloading} onClick={(e)=>downloadProduct(e, modal.Product)}>
                        {downloading ? <Loader active={true} size="mini"></Loader> : <i className="icon ri-download-line"></i>}Download
                    </button>
                </ModalActions>
            </>
        )
    }

    const renderFields = (field) => {
        switch (field) {
            case "releaseId":
                return (
                    <div className="field">
                        <label>Release</label>
                        <Select
                            placeholder="Select a release"
                            name="releaseId"
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
                            disabled={loading || errorLoading || downloading}
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
                            value={fields[field]}
                            onChange={onChangeFields}
                            autoComplete="off"
                            error={errors[field]}
                            disabled={loading || errorLoading || downloading}
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
            if(product === "ComputingSAC") {
                downloadRequest(product);
            }
            else {
                setDownloading(true);
                let release = data.find(a => a.ReleaseId.toString() === fields.releaseId);
                let url = "";
                let filename = "";
                switch(product) {
                    case "DescriptiveDataSensitive":
                        url = release["SensitiveMDB"];
                        filename = "Natura2000OfficialDescriptive_" + release.ReleaseName;
                        url="https://n2kportal.eea.europa.eu/n2kportal/mdbofficial/end2010/Natura2000OfficialDescriptive.mdb"
                        break;
                    case "DescriptiveData":
                        url = release["PublicMDB"];
                        filename = "Natura2000PublicDescriptive_" + release.ReleaseName;
                        url="https://sdi.eea.europa.eu/datashare/s/sJctC9e89F5DZSs/download?path=%2F&files=ACCESS%20DB&downloadStartSecret=se84velkpji"
                        break;
                    case "SpatialData":
                        url = release["SHP"];
                        filename = "Natura2000Spatial_" + release.ReleaseName;
                        url="https://sdi.eea.europa.eu/datashare/s/NPpTTHmERYszoLX/download?path=%2F&files=SHP&downloadStartSecret=u3ge6biofd"
                        break;
                }
                fetch(url)
                .then(data => {
                    if(data?.ok) {
                        data.blob()
                        .then(blobresp => {
                            let link = document.createElement("a");
                            link.download = filename;
                            link.href = window.URL.createObjectURL(blobresp);
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            setDownloading(false);
                        })
                    }
                    else {
                        setErrorDownloading(true);
                        setDownloading(false);
                    }
                })
            }
        }
    }

    const validateFields = (product) => {
        let productErrors = {};
        let productFields = ConfigData.Downloads.find(a=>a.Product === product).Fields;
        for (let item in productFields) {
            let field = productFields[item];
            let value = fields[field];
            if(field === "email") {
                const validateEmail = (email) => {
                    return email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
                };
                productErrors[field] = value && (value.trim() === "" || validateEmail(value)) ? false : true;
            }
            else {
                productErrors[field] = !value ? true : false;
            }
        }
        setErrors(productErrors);
        return Object.values(productErrors).every(a=>a === false);
    }

    const downloadRequest = (product) => {
        setDownloading(true);
        let url = ConfigJson["Download" + product] + "?" + new URLSearchParams(fields);
        fetch(url)
        .then(response => response.json())
        .then(data => {
            if(data?.Success) {
                setSuccessDownloading(true);
            }
            else {
                setErrorDownloading(true);
            }
            setDownloading(false);
        })
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
                                                <button className="ui button primary" onClick={() => openModal(item.Product)}>Go to download</button>
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
