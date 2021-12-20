const httpStatus = require('http-status');
const { omit, map } = require('lodash');
const CategoryPost = require('../model/categoryPost.model');
const Post = require('../../post/model/post.model');

/**
 * Create CategoryPost
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const entity = new CategoryPost(req.body);
    if (req.user) {
      entity.CreatedBy = req.user._id;
    } else {
      entity.userId = 'admin';
    }
    const saved = await entity.save();
    res.status(httpStatus.CREATED);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * Get CategoryPost
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    const entity = await CategoryPost.findById(req.params.id);

    if (!entity) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    res.status(httpStatus.OK);
    res.json(entity);
  } catch (error) {
    return next(error);
  }
};

/**
 * List Categories By current post id
 * @public
 */
exports.listByPostId = async (req, res, next) => {
  try {
    let entities = await CategoryPost.find({ UserId: req.params._id })
      .populate('categoryId');

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
 * List Categories By current user id
 * @public
 */
// exports.listByCurrentUserDomain = async (req, res, next) => {
//   try {
//     const domain = req.user.email.split('@')[1];
//     const companyProfile = await CompanyProfile.findOne({ allowedDomain: domain });

//     let entities = await Collection.find({ companyProfileId: companyProfile._id });

//     if (!entities) {
//       res.status(httpStatus.NOT_FOUND);
//       res.json('Not found.');
//       return next();
//     }

//     entities = map(entities, (entity) => {
//       return omit(entity.toObject(), ['createdAt', 'updatedAt', '__v']);
//     });

//     res.status(httpStatus.OK);
//     res.json(entities);
//   } catch (error) {
//     return next(error);
//   }
// };

/**
 * List Categories
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const query = req.query || {};
    let entities = await CategoryPost.find(query)
      .populate('categoryId');

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
 * List Feed Categories by Feed Posts
 * @public
 */
exports.listFeedCategoriesByPosts = async (req, res, next) => {
  try {
    const { postIds } = req.query;
    const { categoryIds } = req.query;
    let query = {};
    query = {
      $and: [
        {
          postId: { $in: postIds },
          categoryId: { $in: categoryIds },
        },
      ],
    };

    let entities = await CategoryPost.find(query)
      .populate('categoryId');

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    entities = map(entities, (entity) => {
      return omit(entity.toObject(), ['createdAt', 'updatedAt', '__v']);
    });

    const postsIds = entities.map(post => post.postId);

    const newEntities = await Post.find({ _id: { $in: postsIds } })
      .populate('SupplierId');

    res.status(httpStatus.OK);
    res.json(newEntities);
  } catch (error) {
    return next(error);
  }
};

/**
 * Update an existing CategoryPost
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const entity = new CategoryPost(req.body);
    // const domain = req.user.email.split('@')[1];
    const newEntity = omit(entity.toObject(), '_id', '__v');
    const oldEntity = await CategoryPost.findById(entity._id);

    if (!oldEntity) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }


    await oldEntity.update(newEntity, { override: true, upsert: true });
    entity.updatedBy = req.user._id;
    const savedEntity = await CategoryPost.findById(entity._id);

    res.status(httpStatus.OK);
    res.json(savedEntity);
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete CategoryPost
 * @public
 */
exports.remove = async (req, res, next) => {
  try {
    const entity = await CategoryPost.findById(req.params.id);

    if (!entity) {
      res.status(httpStatus.NOT_FOUND);
      return next();
    }

    // const domain = req.user.email.split('@')[1];
    // const companyProfile = await CompanyProfile.findById(entity.companyProfileId);

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
