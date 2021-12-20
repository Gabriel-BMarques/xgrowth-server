const mongoose = require('mongoose');
const Organization = require('../../organization/model/organization.model');
const CompanyProfile = require('../../company-profile/model/companyProfile.model');
const CompanyRelation = require('../../company-relation/model/companyRelation.model');

exports.postDetailsAggregation = (req) => {
  // Aggregation queries to get documents from external collections
  let lookupSupplierId = {
    $lookup: {
      from: 'companyprofiles',
      localField: 'SupplierId',
      foreignField: '_id',
      as: 'SupplierId'
    }
  };
  let lookupOrganization = {
    $lookup: {
      from: 'organizations',
      localField: 'SupplierId.organization',
      foreignField: '_id',
      as: 'SupplierId.organization'
    }
  };
  let lookupCategories = {
    $lookup: {
      from: 'categories',
      localField: 'Categories',
      foreignField: '_id',
      as: 'Categories'
    }
  };
  let lookupRecipientsCompanyProfileId = {
    $lookup: {
      from: 'companyprofiles',
      localField: 'RecipientsCompanyProfileId',
      foreignField: '_id',
      as: 'RecipientsCompanyProfileId'
    }
  };
  let lookupCreatedBy = {
    $lookup: {
      from: 'users',
      localField: 'CreatedBy',
      foreignField: '_id',
      as: 'CreatedBy'
    }
  };
  let lookupBriefId = {
    $lookup: {
      from: 'briefs',
      localField: 'BriefId',
      foreignField: '_id',
      as: 'BriefId'
    }
  };
  let lookupPins = {
    $lookup: {
      from: 'collections',
      let: {
        'postId': '$_id'
      },
      pipeline: [{
        $match: {
          $expr: {
            $in: ['$postId', '$postsIds']
          }
        }
      }],
      as: 'collections'
    }
  };

  // Aggregations to get ratings information
  let lookupRatings = {
    $lookup: {
      from: 'postratings',
      let: {
        postId: '$_id'
      },
      pipeline: [{
          $match: {
            $expr: {
              $eq: ['$post', '$$postId']
            }
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $addFields: {
            canViewAnswer: {
              $cond: {
                if: {
                  $or: [
                    { $eq: [req.user.organization, '$organization'] },
                    { $eq: [req.user._id, '$answer.createdBy'] }
                  ]
                },
                then: true,
                else: false
              }
            }
          }
        },
        {
          $project: {
            organization: 1,
            rate: 1,
            reason: 1,
            comment: 1,
            createdAt: 1,
            canViewAnswer: 1,
            user: 1,
            answer: {
              message: 1,
              organization: 1,
            },
          }
        },
      ],
      as: 'ratings'
    }
  };
  let lookupRatingsOrgs = {
    $lookup: {
      from: 'organizations',
      let: {
        organizationId: '$ratings.organization',
        postOrganization: '$organization'
      },
      // This pipeline will populate organizations from ratings 
      // and set name as confidential, 
      // if the organization is different from the logged user organization
      pipeline: [{
          $match: {
            $expr: {
              $eq: ['$_id', '$$organizationId']
            }
          },
        },
        {
          // Check organization id and hides confidential information
          $addFields: {
            restricted: {
              $cond: {
                if: {
                  $and: [{
                    $ne: ['$_id', mongoose.Types.ObjectId(req.user.organization)]
                  }, {
                    $ne: ['$$postOrganization', mongoose.Types.ObjectId(req.user.organization)]
                  }],
                },
                then: true,
                else: false
              }
            },
            name: {
              $cond: {
                if: {
                  $and: [{
                    $ne: ['$_id', mongoose.Types.ObjectId(req.user.organization)]
                  }, {
                    $ne: ['$$postOrganization', mongoose.Types.ObjectId(req.user.organization)]
                  }],
                },
                then: 'Restricted organization',
                else: '$name'
              }
            },
            logo: {
              url: {
                $cond: {
                  if: {
                    $and: [{
                      $ne: ['$_id', mongoose.Types.ObjectId(req.user.organization)]
                    }, {
                      $ne: ['$$postOrganization', mongoose.Types.ObjectId(req.user.organization)]
                    }],
                  },
                  then: 'https://weleverimages.blob.core.windows.net/xgrowth-assets/restricted-information.png',
                  else: '$logo.url',
                }
              }
            }
          }
        },
        {
          $project: {
            name: 1,
            restricted: 1,
            logo: 1
          }
        }
      ],
      as: 'ratings.organization'
    }
  };
  let lookupAnswersOrgs = {
    $lookup: {
      from: 'organizations',
      localField: 'ratings.answer.organization',
      foreignField: '_id',
      as: 'ratings.answer.organization'
    }
  };
  let lookupReach = {
    $lookup: {
      from: 'useractions',
      let: { postId: '$_id' },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ['$PostId', '$$postId'] },
                { $eq: ['$Type', 5] }
              ]
            }
          }
        },
        {
          $group: {
            _id: '$UserId',
            PostId: { $first: '$PostId' },
            UserId: { $first: '$UserId' },
          },
        }
      ],
      as: 'reach'
    }
  }

  // Group aggregator
  let groupAggregation = {
    $group: {
      _id: '$_id',
      Title: {
        $first: '$Title'
      },
      Description: {
        $first: '$Description'
      },
      SupplierId: {
        $first: {
          _id: '$SupplierId._id',
          companyName: '$SupplierId.companyName',
          organization: {
            _id: '$SupplierId.organization._id',
            name: '$SupplierId.organization.name',
            logo: '$SupplierId.organization.logo',
          }
        }
      },
      organization: {
        $first: '$organization'
      },
      RecipientsCompanyProfileId: {
        $first: '$RecipientsCompanyProfileId'
      },
      BriefId: {
        $first: '$BriefId'
      },
      Attachments: {
        $first: '$Attachments'
      },
      Categories: {
        $first: '$Categories'
      },
      Views: {
        $first: '$Views'
      },
      Pins: {
        $first: '$Pins'
      },
      ratings: {
        $push: '$ratings'
      },
      reach: {
        $first: '$reach'
      },
      canRate: {
        $first: '$canRate'
      },
      canAnswer: {
        $first: '$canAnswer'
      },
      canDelete: {
        $first: '$canDelete'
      },
      canEdit: {
        $first: '$canEdit'
      },
      NumberOfRatings: {
        $first: '$NumberOfRatings'
      },
      PostRatingAverage: {
        $first: {
          $cond: {
            if: {
              $eq: [null, '$PostRatingAverage']
            },
            then: 0,
            else: '$PostRatingAverage'
          }
        }
      },
      Privacy: {
        $first: '$Privacy'
      },
      CreatedBy: {
        $first: {
          _id: '$CreatedBy._id',
          firstName: '$CreatedBy.firstName',
          familyName: '$CreatedBy.familyName',
          email: '$CreatedBy.email',
        }
      },
      UploadedFiles: {
        $first: '$UploadedFiles'
      },
      createdAt: {
        $first: '$createdAt'
      }
    }
  }

  // Fields to be added
  let addFieldsAggregation = {
    $addFields: {
      Pins: {
        $size: '$collections'
      },
      NumberOfRatings: {
        $size: '$ratings'
      },
      PostRatingAverage: {
        $avg: '$ratings.rate'
      },
      canRate: {
        $cond: {
          if: {
            $or: [
              { $eq: ['$organization', mongoose.Types.ObjectId(req.user.organization)] },
              { $in: [req.user._id, '$ratings.user'] },
            ]
          },
          then: false,
          else: true
        }
      },
      canAnswer: {
        $cond: {
          if: {
            $eq: [req.user._id, '$CreatedBy._id']
          },
          then: true,
          else: false
        }
      },
      canDelete: {
        $cond: {
          if: {
            $eq: [req.user._id, '$CreatedBy._id']
          },
          then: true,
          else: false
        }
      },
      canEdit: {
        $cond: {
          if: {
            $or: [
              { $eq: [req.user.role, 'admin'] },
              { $eq: [req.user._id, '$CreatedBy._id'] }
            ]
          },
          then: true,
          else: false
        }
      },
      reach: {
        $size: '$reach'
      }
    }
  };

  // Final aggregation query
  let postDetailsAggregation = [{
      $match: {
        _id: mongoose.Types.ObjectId(req.params.id)
      }
    },
    {
      $limit: 1
    },
    lookupSupplierId,
    {
      $unwind: {
        path: '$SupplierId'
      }
    },
    lookupOrganization,
    {
      $unwind: {
        path: '$SupplierId.organization'
      }
    },
    lookupCategories,
    lookupRecipientsCompanyProfileId,
    lookupCreatedBy,
    {
      $unwind: {
        path: '$CreatedBy'
      }
    },
    lookupBriefId,
    {
      $unwind: {
        path: '$BriefId',
        preserveNullAndEmptyArrays: true
      }
    },
    lookupPins,
    lookupRatings,
    lookupReach,
    addFieldsAggregation,
    {
      $unwind: {
        path: '$ratings',
        preserveNullAndEmptyArrays: true
      }
    },
    lookupRatingsOrgs,
    {
      $unwind: {
        path: '$ratings.organization',
        preserveNullAndEmptyArrays: true
      }
    },
    lookupAnswersOrgs,
    {
      $unwind: {
        path: '$ratings.answer.organization',
        preserveNullAndEmptyArrays: true
      }
    },
    groupAggregation,
  ];

  return postDetailsAggregation;
}

