import React from "react";
export const highlightSensitiveText = (text) => {
    return text.split(" ").map((word, i, array) => {
        if(text.includes("DO NOT SHARE PUBLICLY")) {
            if(word.includes("DO") || word.includes("NOT") || word.includes("SHARE") || word.includes("PUBLICLY")) {
                return <span className="sensitive" key={i}> {word}</span>
            }
        }
        if(word.includes("sensitive") && !array[i-1].includes("without")) {
            return <span className="sensitive" key={i}> {word}</span>
        }
        else {
            return <React.Fragment key={i}> {word}</React.Fragment>
        }
    })
}

export const highlightText = (text) => {
    text.replace("DO NOT SHARE PUBLICLY", <span className="sensitive">DO NOT SHARE PUBLICLY</span>);
}

export const formatDate = (date) => {
    date = new Date(date);
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    date = (d <= 9 ? "0" + d : d) + "/" + (m <= 9 ? "0" + m : m) + "/" + y;
    // date = y + "-" + (m <= 9 ? "0" + m : m) + "-" + (d <= 9 ? "0" + d : d);
    return date;
};

export const toggleDescription = (showDescription, setShowDescription) => {
    if(!showDescription) {
        if(document.querySelector(".page-description")?.scrollHeight < 6*16) {
            setShowDescription("all");
        }
        else {
            setShowDescription("hide");
        }
    }
};
