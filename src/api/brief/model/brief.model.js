const mongoose = require('mongoose');
const Notification = require('../../notification/model/notification.model');
const NotificationUser = require('../../notification-user/model/notificationUser.model');
const mediaService = require('../../shared/services/media.service');

/**
* Brief Schema
* @private
*/

const briefSchema = new mongoose.Schema({
  ClientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CompanyProfile',
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
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
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
  Categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: false,
  }],
  NdaFileId: {
    type: String,
  },
  Nda: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'File',
      required: false,
    },
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
  },
  NonDisclosureAgreement: {
    type: String,
  },
  Type: {
    type: Number,
  },
  type: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BriefType',
    },
    name: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
  },
  Deadline: {
    type: Date,
  },
  DeadlineTimezone: {
    offset: {
      type: Number,
      required: false
    },
    text: {
      type: String,
      required: false
    }
  },
  NdaRequirementMode: {
    type: Number,
    default: 2
  },
  MembersOnly: {
    type: Boolean,
  },
  IsPublished: {
    type: Boolean,
    required: false,
  },
  cblxEntity: {
    type: Boolean,
    required: false,
  },
  IsDraft: {
    type: Boolean,
    required: false,
  },
  Markets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: false,
  }],
  Companies: [{
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  }],
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

briefSchema.statics = {

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


briefSchema.pre('remove', async function (next) {
  if (!this) {
    next(new Error('Invalid entity id.'));
  }

  Notification.remove({ briefId: mongoose.Types.ObjectId(this._id) });
  NotificationUser.remove({ briefId: mongoose.Types.ObjectId(this._id) });

  next();
});

briefSchema.post('findOne', async function (result, next) {
  try {
    const deadline = new Date(new Date(result.Deadline).toUTCString()).getTime();
    const currentDate = new Date(new Date().toUTCString()).getTime();

    result.isActive = currentDate < deadline || result.isActive === true;

    const videos = result.UploadedFiles
      .filter((uf) => mediaService.videoTypes.includes(uf.Type));

    for await (let v of videos) {
      v.VideoSources = await mediaService.getVideoSources(v)
    }

    return next();
  } catch (error) {
    return next(error);
  }
});

briefSchema.pre('updateOne', async function updateOne(next) {
  try {
    this._update.UploadedFiles.forEach((uf) => {
      delete uf.VideoSources;
      delete uf.Thumbnail;
      delete uf.Processing;
    });
  } catch(error) {
    return next(error);
  }
});

/**
 * @typedef briefSchema
 */
const BriefSchema = mongoose.model('Brief', briefSchema);

briefSchema.index(
  {
    _id: 1,
		CreatedBy: 1,
		IsDraft: 1,
		ClientId: 1,
		Organization: 1,
		Categories: 1,
		Deadline: 1,
		NdaRequirementMode: 1,
		Markets: 1,
		MembersOnly: 1,
		type: 1,
		isActive: 1,
		createdAt: 1
  },
  {
    collation: {
      locale: 'en',
      strength: 4,
    },
    name: 'briefsIndexes'
  }
)

module.exports = BriefSchema;
