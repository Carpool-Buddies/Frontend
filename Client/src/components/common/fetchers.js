import {BASE_API_URL} from "../../../config/environment";


export const postCSV = async (
    filterUserExpData,
    timeStamp,
    sessionId
) => {
    try {
        const response = await fetch(`${BASE_API_URL}/fileUpload`, {
            method: "POST",
            headers: {"Content-Type": "application/json", Accept: "application/json"},
            body: JSON.stringify({
                filterUserExpData,
                timeStamp,
                sessionId
            })
        });
        return await response.json();
    } catch (error) {
        return "error"
    }
};

export const getCellIdentityGroupsData = async (
    filterUserExpData,
    timeStamp,
    sessionId
) => {
    let serverError = false;
    const response = await fetch(`${BASE_API_URL}/getCellIdentityGroupsData`, {
        method: "POST",
        headers: {"Content-Type": "application/json", Accept: "application/json"},
        body: JSON.stringify({
            filterUserExpData,
            timeStamp,
            sessionId
        })
    }).catch(e => {
        console.log("failed");
        serverError = true;
    });
    if (!serverError) {
        return await response.json().catch(e => {
            console.log(response);
            console.log(e);
            return [];
        });
    }
    return [];
};

export const getUserExpData = async (
    cluster,
    uploadedFile,
    sessionId,
    timeStamp
) => {
    let serverError = false;
    const response = await fetch(
        `${BASE_API_URL}/getDataPerCluster/${cluster}/${sessionId}/${timeStamp}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({
                uploadedFile
            })
        }
    ).catch(e => {
        console.log("failed");
        serverError = true;
    });
    if (!serverError) {
        console.log("there wasnt failure in the server");
        return await response.json().catch(e => {
            return [];
        });
    }
    return [];
};

export const getFullUserExpData = async (
    cluster,
    uploadedFile,
    sessionId,
    timeStamp
) => {
    let serverError = false;
    const response = await fetch(
        `${BASE_API_URL}/getAllDataPerCluster/${cluster}/${sessionId}/${timeStamp}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({
                uploadedFile
            })
        }
    ).catch(e => {
        console.log("failed");
        serverError = true;
    });
    if (!serverError) {
        console.log("there wasnt failure in the server");
        return await response.json().catch(e => {
            return [];
        });
    }
    return [];
}

export const getSingleProcess = async (
    selectedProcess,
    mode,
    sessionId,
    timeStamp
) => {
    try {
        const response = await fetch(
            `${BASE_API_URL}/singleProcess?process=${selectedProcess}&mode=${mode}&sessionId=${sessionId}&timeStamp=${timeStamp}`,
            {
                headers: {"Content-Type": "application/json"}
            })
        return await response.json();
    } catch
        (e) {
        console.log(e);
        return null
    }
};


export const getProcessesByGenes = async selectedGene => {
    const response = await fetch(
        `${BASE_API_URL}/processesByGenes?gene=${selectedGene}`,
        {
            headers: {"Content-Type": "application/json"}
        }
    ).catch(e => {
        console.log(e);
    });
    return await response.json();
};

export const getProcessesByMultipleGenes = async selectedGenes => {
    try {
        const response = await fetch(
            `${BASE_API_URL}/processesByMultipleGenes?genes=${(selectedGenes)}`,
            {
                headers: {"Content-Type": "application/json"}
            }
        )
        return await response.json();
    } catch
        (e) {
        console.log(e);
        return null
    }
};

export const getMultipleProcesses = async (
    selectedProcesses,
    mode,
    sessionId,
    timeStamp
) => {
    try {
        const response = await fetch(
            `${BASE_API_URL}/multipleProcesses?processes=${selectedProcesses}&mode=${mode}&sessionId=${sessionId}&timeStamp=${timeStamp}`,
            {
                headers: {"Content-Type": "application/json"}
            }
        )
        return await response.json();
    } catch
        (e) {
        console.log(e);
        return null
    }
};


