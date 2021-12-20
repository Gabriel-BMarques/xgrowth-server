const httpStatus = require('http-status');
const { omit, map, isNil } = require('lodash');
const CompanyProfile = require('../../company-profile/model/companyProfile.model');
const CollectionPost = require('../../collection-post/models/collectionPost.model');
const Post = require('../model/post.model');
const PostCompany = require('../model/postCompany.model');
const PostShare = require('../model/postShare.model');
const User = require('../../user/model/user.model');
const Category = require('../../category/models/category.model');
const mongoose = require('mongoose');
const CompanyRelation = require('../../company-relation/model/companyRelation.model');
const Organization = require('../../organization/model/organization.model');
const OrganizationType = require('../../organization/model/organizationType.model');
const mediaService = require('../../shared/services/media.service');
const postService = require('../services/post.service');
const Brief = require('../../brief/model/brief.model');

/**
 * Create Post
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const entity = new Post(req.body);
    entity.CreatedBy = req.user._id;
    entity.SupplierId = req.user.company;
    entity.organization = req.user.organization;

    const saved = await entity.save();
    res.status(httpStatus.CREATED);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Post
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    const entity = await Post.findById(req.params.id)
      .populate({
        path: 'SupplierId',
        model: 'CompanyProfile',
        populate: {
          path: 'organization',
          model: 'Organization',
          select: { name: 1, logo: 1 },
        },
      })
      .populate('Categories', null, Category)
      .populate('RecipientsCompanyProfileId', null, CompanyProfile)
      .populate('CreatedBy')
      .populate('BriefId');

    if (!entity) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }
    const result = await CollectionPost.countDocuments({ PostId: entity._id });
    entity.Pins = result;
    res.status(httpStatus.OK);
    res.json(entity);
  } catch (error) {
    return next(error);
  }
};

exports.getPostDetails = async (req, res, next) => {
  try {
    let entity = (await Post.aggregate(postService.postDetailsAggregation(req)))[0];

    if (!entity) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }
    
    let hasRatings = entity.ratings.some((r) => r._id !== undefined);

    if (!hasRatings) delete entity.ratings;

    let videos = entity?.UploadedFiles
      .filter((uf) => mediaService.videoTypes.includes(uf.Type)) || [];

    for await (let v of videos) {
      v.VideoSources = await mediaService.getVideoSources(v)
    }

    res.status(httpStatus.OK);
    res.json(entity);
  } catch (error) {
    return next(error);
  }
}

/**
 * List Posts By current user id
 * @public
 */
