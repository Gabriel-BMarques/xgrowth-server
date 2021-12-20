const httpStatus = require("http-status");
const { omit, map } = require("lodash");
const CompanyProfile = require("../../company-profile/model/companyProfile.model");
const CollectionPost = require("../../collection-post/models/collectionPost.model");
const Brief = require("../model/brief.model");
const BriefSupplier = require("../../brief-supplier/model/briefSupplier.model");
const BriefMember = require("../../brief-member/model/briefMember.model");
const mongoose = require("mongoose");
const BriefCompany = require("../../brief-company/model/briefCompany.model");
const User = require("../../user/model/user.model");
const BriefType = require("../model/briefType.model");
const Country = require("../../shared/models/country.model");
const Market = require("../../shared/models/market.model");
const UserAction = require("../../user/model/userAction.model");
const briefService = require("../service/briefService");
const _ = require("lodash");

/**
 * Create Brief
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const entity = new Brief(req.body);
    entity.CreatedBy = req.user._id;
    entity.SupplierId = req.user.company;

    const saved = await entity.save();
    res.status(httpStatus.CREATED);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Brief list for main briefs page
 * @public
 */
exports.getMainPageBriefs = async (req, res, next) => {
  try {
    let entities;
    if (req.user.role === "admin") {
      entities = await briefService.getAdminBriefs(req);
    } else {
      entities = req.query.sentOrReceived === 'participating' ? 
        await briefService.getParticipatingBriefs(req) :
        await briefService.getBriefs(req);
    }

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json("Not found.");
      return next();
    }

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

/**
 * Get briefs user actions list
 * @public
 */
exports.listBriefsUserActions = async (req, res, next) => {
  try {
    let entities = await UserAction.find({
      BriefId: { $ne: undefined },
      UserId: req.user._id,
    })
      .populate({
        path: "BriefId",
        model: "Brief",
        populate: {
          path: "ClientId",
          model: "CompanyProfile",
          select: { companyName: 1, logo: 1 },
          populate: {
            path: "organization",
            model: "Organization",
            select: { name: 1, logo: 1 },
          },
        },
      })
      .sort({ createdAt: -1 });
    entities = _.uniqBy(entities, "BriefId").slice(0, 6);
    entities = entities.filter((e) => !e.BriefId?.IsDraft && e.BriefId !== null);    
    entities = await briefService.setFastAccessPrivacy(req, entities);

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json("Not found.");
      return next();
    }

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

/**
 * Get briefs user actions list
 * @public
 */
exports.listLastViewedBriefs = async (req, res, next) => {
  try {
    let userActions = await UserAction.find({
      BriefId: { $ne: undefined },
      UserId: req.user._id,
    })
      .populate({
        path: "BriefId",
        model: "Brief",
        populate: {
          path: "ClientId",
          model: "CompanyProfile",
          select: { companyName: 1, logo: 1 },
        },
      })
      .sort({ createdAt: -1 });

    userActions = _.uniqBy(userActions, "BriefId");

    userActions = await briefService.setFastAccessPrivacy(req, userActions);

    let lastViewedBriefs = userActions.map((action) => action.BriefId);

    req.query = { _id: { $nin: lastViewedBriefs.map((lvb) => lvb._id) } };

    if (req.user.role === "admin") {
      remainingBriefs = await briefService.getAdminBriefs(req);
    } else {
      remainingBriefs = await briefService.getBriefs(req);
    }

    const entities = [...lastViewedBriefs, ...remainingBriefs];

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json("Not found.");
      return next();
    }

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

/**
 * Get Brief
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    let entity = await Brief.findById(req.params.id)
      .populate({
        path: "ClientId",
        model: "CompanyProfile",
        populate: {
          path: "organization",
          model: "Organization",
          select: { name: 1, logo: 1 },
        },
      })
      .populate("CreatedBy", null, User)
      .populate("Categories")
      .populate("Markets", null, Country)
      .populate("Companies", null, CompanyProfile);

    if (entity.cblxEntity) {
      entity = await Brief.findById(req.params.id)
        .populate({
          path: "ClientId",
          model: "CompanyProfile",
          populate: {
            path: "organization",
            model: "Organization",
            select: { name: 1, logo: 1 },
          },
        })
        .populate("CreatedBy", null, User)
        .populate("Categories")
        .populate("Markets", null, Market)
        .populate("Companies", null, CompanyProfile);
    }

    if (!entity) {
      res.status(httpStatus.NOT_FOUND);
      res.json("Not found.");
      return next();
    }

    const result = await CollectionPost.countDocuments({ BriefId: entity._id });
    entity.Pins = result;

    res.status(httpStatus.OK);
    res.json(entity);
  } catch (error) {
    return next(error);
  }
};

/**
 * List Briefs By current user id
 * @public
 */
exports.listByCurrentUserId = async (req, res, next) => {
  try {
    let entities = await Brief.find({ createdBy: req.user._id });

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json("Not found.");
      return next();
    }

    entities = map(entities, (entity) => {
      return omit(entity.toObject(), ["createdAt", "updatedAt", "__v"]);
    });

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

exports.getCompanyBriefs = async (req, res, next) => {
  try {
    const entities = await Brief.find({
      ClientId: mongoose.Types.ObjectId(req.params.id),
    }).populate("CreatedBy", null, User);

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json("Not found.");
      return next();
    }

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

/**
 * List Briefs By current user id
 * @public
 */
exports.listByCurrentUserDomain = async (req, res, next) => {
  try {
    const domain = req.user.email.split("@")[1];
    const companyProfile = await CompanyProfile.findOne({
      allowedDomain: domain,
    });

    let entities = await Brief.find({ companyProfileId: companyProfile._id });

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json("Not found.");
      return next();
    }

    entities = map(entities, (entity) => {
      return omit(entity.toObject(), ["createdAt", "updatedAt", "__v"]);
    });

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

/**
 * List Briefs By current user company id
 * @public
 */
exports.listByCurrentUserCompany = async (req, res, next) => {
  try {
    let entities = await Brief.find({ ClientId: req.user.company });

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json("Not found.");
      return next();
    }

    entities = map(entities, (entity) => {
      return omit(entity.toObject(), ["createdAt", "updatedAt", "__v"]);
    });

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

/**
 * List All Briefs
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    let query = req.query || {};
    if (req.query.text) {
      query = { $text: { $search: req.query.text } };
    }

    let entities = await Brief.find(query)
      .populate("ClientId", null, CompanyProfile)
      .sort({
        createdAt: -1,
      });

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json("Not found.");
      return next();
    }

    entities = map(entities, (entity) => {
      return omit(entity.toObject(), ["__v"]);
    });

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

/**
 * List Briefs By current user company organization
 * @public
 */
exports.listOrganizationBriefs = async (req, res, next) => {
  try {
    let userCompany = await CompanyProfile.findOne({ _id: req.user.company });
    let organizationCompanies = await CompanyProfile.find({
      organization: userCompany.organization,
    });
    const briefMembers = await BriefMember.find({
      UserId: mongoose.Types.ObjectId(req.user._id),
    });
    const briefMembersBriefsIds = briefMembers.map((bm) => bm.BriefId);
    const companiesIds = organizationCompanies.map((c) => c._id);

    const isPublished = {
      IsDraft: { $ne: true },
    };

    const briefMembersOnly = {
      $and: [{ MembersOnly: true }, { _id: { $in: briefMembersBriefsIds } }],
    };

    const organizationBriefs = {
      $and: [
        { ClientId: { $in: companiesIds } },
        { MembersOnly: { $ne: true } },
      ],
    };

    let entities = await Brief.find({
      $or: [briefMembersOnly, organizationBriefs],
      $and: [isPublished],
    })
      .sort({ createdAt: -1 })
      .populate("ClientId", null, CompanyProfile);

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json("Not found.");
      return next();
    }

    entities = map(entities, (entity) => {
      return omit(entity.toObject(), ["__v"]);
    });

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

/**
 * List Briefs By Organization
 * @public
 */
exports.listByOrganization = async (req, res, next) => {
  try {
    let { organizationId } = req.query;
    const companies = await CompanyProfile.find({
      organization: organizationId,
      IsDraft: { $ne: true },
    });
    const companiesIds = companies.map((c) => c._id);

    let entities = await Brief.find({
      ClientId: { $in: companiesIds },
      IsDraft: { $ne: true },
    })
      .populate("ClientId", null, CompanyProfile)
      .sort({
        createdAt: -1,
      });

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json("Not found.");
      return next();
    }

    entities = map(entities, (entity) => {
      return omit(entity.toObject(), ["__v"]);
    });

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

/**
 * List Briefs By Organization Profile page (Admin user)
 * @public
 */
exports.listByOrganizationAdmin = async (req, res, next) => {
  try {
    let { organizationId } = req.query;
    const companies = await CompanyProfile.find({
      organization: organizationId,
      IsDraft: { $ne: true },
    });
    const companiesIds = companies.map((c) => c._id);
    const briefs = await BriefSupplier.find({ SupplierId: companiesIds });
    const briefsIds = briefs.map((c) => c.BriefId);

    // brief supplier - > supplier id --> brief

    let entities = await Brief.find({
      $or: [
        { ClientId: { $in: companiesIds }, IsDraft: { $ne: true } },
        { _id: { $in: briefsIds }, IsDraft: { $ne: true } },
      ],
    })
      .populate("ClientId", null, CompanyProfile)
      .sort({
        createdAt: -1,
      });

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json("Not found.");
      return next();
    }

    entities = map(entities, (entity) => {
      return omit(entity.toObject(), ["__v"]);
    });

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

exports.listBriefTypes = async (req, res, next) => {
  try {
    const entities = await BriefType.find({});

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json("Not Found");
      return next();
    }
    entities.sort((a, b) => {
      const typeA = a.type;
      const typeB = b.type;
      if (typeA < typeB) {
        return -1;
      }
      if (typeA > typeB) {
        return 1;
      }
      return 0;
    });
    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

exports.findBriefType = async (req, res, next) => {
  try {
    const entity = await BriefType.findOne({
      _id: mongoose.Types.ObjectId(req.params.id),
    });

    if (!entity) {
      res.status(httpStatus.NOT_FOUND);
      res.json("Not Found");
      return next();
    }

    res.status(httpStatus.OK);
    res.json(entity);
  } catch (error) {
    return next(error);
  }
};

exports.listBriefCompaniesByCompanyId = async (req, res, next) => {
  try {
    const briefCompanies = await BriefCompany.find({ CompanyId: req.params.id })
      .populate("BriefId", null, Brief)
      .populate("CompanyId", null, CompanyProfile);

    const entities = briefCompanies.map((briefCompany) => {
      return briefCompany.BriefId;
    });

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json("Not found.");
      return next();
    }

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

exports.createBriefCompanies = async (req, res, next) => {
  try {
    const entity = await new BriefCompany(req.body);

    if (req.user) {
      entity.CreatedBy = req.user._id;
    } else {
      entity.userId = "admin";
    }

    const saved = await entity.save();
    res.status(httpStatus.CREATED);
    res.json(saved);
  } catch (error) {
    return next(error);
  }
};

exports.listBriefCompanies = async (req, res, next) => {
  try {
    // eslint-disable-next-line max-len
    const entities = await BriefCompany.find({
      BriefId: mongoose.Types.ObjectId(req.params.id),
    }).populate("CompanyId", null, CompanyProfile);
    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json("Not found.");
      return next();
    }
    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

exports.removeBriefCompany = async (req, res, next) => {
  try {
    const entity = await BriefCompany.findById(req.params.id);
    if (!entity) {
      res.status(httpStatus.NOT_FOUND);
      return next();
    }
    await entity.remove();
    res.status(httpStatus.NO_CONTENT);
    res.end();
  } catch (error) {
    return next(error);
  }
};

/**
 * List Feed Briefs By Company
 * @public
 */
exports.listFeedBriefsByCompany = async (req, res, next) => {
  try {
    const { regionIds } = req.query;

    let query = {};
    if (regionIds) {
      const briefCompanies = await BriefSupplier.find({
        SupplierId: { $in: regionIds },
      });
      const briefIds = briefCompanies.map((brief) => brief.BriefId);
      query = {
        $or: [{ _id: { $in: briefIds } }, { ClientId: { $in: regionIds } }],
        $and: [
          {
            $or: [{ IsDraft: false }, { IsDraft: undefined }],
          },
        ],
      };
    } else {
      const briefCompanies = await BriefSupplier.find({
        SupplierId: req.user.company,
      });
      const briefIds = briefCompanies.map((brief) => brief.BriefId);
      query = {
        $or: [{ _id: { $in: briefIds } }, { ClientId: req.user.company }],
        $and: [
          {
            $or: [{ IsDraft: false }, { IsDraft: undefined }],
          },
        ],
      };
    }

    let entities = await Brief.find(query)
      .sort({ createdAt: -1 })
      .populate("ClientId")
      .populate("CreatedBy", null, User);

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json("Not found.");
      return next();
    }

    entities = map(entities, (entity) => {
      return omit(entity.toObject(), ["createdAt", "updatedAt", "__v"]);
    });

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

/**
 * List Company Profile Briefs
 * @public
 */
exports.listCompanyProfileBriefs = async (req, res, next) => {
  try {
    const briefCompanies = await BriefSupplier.find({
      SupplierId: req.user.company,
    });
    const briefIds = briefCompanies.map((brief) => brief.BriefId);
    const query = {
      $and: [{ _id: { $in: briefIds } }, { ClientId: req.params.id }],
    };

    let entities = await Brief.find(query)
      .sort({ createdAt: -1 })
      .populate("ClientId");

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json("Not found.");
      return next();
    }

    entities = map(entities, (entity) => {
      return omit(entity.toObject(), ["createdAt", "updatedAt", "__v"]);
    });

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

/**
 * List Briefs By lineId
 * @public
 */
exports.listByLineId = async (req, res, next) => {
  try {
    let entities = await Brief.find({ lineId: req.params.lineId });

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json("Not found.");
      return next();
    }

    entities = map(entities, (entity) => {
      return omit(entity.toObject(), ["createdAt", "updatedAt", "__v"]);
    });

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

/**
 * Update an existing Brief
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const entity = new Brief(req.body);
    entity.updatedBy = req.user._id;
    if (!entity.Nda.url) {
      entity.Nda = null;
    }

    const newEntity = omit(entity.toObject(), "_id", "__v");
    const oldEntity = await Brief.findById(entity._id);

    if (!oldEntity) {
      res.status(httpStatus.NOT_FOUND);
      res.json("Not found.");
      return next();
    }

    await oldEntity.update(newEntity, { override: true, upsert: true });
    const savedEntity = await Brief.findById(entity._id);

    res.status(httpStatus.OK);
    res.json(savedEntity);
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete Brief
 * @public
 */
exports.remove = async (req, res, next) => {
  try {
    const entity = await Brief.findById(req.params.id);

    if (!entity) {
      res.status(httpStatus.NOT_FOUND);
      return next();
    }

    // const domain = req.user.email.split('@')[1];
    // const companyProfile = await CompanyProfile.findById(entity.SupplierId);

    // if (domain.toString() !== companyProfile.allowedDomain.toString()) {
    //   res.status(httpStatus.FORBIDDEN);
    //   res.json('Forbidden.');
    //   return next();
    // }

    await entity.remove();
    res.status(httpStatus.NO_CONTENT);
    res.end();
  } catch (error) {
    return next(error);
  }
};
