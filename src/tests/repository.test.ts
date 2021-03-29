import request from "supertest";
import app from "../../app";

describe("Repository", () => {

    it("should check if valid invalid header is given", async () => {
      const response:any = await request(app)
      .post("/repositoryDetails")
      .set({ Accept: 'application/xml' })
      .send({
        userName: "Srkahlon"
      });
      expect(response.statusCode).toBe(406);
      expect(response.body.Message).toEqual("Invalid headers, only JSON is allowed.");
    });

    it("should check if userName is given", async () => {
      const response:any = await request(app)
      .post("/repositoryDetails")
      .set({ Accept: 'application/json' })
      .send({  
      });
      expect(response.statusCode).toBe(404);
      expect(response.body.Message).toEqual("Missing required field userName.");
    });

    it("should check if valid username is given", async () => {
        const response:any = await request(app)
        .post("/repositoryDetails")
        .set({ Accept: 'application/json' })
        .send({
          userName: "Srkahlon"
        });
        expect(response.statusCode).toBe(200);
        expect(typeof response.body).toBe("object");
    });

    it("should check if invalid username is given", async () => {
        const response:any = await request(app)
        .post("/repositoryDetails")
        .set({ Accept: 'application/json' })
        .send({
          userName: "notfoundusertest"
        });
        expect(response.statusCode).toBe(404);
        expect(response.body.Message).toEqual("UserName not found on GitHub.");
    });
});