exports.listByCurrentUserId = async (req, res, next) => {
  try {
    let entities = await Post.find({ createdBy: req.user._id });

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    entities = map(entities, (entity) => {
      return omit(entity.toObject(), ['createdAt', 'updatedAt', '__v']);
    });

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

exports.getCompanyPosts = async (req, res, next) => {
  try {
    const entities = await Post.find({
      SupplierId: mongoose.Types.ObjectId(req.params.id),
    });

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

/**
 * Count Posts By Company Id
 * @public
 */
exports.countCompanyPosts = async (req, res, next) => {
  try {
    let numberOfPosts;
    if (req.user.role === 'admin') {
      numberOfPosts = await Post.countDocuments({
        SupplierId: mongoose.Types.ObjectId(req.params.id),
      });
    } else {
      numberOfPosts = await Post.countDocuments({
        SupplierId: mongoose.Types.ObjectId(req.params.id),
        RecipientsCompanyProfileId: mongoose.Types.ObjectId(req.user.company),
      });
    }
    res.status(httpStatus.OK);
    res.json(numberOfPosts);
  } catch (err) {
    return next(err);
  }
};

/**
 * List Posts By current user id
 * @public
 */
exports.listByCurrentUserDomain = async (req, res, next) => {
  try {
    const domain = req.user.email.split('@')[1];
    const companyProfile = await CompanyProfile.findOne({
      allowedDomain: domain,
    });

    let entities = await Post.find({ companyProfileId: companyProfile._id });

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    entities = map(entities, (entity) => {
      return omit(entity.toObject(), ['createdAt', 'updatedAt', '__v']);
    });

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

/**
 * List Posts By current user company id
 * @public
 */
exports.listByCurrentUserCompany = async (req, res, next) => {
  try {
    let entities = await Post.find({ SupplierId: req.user.company });

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    entities = map(entities, (entity) => {
      return omit(entity.toObject(), ['createdAt', 'updatedAt', '__v']);
    });

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

/**
 * List All Posts
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const query = req?.query && Object.keys(req.query).length !== 0 ? req.query : { BriefId: { $exists: false } };

    let entities = await Post.find(query)
      .nor({ IsDraft: true })
      .sort({
        createdAt: -1,
      })
      .populate('SupplierId')
      .populate({
        path: 'Categories',
        model: 'Category',
        select: { name: 1, parentId: 1 },
      });

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    entities = map(entities, (entity) => {
      return omit(entity.toObject(), ['createdAt', 'updatedAt', '__v']);
    });

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

/**
 * List All Posts
 * @public
 */
exports.listByClient = async (req, res, next) => {
  try {
    let query = req.query || {};

    if (req.query.text) {
      query = { $text: { $search: req.query.text } };
    }

    let entities = await Post.find(query)
      .sort({
        createdAt: -1,
      })
      .populate('BriefId')
      .populate('SupplierId')
      .populate({
        path: 'Categories',
        model: 'Category',
        select: { name: 1, parentId: 1 },
      });

    entities = entities.filter((entity) => {
      const isCompanyReceiver = entity.RecipientsCompanyProfileId.some((receiver) => {
        return receiver.toString() === req.user.company.toString();
      });
      if (!entity.BriefId && isCompanyReceiver) {
        return true;
      } else if (entity.BriefId) {
        return entity.BriefId.ClientId === req.user.company;
      } else {
        return false;
      }
    });

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    entities = map(entities, (entity) => {
      return omit(entity.toObject(), ['createdAt', 'updatedAt', '__v']);
    });

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

/**
 * List Posts By Brief & Supplier
 * @public
 */
exports.listBriefResponsesBySupplier = async (req, res, next) => {
  try {
    const entities = await Post.find({
      BriefId: { $in: mongoose.Types.ObjectId(req.params.briefId) },
      SupplierId: { $in: mongoose.Types.ObjectId(req.params.companyId) },
    }).populate('SupplierId');
    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not Found.');
      return next();
    }
    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

exports.createPostShare = async (req, res, next) => {
  try {
    const entity = new PostShare(req.body);
    if (req.user) {
      entity.CreatedBy = req.user._id;
      entity.SenderId = req.user._id;
      entity.SupplierId = req.user.company;
    } else {
      entity.userId = 'admin';
    }
    const saved = await entity.save();
    res.status(httpStatus.CREATED);
    res.json(saved);
  } catch (error) {
    return next(error);
  }
};

/**
 * List PostShares By User
 * @public
 */
exports.listPostSharesByUser = async (req, res, next) => {
  try {
    const entities = await PostShare.find({
      RecipientId: mongoose.Types.ObjectId(req.params.id),
    })
      .populate('PostId', null, Post)
      .populate('RecipientId', null, User)
      .populate('SenderId', null, User);

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

exports.listPostSharesByPostId = async (req, res, next) => {
  try {
    const entities = await PostShare.find({
      SenderId: { $in: req.user._id },
      PostId: { $in: mongoose.Types.ObjectId(req.params.postId) },
    }).populate('RecipientId', null, User);

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

/**
 * List brief responses by organization
 * @public
 */
exports.listBriefResponsesByOrganization = async (req, res, next) => {
  try {
    let query = req.query || {};
    let organizationId = req.params.organizationId;

    let orgCompaniesIds = (await CompanyProfile.find({ organization: req.user.organization }, { _id: 1 }).lean()).map((cp) => cp._id);
    let orgBriefsIds = (await Brief.find({ ClientId: { $in: orgCompaniesIds } }, { _id: 1 }).lean()).map((b) => b._id);

    let supplierCompaniesIds = (await CompanyProfile.find({ organization: organizationId }, { _id: 1 }).lean()).map((sc) => sc._id);

    let briefResponseQuery = {
      BriefId: req.user.role !== 'admin' ? { $in: orgBriefsIds } : { $ne: undefined }, 
      IsDraft: { $ne: true },
      SupplierId: { $in: supplierCompaniesIds },
      ...query 
    };

    let briefResponses = await Post.find(briefResponseQuery).populate('SupplierId').lean();

    if (!briefResponses) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not Found.');
      return next();
    }

    res.status(httpStatus.OK);
    res.json(briefResponses);
  } catch (error) {
    return next(error);
  }
};

/**
 * List brief responses
 * @public
 */
exports.listBriefResponses = async (req, res, next) => {
  try {
    let query = req.query || {};

    const entities = await Post.find({ BriefId: { $exists: true }, IsDraft: { $ne: true }, ...query }).populate('SupplierId', null, CompanyProfile).lean();

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not Found.');
      return next();
    }
    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

/**
 * List Feed Posts By Company
 * @public
 */
exports.listFeedPostsByCompany = async (req, res, next) => {
  try {
    let entities = await Post
      .find(
        await postService.feedQuery(req, next),
        { 
          Title: 1, 
          UploadedFiles: 1, 
          thumbnail: 1, 
          SupplierId: 1,
          Categories: 1,
          BriefId: 1,
        }
      )
      .sort({ createdAt: -1 })
      .populate('SupplierId')
      .populate({
        path: 'Categories',
        model: 'Category',
        select: { name: 1, parentId: 1 },
      })
      .lean();

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

/**
 * List Posts By Organization
 * @public
 */
exports.listByOrganization = async (req, res, next) => {
  try {
    const { organizationId } = req.query;
    const organizationCompanies = await CompanyProfile.find({ organization: organizationId }, { _id: 1 });
    const organizationCompaniesIds = organizationCompanies.map((oc) => oc._id);
    const organizationPosts = await Post.find({
      SupplierId: { $in: organizationCompaniesIds },
      BriefId: { $exists: false },
      IsDraft: { $ne: true },
    })
      .sort({
        createdAt: -1,
      })
      .populate('SupplierId')
      .lean();

    if (!organizationPosts) {
      res.status(httpStatus.NOT_FOUND);
      return res.json('Not Found.');
    }

    res.status(httpStatus.OK);
    res.json(organizationPosts);
  } catch (error) {
    return next(error);
  }
};

/**
 * List Company Profile Posts
 * @public
 */
exports.listCompanyProfilePosts = async (req, res, next) => {
  try {
    const postCompanies = await PostCompany.find({
      CompanyId: req.user.company,
    });
    const postIds = postCompanies.map((post) => post.PostId);

    const query = {
      $and: [{ _id: { $in: postIds } }, { SupplierId: req.params.id }],
    };

    let entities = await Post.find(query).sort({ createdAt: -1 }).populate('SupplierId');

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    entities = map(entities, (entity) => {
      return omit(entity.toObject(), ['createdAt', 'updatedAt', '__v']);
    });

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

/**
 * List posts By lineId
 * @public
 */
exports.listByLineId = async (req, res, next) => {
  try {
    let entities = await Post.find({ lineId: req.params.lineId });

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    entities = map(entities, (entity) => {
      return omit(entity.toObject(), ['createdAt', 'updatedAt', '__v']);
    });

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
};

/**
 * Update an existing Post
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const entity = new Post(req.body);
    entity.updatedBy = req.user._id;

    const newEntity = omit(entity.toObject(), '__v', 'thumbnail');
    const oldEntity = await Post.findById(entity._id);

    // Update number of posts after the post is published
    if ((oldEntity.IsDraft && !newEntity.IsDraft) && !newEntity.BriefId) {
      let organizationId = (await CompanyProfile.findById(newEntity.SupplierId)).organization;
      let organization = await Organization.findById(organizationId);
      organization.numberOfPosts += 1;
      organization.save();
    }

    if (!oldEntity) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }
    if (newEntity.Title.length > 0 && newEntity.Description.length > 0) {
      await oldEntity.updateOne(newEntity, { override: true, upsert: true });
      const savedEntity = await Post.findById(entity._id);

      res.status(httpStatus.OK);
      res.json(savedEntity);
    }
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete Post
 * @public
 */
exports.removePostShare = async (req, res, next) => {
  try {
    const entity = await PostShare.findById(req.params.id);

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
 * Delete Post
 * @public
 */
exports.remove = async (req, res, next) => {
  try {
    const entity = await Post.findById(req.params.id);

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