exports.feedQuery = async (req, next) => {
  try {
    let reqQuery = req.query || {};

    let organization = await Organization.findById(req.user.organization).populate('organizationType').lean();
    let orgCompaniesIds = (await CompanyProfile.find({ organization: organization._id }).lean()).map((c) => c._id);
    let relatedCompaniesIds = (await CompanyRelation.find({ companyA: req.user.company }).lean()).map((cr) => cr.companyB);

    let potentialClientsPrivacy = {
      SupplierId: { $in: relatedCompaniesIds },
      $or: [{ Privacy: 'Potential Clients' }, { Privacy: 'Public' }],
    };
    let isSameOrganizationPost = { SupplierId: { $in: orgCompaniesIds } };
    let myOrganizationPrivacy = {
      ...isSameOrganizationPost,
      Privacy: 'My Organization',
    };
    let isPublicPost = { Privacy: 'All Companies' };
    let targetCompaniesPrivacy = {
      RecipientsCompanyProfileId: { $in: orgCompaniesIds },
      Privacy: 'Selected Companies',
    };

    let isCPG = organization.organizationType?.name === 'CPG Industry';
    if (isCPG) delete potentialClientsPrivacy.SupplierId;

    let query = {
      $or: [
        potentialClientsPrivacy,
        myOrganizationPrivacy,
        isPublicPost,
        targetCompaniesPrivacy,
        isSameOrganizationPost,
      ],
      $and: [{ IsDraft: { $ne: true } }, { BriefId: undefined }, reqQuery],
    };

    return query;
  } catch (error) {
    return next(error);
  }
}