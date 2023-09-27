jest.mock("../../../../../lib/database/models/User", () => {});
jest.mock("../../../../../lib/services/reddit");
jest.mock("../../../../../lib/utils/debug");
jest.mock("../../../../../lib/utils/date");
jest.mock("../../../../../lib/queries/users");

import * as userQueries from "../../../../../lib/queries/users";
import * as redditService from "../../../../../lib/services/reddit";
import * as utilsDate from "../../../../../lib/utils/date";
import * as utilsDebug from "../../../../../lib/utils/debug";

import getRedirect from "../../../../../lib/routes/auth/get-redirect";
import { AxiosResponse } from "axios";
import User from "../../../../../lib/database/models/User";
import {  Request, Response } from "express";

const exchangeCodeForTokensReq = jest.spyOn(
  redditService,
  "exchangeCodeForTokensReq"
);
const getUserInfo = jest.spyOn(redditService, "getUserInfo");
const getUserByUsername = jest.spyOn(userQueries, "getUserByUsername");
const updateUser = jest.spyOn(userQueries, "updateUser");
const calcExpiresOn = jest.spyOn(utilsDate, "calcExpiresOn");
const logRequest = jest.spyOn(utilsDebug, "logRequest");

describe("lib/routes/auth/get-redirect", () => {
  
  const fakeReq: Request = {
    query: {
      state: "fakeState",
      code: "fakeCode",
    },
    session: {},
  } as unknown as Request;
  const fakeRes = {
    status: jest.fn(() => fakeRes),
    json: jest.fn(),
    send: jest.fn(),
    render: jest.fn(),
    redirect: jest.fn(),
  } as unknown as Response;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TODO: should call redirect method when user does not already exist

  it("should call redirect method when user already exists", async () => {
    const expectedDate = new Date();
    const tokenData = {
      access_token: "accessToken",
      refresh_token: "refreshToken",
      expires_in: 3600,
    };
    const user: User = {} as unknown as User;
    user.id = 1;
    user.username = "username";
    user.access_token = tokenData.access_token;
    user.refresh_token = tokenData.refresh_token;
    user.expires_on = expectedDate;

    exchangeCodeForTokensReq.mockResolvedValueOnce({
      data: tokenData,
    } as AxiosResponse);
    getUserByUsername.mockResolvedValue([user]);
    updateUser.mockResolvedValueOnce(1);
    getUserInfo.mockResolvedValueOnce({
      data: { name: "fakeUsername" },
    } as AxiosResponse);
    calcExpiresOn.mockReturnValueOnce(expectedDate);

    await getRedirect(fakeReq, fakeRes);

    expect(exchangeCodeForTokensReq).toHaveBeenCalledWith("fakeCode");
    expect(calcExpiresOn).toHaveBeenCalledWith(3600);
    expect(getUserInfo).toHaveBeenCalledWith("accessToken");
    expect(fakeRes.redirect).toHaveBeenCalledWith("/");
  });

  it("should catch an error, log it, and respond with 400 status code", async () => {
    const expectedError = new Error("Exchange code for token failed!");
    exchangeCodeForTokensReq.mockRejectedValueOnce(expectedError);

    await getRedirect(fakeReq, fakeRes);

    expect(logRequest).toHaveBeenCalledWith(
      "getRedirect error: Exchange code for token failed!"
    );
    expect(fakeRes.status).toHaveBeenCalledWith(400);
    expect(fakeRes.status(200).send).toHaveBeenCalledWith({ success: false });
  });
});
