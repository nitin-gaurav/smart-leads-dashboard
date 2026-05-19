// Lead controllers for CRUD, filtering, pagination, ownership checks, and CSV export.
import { NextFunction, Response } from "express";
import { FilterQuery, SortOrder, Types } from "mongoose";
import { LEAD_SOURCES, LEAD_STATUSES } from "../constants/domain";
import { MESSAGES } from "../constants/messages";
import { Lead, LeadDocument } from "../models/lead.model";
import {
  AuthRequest,
  ILeadBody,
  IPopulatedCreatedBy,
  JwtPayload,
  LeadQuery,
  LeadSource,
  LeadStatus,
} from "../types";
import { buildCSVParser } from "../utils/csvExport";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const isLeadStatus = (value: unknown): value is LeadStatus => {
  return typeof value === "string" && LEAD_STATUSES.includes(value as LeadStatus);
};

const isLeadSource = (value: unknown): value is LeadSource => {
  return typeof value === "string" && LEAD_SOURCES.includes(value as LeadSource);
};

const parsePositiveInteger = (
  value: string | undefined,
  fallback: number
): number => {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const buildLeadFilter = (
  query: LeadQuery,
  user?: JwtPayload
): FilterQuery<LeadDocument> => {
  const filter: FilterQuery<LeadDocument> = {};

  // Sales users can only see their own leads.
  if (user?.role === "sales") {
    filter.createdBy = new Types.ObjectId(user.id);
  }

  if (isLeadStatus(query.status)) {
    filter.status = query.status;
  }

  if (isLeadSource(query.source)) {
    filter.source = query.source;
  }

  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
    ];
  }

  return filter;
};

const buildSort = (sort?: string): Record<string, SortOrder> => {
  return {
    createdAt: sort === "oldest" ? 1 : -1,
  };
};

export const createLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: MESSAGES.UNAUTHORIZED });
      return;
    }

    const { name, email, source } = req.body as ILeadBody;

    if (!name || !email || !isLeadSource(source)) {
      res.status(400).json({ message: MESSAGES.LEAD_REQUIRED_FIELDS });
      return;
    }

    const lead = await Lead.create({
      name,
      email,
      source,
      createdBy: new Types.ObjectId(req.user.id),
    });

    res.status(201).json(lead);
  } catch (error) {
    next(error);
  }
};

export const getLeads = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: MESSAGES.UNAUTHORIZED });
      return;
    }

    const query = req.query as LeadQuery;
    const page = parsePositiveInteger(query.page, DEFAULT_PAGE);
    const limit = parsePositiveInteger(query.limit, DEFAULT_LIMIT);
    const skip = (page - 1) * limit;
    const filter = buildLeadFilter(query, req.user);
    const sort = buildSort(query.sort);

    const [leads, total] = await Promise.all([
      Lead.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Lead.countDocuments(filter),
    ]);

    res.status(200).json({
      leads,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

export const getLeadById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).populate("createdBy", "name email");

    if (!lead) {
      res.status(404).json({ message: MESSAGES.LEAD_NOT_FOUND });
      return;
    }

    if (req.user?.role !== "admin" && lead.createdBy._id.toString() !== req.user?.id) {
      res.status(403).json({ message: MESSAGES.FORBIDDEN });
      return;
    }

    res.status(200).json(lead);
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: MESSAGES.UNAUTHORIZED });
      return;
    }

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      res.status(404).json({ message: MESSAGES.LEAD_NOT_FOUND });
      return;
    }

    const isOwner = lead.createdBy.toString() === req.user.id;

    if (req.user.role !== "admin" && !isOwner) {
      res.status(403).json({ message: MESSAGES.FORBIDDEN });
      return;
    }

    const { name, email, status, source } = req.body as ILeadBody;
    const updates: Partial<ILeadBody> = {};

    if (name) {
      updates.name = name;
    }

    if (email) {
      updates.email = email;
    }

    if (status !== undefined) {
      if (!isLeadStatus(status)) {
        res.status(400).json({ message: MESSAGES.INVALID_LEAD_STATUS });
        return;
      }
      updates.status = status;
    }

    if (source !== undefined) {
      if (!isLeadSource(source)) {
        res.status(400).json({ message: MESSAGES.INVALID_LEAD_SOURCE });
        return;
      }
      updates.source = source;
    }

    const updatedLead = await Lead.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedLead);
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      res.status(404).json({ message: MESSAGES.LEAD_NOT_FOUND });
      return;
    }

    res.status(200).json({ message: MESSAGES.LEAD_DELETED });
  } catch (error) {
    next(error);
  }
};

export const exportCSV = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = req.query as LeadQuery;
    const filter = buildLeadFilter(query, req.user);
    const sort = buildSort(query.sort);
    const leads = await Lead.find(filter)
      .populate("createdBy", "name email")
      .sort(sort)
      .lean();

    const rows = leads.map((lead) => {
      const createdBy = lead.createdBy as unknown as IPopulatedCreatedBy;

      return {
        id: lead._id.toString(),
        name: lead.name,
        email: lead.email,
        status: lead.status,
        source: lead.source,
        createdAt: lead.createdAt.toISOString(),
        createdByName: createdBy.name ?? "",
        createdByEmail: createdBy.email ?? "",
      };
    });

    const parser = buildCSVParser([
      "id",
      "name",
      "email",
      "status",
      "source",
      "createdAt",
      "createdByName",
      "createdByEmail",
    ]);
    const csv = parser.parse(rows);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=leads.csv");
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};
