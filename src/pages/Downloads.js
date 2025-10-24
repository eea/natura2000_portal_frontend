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
        let url;
        if(downloadType === "SubmissionComparer") {
            url = ConfigJson.GetSubmissions + ConfigData.ReleasesFilters;
            promises.push(
                fetch(url)
                .then(response => response.json())
                .then(data => {
                    if(data?.Success) {
                        const releases = data.Data.map(country => ({
                            ...country,
                            Submissions: country.Submissions.sort((a, b) => convertToDate(b.ImportDate) - convertToDate(a.ImportDate))
                        }));
                        setData(releases);
                    }
                    else {
                        setErrorLoading(true);
                    }
                })       
            );
        }
        else {
            url = ConfigJson.GetReleases + ConfigData.ReleasesFilters;
            promises.push(
                fetch(url)
                .then(response => response.json())
                .then(data => {
                    if(data?.Success) {
                        let releases = data.Data.sort((a, b) => new Date(b.ReleaseDate) - new Date(a.ReleaseDate));
                        releases = releases.map(a => ({...a, "OriginalDate": a.ReleaseDate,"ReleaseDate": Utils.formatDate(a.ReleaseDate)}));
                        setData(releases);
                    }
                    else {
                        setErrorLoading(true);
                    }
                })
            );
        }
        Promise.all(promises)
        .then(results => {
            setLoading(false);
        });
    }

    const convertToDate = (dateString) => {
        const [day, month, year] = dateString.split('-');
        return new Date(`${year}-${month}-${day}`);
    };

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
        if(field === "countryCode") {
            setFields(prevFields => {
                const { versionFrom, versionTo, ...rest } = prevFields;
                return rest;
            });
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
            case "countryCode":
                return (
                    <div className="field">
                        <label>Country</label>
                        <Select
                            placeholder="Select a country"
                            name="countryCode"
                            options={
                                data && data.map((item) => ({
                                    key: item.CountryCode,
                                    value: item.CountryCode,
                                    text: ConfigData.ReportsCountries.find(a => a.CountryCode === item.CountryCode).CountryName,
                                    selected: fields[field] === item.CountryCode
                                }))
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
            case "releaseId":
                return (
                    <div className="field">
                        <label>Release</label>
                        <Select
                            placeholder="Select a release"
                            name="releaseId"
                            options={
                                data && data.map((item) => ({
                                    key: item.ReleaseId,
                                    value: item.ReleaseId.toString(),
                                    text: item.ReleaseName + " (" + item.ReleaseDate + ")",
                                    selected: fields[field] === item.ReleaseId
                                }))
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
            case "versionFrom":
                return (
                    <div className="field">
                        <div className="ui grid">
                            <div className="six wide computer twelve wide mobile six wide tablet column column-blocks-wrapper">
                                <div className="field">
                                    <label>Submission from</label>
                                    <Select
                                        placeholder="Select a submission"
                                        name="versionFrom"
                                        options={
                                            data && fields.countryCode && data.find(a => a.CountryCode === fields.countryCode).Submissions.map((item, i) => ({
                                                key: item.VersionID,
                                                value: item.VersionID.toString(),
                                                text: item.ImportDate +" (" + item.VersionID + ")"
                                            }))
                                        }
                                        value={fields.versionFrom?.toString() || null}
                                        onChange={onChangeFields}
                                        selectOnBlur={false}
                                        error={errors["versionFrom"]}
                                        loading={loading}
                                        disabled={loading || errorLoading || downloading || !fields.countryCode}
                                    />
                                </div>
                            </div>
                            <div className="six wide computer twelve wide mobile six wide tablet column column-blocks-wrapper">
                                <div className="field">
                                    <label>Submission to</label>
                                    <Select
                                        placeholder="Select a submission"
                                        name="versionTo"
                                        options={
                                            data && fields.countryCode && fields.versionFrom && data.find(a => a.CountryCode === fields.countryCode).Submissions.filter(a => new Date(convertToDate(a.ImportDate)) > new Date(convertToDate(data.find(a => a.CountryCode === fields.countryCode).Submissions.find(b => b.VersionID === parseInt(fields.versionFrom))?.ImportDate))).map((item, i) => ({
                                                key: item.VersionID,
                                                value: item.VersionID.toString(),
                                                text: item.ImportDate +" (" + item.VersionID + ")"
                                           }))
                                        }
                                        value={fields.versionTo?.toString() || null}
                                        onChange={onChangeFields}
                                        selectOnBlur={false}
                                        error={errors["versionFrom"]}
                                        loading={loading}
                                        disabled={loading || errorLoading || downloading || !fields.countryCode || !fields.versionFrom || data.find(a => a.CountryCode === fields.countryCode).Submissions[0].VersionID === parseInt(fields.versionFrom)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case "versionTo":
                return null;
            case "email":
                return (
                    <div className="field">
                        <label>Email address</label>
                        <Input
                            type="text"
                            placeholder="Enter your email address"
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
                return null;
        }
    }

    const downloadProduct = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        if(validateFields(product)) {
            if(product === "ComputingSAC") {
                downloadRequest(product);
            }
            else if(product === "SpatialData") {
                downloadFile(product);
            }
            else if(product === "SubmissionComparer") {
                downloadRequest(product);
            }
            else {
                setDownloading(true);
                let release = data.find(a => a.ReleaseId.toString() === fields.releaseId);
                let url = "";
                let filename;
                switch(product) {
                    case "DescriptiveDataSensitive":
                        url = release["SensitiveMDB"];
                        filename = "Natura2000OfficialDescriptive_" + release.ReleaseName;
                        break;
                    case "DescriptiveData":
                        url = release["PublicMDB"];
                        filename = "Natura2000PublicDescriptive_" + release.ReleaseName;
                        break;
                }
                let link = document.createElement("a");
                link.href = url;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setDownloading(false);
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

    const downloadFile = (product) => {
        setDownloading(true);
        let url = ConfigJson["Download" + product] + "?" + new URLSearchParams(fields);
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
                })
            } else {
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
