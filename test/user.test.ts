import { expect } from "chai";
import * as sinon from "sinon"; // Import sinon

import UserController from "../src/controllers/userController"; // Make sure to import User if not already imported
import bcrypt from "bcryptjs";
import User, { UserDocument } from "../src/models/User";

describe("UserController", () => {
    const userController = new UserController();

    // Register a new user with valid name, email, and password
    it("should register a new user with valid name, email, and password", () => {
        // Mock request and response objects
        const req = {
            body: {
                name: "John Doe",
                email: "johndoe@example.com",
                password: "password123",
            },
        };
        const next = { status: sinon.spy() };
        const res = {
            status: sinon.spy(),
            json: sinon.spy(),
        };

        // Call the registerUser method
        userController.registerUser(req as any, res as any, next as any);

        // Assertions
        expect(res.status.calledWith(201)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
        expect(
            res.json.calledWith(
                sinon.match({
                    _id: sinon.match.string,
                    name: "John Doe",
                    email: "johndoe@example.com",
                }),
            ),
        ).to.be.true;
    });

    // Login an existing user with valid email and password
    it("should login an existing user with valid email and password", () => {
        // Mock request and response objects
        const req = {
            body: {
                email: "igwesiemmanuel4@gmail.com",
                password: "kelechi12",
            },
        };
        const res = {
            status: sinon.spy(),
            json: sinon.spy(),
            cookie: sinon.spy(),
        };
        const next = { status: sinon.spy() };

        // Mock User.findOne method
        const findOneStub: sinon.SinonStub = sinon.stub(User, "findOne");
        findOneStub.withArgs({ email: "dchief200@gmail.com" }).returns({
            select: sinon.stub().returnsThis() as any,
            exec: sinon.stub().resolves({
                _id: "user123",
                name: "John Doe",
                email: "dchief200@gmail.com",
                password: bcrypt.hashSync("password123", 10),
            } as UserDocument),
        });

        // Call the loginUser method
        userController.loginUser(req as any, res as any, next as any);

        // Assertions
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
        expect(
            res.json.calledWith(
                sinon.match({
                    _id: "user123",
                    name: "John Doe",
                    email: "johndoe@example.com",
                }),
            ),
        ).to.be.true;
        expect(res.cookie.calledOnce).to.be.true;

        // Restore stubbed methods
        findOneStub.restore();
    });

    // Logout a logged-in user
    it("should logout a logged-in user", () => {
        // Mock request and response objects
        const req = {};
        const res = {
            cookie: sinon.spy(),
            status: sinon.spy(),
            json: sinon.spy(),
        };
        const next = { status: sinon.spy() };

        // Call the logout method
        userController.logout(req as any, res as any, next as any);

        // Assertions
        expect(res.cookie.calledOnce).to.be.true;
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith({ message: "Successfully Logged Out" })).to
            .be.true;
    });

    // Register a new user with missing name, email, or password
    it("should not register a new user with missing name, email, or password", () => {
        // Mock request and response objects
        const req = {
            body: {
                name: "John Doe",
                email: "igwesiemmanuel4@gmail.com",
                password: "password123",
            },
        };
        const res = {
            status: sinon.spy(),
            throw: sinon.spy(),
        };
        const next = { status: sinon.spy() };

        // Call the registerUser method
        userController.registerUser(req as any, res as any, next as any);

        // Assertions
        expect(res.status.calledWith(400)).to.be.true;
        expect(res.throw.calledOnce).to.be.true;
        expect(res.throw.calledWith("Please fill in all required fields")).to.be
            .true;
    });
});
