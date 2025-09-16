import prisma from "../Config/config";
import {
  compareHash,
  generateAccessToken,
  generateOtp,
  generateRefreshToken,
  hashPassword,
  transporter,
} from "../Utils/utilities";
import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "";
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "";
const VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_ID || "";

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid Credentials...");
  if (user.isDeleted) throw new Error("Invalid Credentials...");
  if (!user.isActive) throw new Error("This Account is deactivated");

  const isPasswordValid = await compareHash(password, user.password);
  if (!isPasswordValid) throw new Error("Invalid Credentials...");

  const accessToken = generateAccessToken({ email: user.email });
  const refreshToken = generateRefreshToken({ id: user.id });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      accessToken,
      refreshToken,
      lastLogin: new Date(),
    },
  });

  const userData = {
    id: user.id,
    username: user.username,
    role: user.role,
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
  return userData;
};

export const registerUser = async (
  email: string,
  username: string,
  fullName: string,
  phone: string,
  password: string
) => {
  const isUser = await prisma.user.findUnique({ where: { email: email } });
  if (isUser) throw new Error("User already exists.");

  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      username,
      fullName,
      phone,
      password: hashedPassword,
    },
  });

  return user;
};

export const changeUserPassword = async (
  userId: number,
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found...");

  if (newPassword != confirmPassword) {
    throw new Error("password and confirmPassword does not match");
  }

  const isOldPasswordValid = await compareHash(oldPassword, user.password);
  if (!isOldPasswordValid) {
    throw new Error("Old password in incorrect");
  }

  const hashedPassword = await hashPassword(newPassword);
  const accessToken = generateAccessToken({ email: user.email });
  const refreshToken = generateRefreshToken({ id: user.id });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      accessToken: accessToken,
      refreshToken: refreshToken,
    },
  });
};

export const forgetUserPassword = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email: email },
  });
  if (!user) throw new Error("Please Register First..");

  const otp = generateOtp();
  const otpExp = new Date(Date.now() + 2 * 60 * 1000).toString();

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      otp: otp,
      otpExpiry: otpExp,
    },
  });

  await transporter.sendMail({
    from: "mueed072003@gmail.com",
    to: email,
    subject: "OTP Verification",
    text: `Hello,
    
    Your One-Time Password (OTP) for verification is: ${otp}
    
    This OTP is valid for the next 5 minutes. Please do not share this code with anyone.
    
    If you did not request this code, please ignore this email.
    
    Thank you,
    EcommerceV2
    `,
  });
};

export const resetUserPassword = async (
  otp: string,
  email: string,
  password: string,
  confirmPassword: string
) => {
  if (password != confirmPassword)
    throw new Error("password and confirmPassword does not match");

  const user = await prisma.user.findUnique({
    where: { email: email },
  });
  if (!user) throw new Error("Invalid Email...");

  const date = new Date(Date.now()).toString();
  if (date > user.otpExpiry! || otp != user.otp) {
    throw new Error("Invalid or Expired OTP ...");
  }

  const hashedPassword = await hashPassword(password);
  const accessToken = generateAccessToken({ email: user.email });
  const refreshToken = generateRefreshToken({ id: user.id });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      accessToken: accessToken,
      refreshToken: refreshToken,
      otp: null,
      otpExpiry: null,
    },
  });
};

//test email otp
export const sendloginOtp = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid Credentials...");
  if (user.isDeleted) throw new Error("Invalid Credentials...");
  if (!user.isActive) throw new Error("This Account is deactivated");

  const otp = generateOtp();
  const otpExp = new Date(Date.now() + 2 * 60 * 1000).toString();

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      otp: otp,
      otpExpiry: otpExp,
    },
  });

  await transporter.sendMail({
    from: "mueed072003@gmail.com",
    to: email,
    subject: "OTP Verification",
    text: `Hello,
    
    Your One-Time Password (OTP) for Login on ecommerceV2 is: ${otp}
    
    This OTP is valid for the next 2 minutes. Please do not share this code with anyone.
    
    If you did not request this code, please ignore this email.
    
    Thank you,
    EcommerceV2
    `,
  });
};
export const verifyEmailOtp = async (email: string, otp: string) => {
  const user = await prisma.user.findUnique({
    where: { email: email },
  });
  if (!user) throw new Error("Invalid Email...");

  const date = new Date(Date.now()).toString();
  if (date > user.otpExpiry! || otp != user.otp) {
    throw new Error("Invalid or Expired OTP ...");
  }

  const accessToken = generateAccessToken({ email: user.email });
  const refreshToken = generateRefreshToken({ id: user.id });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      accessToken: accessToken,
      refreshToken: refreshToken,
      otp: null,
      otpExpiry: null,
    },
  });
  const loggedInUser = await prisma.user.findUnique({
    select: {
      email: true,
      username: true,
      fullName: true,
      phone: true,
      accessToken: true,
      refreshToken: true,
    },
    where: {
      email,
    },
  });
  return loggedInUser;
};

// test sms OTP
const accountSid = ACCOUNT_SID;
const authToken = AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const verifyServiceId = VERIFY_SERVICE_SID;

export const sendSms = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) throw new Error(`No user with email: ${email}`);
  const phone = user.phone;
  if (!phone) throw new Error(`No phone with email: ${email}`);

  const verification = await client.verify.v2
    .services(verifyServiceId)
    .verifications.create({
      to: phone,
      channel: "sms",
    });

  return verification.status;
};

export const verifySms = async (email: string, otp: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) throw new Error(`No user with email: ${email}`);
  const phone = user.phone;
  if (!phone) throw new Error(`No phone with email: ${email}`);

  const verification = await client.verify.v2
    .services(verifyServiceId)
    .verificationChecks.create({ to: phone, code: otp });

  if (verification.status === "approved") {
    const accessToken = generateAccessToken({ email: user.email });
    const refreshToken = generateRefreshToken({ id: user.id });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
        otp: null,
        otpExpiry: null,
      },
    });
    const loggedInUser = await prisma.user.findUnique({
      select: {
        email: true,
        username: true,
        fullName: true,
        phone: true,
        accessToken: true,
        refreshToken: true,
      },
      where: {
        email,
      },
    });

    return loggedInUser
  }
};
