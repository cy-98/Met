// const ENV = "dev";
const ENV = "prod";
let CONFIG = {}
if ("dev" === ENV) {
    CONFIG = {
        ENV: "dev",
        HTTP_BASE_URL: "http://127.0.0.1:8888/",
        WS_BASE_URL: "ws://127.0.0.1:8888/",
        SCHOOL_TERM: "2",
        SCHOOL_YEAR: "2019"
    }
} else {
    CONFIG = {
        ENV: "prod",
        HTTP_BASE_URL: "https://met.chpz527.cn/",
        WS_BASE_URL: "wss://met.chpz527.cn/",
        SCHOOL_TERM: "2",
        SCHOOL_YEAR: "2019",
        VERSION: "2.0.0"
    }
}

export {CONFIG};
