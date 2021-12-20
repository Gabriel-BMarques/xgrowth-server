const mongoose = require('mongoose');
const Notification = require('../../notification/model/notification.model');
const NotificationUser = require('../../notification-user/model/notificationUser.model');
const mediaService = require('../../shared/services/media.service');
const CompanyProfile = require('../../company-profile/model/companyProfile.model');
const Organization = require('../../organization/model/organization.model');

/**
* Post Schema
* @private
*/

const postSchema = new mongoose.Schema({
  SupplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CompanyProfile',
    required: false,
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: false,
  },
  Title: {
    type: String,
    required: false,
  },
  Description: {
    type: String,
    required: false,
  },
  cblxEntity: {
    type: Boolean,
    required: false,
  },
  RecipientsCompanyProfileId: [{
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  }],
  UploadedFiles: [{
    url: {
      type: String,
      required: false,
    },
    Name: {
      type: String,
      required: false,
    },
    Order: {
      type: Number,
      required: false,
    },
    Description: {
      type: String,
      required: false,
    },
    Size: {
      type: Number,
      required: false,
    },
    Type: {
      type: String,
      required: false,
    },
    Width: {
      type: Number,
      required: false,
    },
    Height: {
      type: Number,
      required: false,
    },
    VideoSources: [{
      size: {
        type: String,
      },
      src: {
        type: String,
      },
      type: {
        type: String,
        default: 'video/mp4',
      },
    }],
    Thumbnail: {
      type: String,
    },
    Processing: {
      type: Boolean
    },
  }],
  Attachments: [{
    url: {
      type: String,
      required: false,
    },
    Name: {
      type: String,
      required: false,
    },
    Order: {
      type: Number,
      required: false,
    },
    Description: {
      type: String,
      required: false,
    },
    Size: {
      type: Number,
      required: false,
    },
    Type: {
      type: String,
      required: false,
    },
  }],
  thumbnail: {
    url: {
      type: String,
      required: false,
    },
    Name: {
      type: String,
      required: false,
    },
    Order: {
      type: Number,
      required: false,
    },
    Description: {
      type: String,
      required: false,
    },
    Size: {
      type: Number,
      required: false,
    },
    Type: {
      type: String,
      required: false,
    },
    isVideo: {
      type: Boolean,
      required: false,
    },
  },
  Categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: false,
  }],
  TypeOfContent: {
    type: Number,
    required: false,
  },
  IsConfidential: {
    type: Boolean,
    required: false,
  },
  IsExclusive: {
    type: Boolean,
    required: false,
  },
  IsPublic: {
    type: Boolean,
    required: false,
  },
  IsPublished: {
    type: Boolean,
    required: false,
  },
  IsDraft: {
    type: Boolean,
    required: false,
  },
  Views: {
    type: Number,
    required: false,
    default: 0
  },
  Pins: {
    type: Number,
    required: false,
  },
  BriefId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brief',
    required: false,
  },
  Privacy: {
    type: String,
    required: false,
  },
  CreatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    unique: false,
  },
  CreatedBy_XG: {
    type: String,
    ref: 'User',
    required: false,
  },
  UpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
  UpdatedBy_XG: {
    type: String,
    required: false,
  },
}, {
  timestamps: true,
});

postSchema.statics = {

  /**
       * List companies in descending order of 'createdAt' timestamp.
       *
       * @returns {Promise<CompanyProfile[]>}
       */
  list() {
    //   const options = omitBy({}, isNil);

    return this.find()
      .sort({ createdAt: -1 })
      .exec();
  },
};

postSchema.pre('remove', async function (next) {
  if (!this) {
    next(new Error('Invalid entity id.'));
  }

  Notification.deleteMany({ postId: mongoose.Types.ObjectId(this._id) });
  NotificationUser.deleteMany({ postId: mongoose.Types.ObjectId(this._id) });

  if (!this.IsDraft && !this.BriefId) {
    let organizationId = (await CompanyProfile.findById(this.SupplierId)).organization;
    let organization = await Organization.findById(organizationId);
    organization.numberOfPosts -= 1;
    organization.save();
  }

  next();
});

postSchema.post('find', async function (result) {
  result.forEach((p) => {
    p.thumbnail = p.UploadedFiles[0];
    if (p.thumbnail) {
      p.thumbnail.isVideo = mediaService.videoTypes.includes(p.thumbnail?.Type);
      p.thumbnail.url = mediaService.getThumbnail(p.thumbnail)
    };
  });
});

postSchema.pre('updateOne', async function updateOne(next) {
  try {
    delete this._update.thumbnail;
    this._update.UploadedFiles.forEach((uf) => {
      delete uf.VideoSources;
      delete uf.Thumbnail;
      delete uf.Processing;
    });
  } catch(error) {
    return next(error);
  }
});

postSchema.post('findOne', async function (result, next) {
  const videos = result?.UploadedFiles
    .filter((uf) => mediaService.videoTypes.includes(uf.Type)) || [];

  for await (let v of videos) {
    v.VideoSources = await mediaService.getVideoSources(v)
  }

  return next();
});

/**
 * @typedef postSchema
 */
const PostSchema = mongoose.model('Post', postSchema);

postSchema.index(
  {
    Privacy: 1,
    SupplierId: 1,
    RecipientsCompanyProfileId: 1,
    BriefId: 1,
    IsDraft: 1,
    organization: 1,
  },
  {
    collation: {
      locale: 'en',
      strength: 4,
    },
    name: 'postsIndexes',
  },
);

module.exports = PostSchema;
