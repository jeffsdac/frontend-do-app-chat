const BASE_URL = "http://localhost:8080"

export async function getHeartBeat() {
    const endpoint = "/api/v1/heartbeat";
    try{
        const resp = await fetch(BASE_URL + endpoint);
        return resp.json();
    } catch(error){
        console.error("ERROR TO SEND REQUEST TO ENDPOINT: " + endpoint);
        console.error(error);
    }
}