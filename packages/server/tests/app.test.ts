import  mocha from "mocha";
import chai from "chai";
import chaiHttp = require('chai-http');

import App from "../src/app";

chai.use(chaiHttp);

describe("baseRoute", () => {
    it("shows home page", () => {
        return chai.request(App).get("/api/items")
            .then(res => {
                chai.expect(res.type).to.eql("application/json");
            });
    });
});