export const getSingleProcessMSigDB = async (
    selectedProcess,
    mode,
    sessionId,
    timeStamp
) => {
    try {
        const response = await fetch(
            `${BASE_API_URL}/singleProcessMSigDB?process=${selectedProcess}&mode=${mode}&sessionId=${sessionId}&timeStamp=${timeStamp}`,
            {
                headers: {"Content-Type": "application/json"}
            })
        return await response.json()
    } catch (e) {
        console.log(e);
        return null
    }
};


export const getMultipleProcessesMSigDB = async (mode, sessionId, timeStamp) => {
    try {
        const response = await fetch(
            `${BASE_API_URL}/multipleProcessesMSigDB?mode=${mode}&sessionId=${sessionId}&timeStamp=${timeStamp}`,
            {
                headers: {"Content-Type": "application/json"}
            }
        )
        return await response.json()
    } catch (e) {
        console.log(e);
        return null
    }
};


export const getTissueResults = async (
    selectedTissue,
    threshold,
    checked,
    mode,
    sessionId,
    timeStamp
) => {
    try {
        const response = await fetch(
            `${BASE_API_URL}/tissueResults/${selectedTissue}/${threshold}/${checked}/${mode}/${sessionId}/${timeStamp}`,
            {
                headers: {"Content-Type": "application/json"}
            }
        )
        return await response.json()
    } catch (e) {
        console.log(e);
        return null
    }
};


export const getTissueResultsMSigDB = async (
    selectedTissue,
    sessionId,
    timeStamp,
    mode
) => {
    try {
        const response = await fetch(
            `${BASE_API_URL}/tissueResultsMSigDB/${mode}/${selectedTissue}/${sessionId}/${timeStamp}`,
            {
                headers: {"Content-Type": "application/json"}
            }
        )
        return await response.json()
    } catch (e) {
        console.log(e);
        return null
    }
};


export const postSession = async sessionId => {
    try {
        const response2 = await fetch('https://api.ipify.org/?format=json')
        const ipData = await response2.json()
        const dataIP = ipData.ip
        const response = await fetch(`${BASE_API_URL}/postSession/${sessionId}`, {
            method: "POST",
            headers: {"Content-Type": "application/json", Accept: "application/json"},
            body: JSON.stringify({
                ip: dataIP
            })
        })
        return await response.json();
    } catch (error) {
        console.log(error)
        try {
            const response = await fetch(`${BASE_API_URL}/postSession/${sessionId}`, {
                method: "POST",
                headers: {"Content-Type": "application/json", Accept: "application/json"},
                body: JSON.stringify({
                    ip: null
                })
            });
            return await response.json()
        } catch (e) {
            console.log(e)
        }
    }
};

export const postScoreMatrix = async (uploadedFile, sessionId, timeStamp) => {
    try {
        const response = await fetch(`${BASE_API_URL}/postScoreMatrix`, {
            method: "POST",
            headers: {"Content-Type": "application/json", Accept: "application/json"},
            body: JSON.stringify({
                uploadedFile,
                sessionId,
                timeStamp
            })
        });
        return await response.json()
    } catch (e) {
        console.log(e)
        return []
    }
};

export const getSession = async (sessionId, timeStamp, jobType) => {
    try {
        const response = await fetch(
            `${BASE_API_URL}/getSession/${sessionId}/${timeStamp}/${jobType}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                }
            }
        );
        return await response.json()
    } catch (e) {
        console.log(e)
        return "error"
    }
};


export const getSessionCluster = async (sessionId, timeStamp, jobType, cluster) => {
    try {
        const response = await fetch(
            `${BASE_API_URL}/getSessionCluster/${sessionId}/${timeStamp}/${jobType}/${cluster}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                }
            }
        );
        return await response.json();
    } catch (e) {
        console.log(e)
        return "error"
    }
};


export const extractFeaturesFromFile = async uploadedFile => {
    try {
        const response = await fetch(`${BASE_API_URL}/extractFeatures`, {
            method: "POST",
            headers: {"Content-Type": "application/json", Accept: "application/json"},
            body: JSON.stringify({
                uploadedFile
            })
        });
        return await response.json();
    } catch (e) {
        console.log(e)
        return "error"
    }
};

