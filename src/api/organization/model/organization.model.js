const mongoose = require("mongoose");
const User = require("../../user/model/user.model");
const _ = require("lodash");
const OrganizationType = require("./organizationType.model");
const Plant = require("../../plant/models/plant.model");

/**
 * Organization Schema
 * @private
 */
const organizationSchema = new mongoose.Schema(
  {
    externalClientID: {
      type: String,
      required: false,
    },
    premium: {
      type: Boolean,
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    domain: {
      type: String,
      required: false,
    },
    isComplete: {
      type: Boolean,
      required: false,
    },
    canEdit: {
      type: Boolean,
      required: false,
    },
    numberOfPosts: {
      type: Number,
      required: false,
    },
    organizationAdmins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    ],
    allowedDomains: [
      {
        type: String,
        required: false,
      },
    ],
    yearFounded: {
      type: String,
      required: false,
    },
    website: {
      type: String,
      required: false,
    },
    whoWeAre: {
      type: String,
      required: false,
    },
    numberOfEmployees: {
      type: String,
      required: false,
    },
    annualSales: {
      type: String,
      required: false,
    },
    organizationType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrganizationType",
      required: false,
    },
    subType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrganizationType",
      required: false,
    },
    organizationReach: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Country",
        required: true,
      },
    ],
    initiatives: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Initiative",
        required: false,
      },
    ],
    certifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Certification",
        required: false,
      },
    ],
    skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skills",
        required: false,
      },
    ],
    segments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Segment",
        required: false,
      },
    ],
    subSegments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Segment",
        required: false,
      },
    ],
    logo: {
      url: {
        type: String,
        required: false,
      },
      Name: {
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
    coverImage: {
      url: {
        type: String,
        required: false,
      },
      Name: {
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
    categoryOrganizations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CategoryOrganization",
        required: false,
      },
    ],
    uploadedContent: {
      url: {
        type: String,
        required: false,
      },
      Name: {
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

const externalManufacturerComplete = async (entity) => {
  try {
    const organizationType = await OrganizationType.findById(
      entity.organizationType
    );
    if (organizationType.name === "External Manufacturer") {
      const plantCount = await Plant.count({ organization: entity._id });
      return plantCount !== 0;
    } else {
      return true;
    }
  } catch (error) {
    console.log(error);
  }
};

organizationSchema.method({
  async externalManufacturerComplete(entity) {
    try {
      const organizationType = await OrganizationType.findById(entity?.organizationType);
      if (organizationType?.name === 'External Manufacturer') {
        const plantCount = await Plant.count({ organization: entity?._id });
        return plantCount !== 0;
      } else {
        return true;
      }
    } catch (error) {
      console.log(error);
    }
  },

  async profileComplete(entity) {
    const completeCondition =
      (!_.isNil(entity?.organizationType) && !(entity?.organizationType?.name === 'Startup' && _.isNil(entity?.subType))) &&
      (!_.isNil(entity?.yearFounded) && entity?.yearFounded !== '') &&
      (!_.isNil(entity?.whoWeAre) && entity?.whoWeAre !== '') &&
      (!_.isNil(entity?.website) && entity?.website !== '') &&
      !_.isNil(entity?.numberOfEmployees) &&
      !_.isNil(entity?.annualSales) &&
      !_.isNil(entity?.uploadedContent) &&
      entity?.initiatives?.length > 0 &&
      entity?.certifications?.length > 0 &&
      entity?.segments?.length > 0 &&
      entity?.subSegments?.length > 0 &&
      entity?.skills?.length > 0 &&
      entity?.organizationReach?.length > 0;
  
    return completeCondition && await this.externalManufacturerComplete(entity);
  },
});

// MiddlewaresScope
organizationSchema.pre("save", async function save(next) {
  try {
    this.isComplete = await this.profileComplete(this);
  } catch (error) {
    return next(error);
  }
});

organizationSchema.pre("updateOne", async function updateOne(next) {
  try {
    delete this._update.canEdit;
  } catch (error) {
    return next(error);
  }
});

organizationSchema.post("findOne", async function findOne(result, next) {
  try {
    if (result) result.isComplete = await organizationSchema.methods.profileComplete(result);
  } catch(error) {
    return next(error);
  }
});

organizationSchema.index(
  {
    "$**": 1,
  },
  {
    collation: {
      locale: 'en',
      strength: 4,
    },
    name: 'organizationIndexes',
  },
);

/**
 * @typedef Organization
 */
const OrganizationSchema = mongoose.model("Organization", organizationSchema);

module.exports = OrganizationSchema;
