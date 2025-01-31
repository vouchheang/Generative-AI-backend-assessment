import { Request, Response } from "express";
import { UserInfo } from "../entity/user.entity";
import { Certificate } from "../entity/certificate.entity";
import { AppDataSource } from "../config";
import { RoleEnum, RoleType } from "../common";

export const createCertificate = async (req: Request, res: Response) => {
  try {
    const userRepo = AppDataSource.getRepository(UserInfo);
    const certificateRepo = AppDataSource.getRepository(Certificate);

    const { userId, courseName } = req.body;

    if (!courseName) {
      return res.status(500).json({
        message: "userId and courseName are required",
      });
    }

    const certificateData = new Certificate();
    certificateData.user = userId;
    certificateData.courseName = courseName;
    await certificateRepo.save(certificateData);

    return res.status(200).json({
      id: certificateData.id,
      userID: userId.id,
      courseName,
      createdAt: certificateData.createdAt,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCertificatebyuseID = async (req: Request, res: Response) => {
  try {
    const certificateRepo = AppDataSource.getRepository(Certificate);
    const userId = req.user?.id;

    // Fetch all certificates for the user
    const certificates = await certificateRepo.find({
      relations: ["user"],
      where: { id: userId },
    });

    // Use Map the response data bcuz one user can have many certificates
    const responseData = certificates.map((data) => ({
      id: data.id,
      courseName: data.courseName,
      createdAt: data.createdAt,
    }));

    return res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCertificatebyId = async (req: Request, res: Response) => {
  try {
    const certificateRepo = AppDataSource.getRepository(Certificate);
    const certificateId = req.params.id;
    const certificatess = await certificateRepo.findOne({
      where: { id: certificateId },
    });

    return res.status(200).json(certificatess);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deletecertificate = async (req: Request, res: Response) => {
  const certificateRepo = AppDataSource.getRepository(Certificate);
  const certificateId = req.params.id;

  try {
    const certificate = await certificateRepo.findOneBy({ id: certificateId });
    await certificateRepo.delete({ id: certificateId });

    if (!certificate) {
      return res.status(400).json({ message: "certificate not found" });
    }
    return res
      .status(200)
      .json({ message: "certificate deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
