const httpStatus = require('http-status');
const _ = require('lodash');
const { omit } = require('lodash');
const EMCategory = require('../models/emcategory.model');
const PostCategory = require('../models/postCategory.model');
const PostSubCategory = require('../models/postSubCategory.model');
const Country = require('../models/country.model');
const LineType = require('../../line/models/lineType.model');
const ProductCategory = require('../../line/models/productCategory.model');
const ProductCategoryOutput = require('../../line/models/productCategoryOutput.model');
const DietaryRegulatoryLabel = require('../../line/models/dietaryRegulatoryLabel.model');
const SustainabilityLabel = require('../../line/models/sustainabilityLabel.model');
const RawMaterialsTraceability = require('../../line/models/rawMaterialsTraceability.model');
const Client = require('../models/client.model');
const ContractType = require('../models/contractType.model');
const Gender = require('../../profile/models/gender.model');
const JobTitle = require('../../user/model/jobTitle.model');
const Department = require('../../user/model/department.model');
const Company = require('../models/company.model');
const PhonePrefix = require('../models/phonePrefix.model');
const Allergen = require('../../line/models/allergen.model');
const BriefType = require('../../brief/model/briefType.model');
const Market = require('../models/market.model');
const GlobalRegion = require('../models/globalRegion.model');
const StateProvince = require('../models/stateProvinces.model');
const City = require('../models/city.model');
const fetch = require('node-fetch');


// Remove after data creation
exports.createStates = async (req, res, next) => {
  try {
    const countries = await Country.find({});
    const errors = [];
    countries.map(async (c) => {
      const params = new URLSearchParams();
      params.append('country', c.name);
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/states', { method: 'POST', body: params });
      const json = await response.json();
      if (!json.error) {
        json.data.states.map(async (s) => {
          const entity = {
            name: s.name,
            code: s.state_code || 'N/D',
            countryId: c._id
          }
          const stateExists = await StateProvince.findOne({ name: s.name });
          if (!stateExists) {
            const newState = new StateProvince(entity);
            await newState.save();
          }
        });
      } else {
        errors.push(c.name);
      }
      console.log(errors, errors.length);
    });
  } catch (error) {
    console.log(error);
  }
}

async function getStateCities(params, skip) {
  await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', { method: 'POST', body: params })
        .then((res) => res.json())
        .then(async (response) => {
          if (!response.error) {
            const cities = response.data.map((c) => {
              const entity = new City({
                name: c,
                countryId: s.countryId._id,
                stateProvinceId: s._id
              });
              return entity;
            });
            await City.insertMany(cities);
          }
        })
        .catch(async (error) => {
          return await getStateCities(params, skip);
        })
}

async function createCities(skip) {
  try {
    const states = await StateProvince.find().populate('countryId').skip(skip).limit(100);
    console.log(states);
    states.forEach(async (s) => {
      const params = new URLSearchParams();
      params.append('country', s.countryId.name);
      params.append('state', s.name);
      await getStateCities(params, skip);
    });
  } catch(error) {
    console.log(error);
  }
}

async function createCitiesByInterval() {
  for(let counter = 0; counter <= 4700; counter += 100) {
    await createCities(counter);
  }
}

/**
 * Create em category
 * @public
 */
exports.createEMCategory = async (req, res, next) => {
  try {
    const emCategory = new EMCategory(req.body);
    const saved = await emCategory.save();
    res.status(httpStatus.CREATED);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * Get em category list
 * @public
 */
exports.listEMCategories = async (req, res, next) => {
  try {
    const list = await EMCategory.find(req.query);
    res.status(httpStatus.OK);
    res.json(list);
  } catch (error) {
    next(error);
  }
};

/**
 * Create country
 * @public
 */
exports.createCountry = async (req, res, next) => {
  try {
    const country = new Country(req.body);
    const saved = await country.save();
    res.status(httpStatus.CREATED);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * Get country list
 * @public
 */
exports.listCountries = async (req, res, next) => {
  try {
    const query = req.query || {};
    const list = await Country.find(query).populate('globalRegion', GlobalRegion).sort({ name: 1 });

    if (!list) {
      res.status(httpStatus.NOT_FOUND);
      return res.json('ERROR: No countries found');
    }

    res.status(httpStatus.OK);
    res.json(list);
  } catch (error) {
    next(error);
  }
};

/**
 * Get StateProvinces list
 * @public
 */
exports.listStateProvinces = async (req, res, next) => {
  try {
    const query = req.query || {};
    const entities = await StateProvince.find(query).sort({ name: 1 });

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      return res.json('ERROR: No provinces found');
    }

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
}

/**
 * Get City list
 * @public
 */
 exports.listCities = async (req, res, next) => {
  try {
    const query = req.query || {};
    const entities = await City.find(query).sort({ name: 1 });

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      return res.json('ERROR: No cities found');
    }

    res.status(httpStatus.OK);
    res.json(entities);
  } catch (error) {
    return next(error);
  }
}

/**
 * Get Country List by Global Region
 * @public 
 */
exports.listCountriesByGlobalRegion = async (req, res, next) => {
  try {
    const entities = await Country.find({ globalRegion: { $ne: undefined } }).populate('globalRegion', GlobalRegion).sort({ name: 1 });

    if (!entities) {
      res.status(httpStatus.NOT_FOUND);
      return res.json('ERROR: No countries found');
    }

    let globalRegions = entities.map((c) => {
      return { 
        _id: c.globalRegion._id,
        globalRegion: c.globalRegion.name,
        countries: []
      }
    });

    globalRegions = _.uniqWith(globalRegions, _.isEqual);

    globalRegions.map((gr) => {
      gr.countries = entities
        .filter((c) => c.globalRegion._id.toString() === gr._id.toString())
        .map((c) => {
          return {
            _id: c._id,
            name: c.name
          }
        });
    });

    const list = globalRegions;
    list.sort((a, b) => {
      if (a.globalRegion > b.globalRegion) {
        return 1;
      }
      if (a.globalRegion < b.globalRegion) {
        return -1;
      }
      return 0;
    });

    res.status(httpStatus.OK);
    return res.json(list);
  } catch (error) {
    return next(error);
  }
};

/**
 * Get country by ID
 * @public
 */
exports.getCountry = async (req, res, next) => {
  try {
    const entity = await Country.findById(req.params.id).populate('globalRegion', GlobalRegion);

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
 * Create footprint
 * @public
 */
exports.createLineType = async (req, res, next) => {
  try {
    const entity = new LineType(req.body);
    const saved = await entity.save();
    res.status(httpStatus.CREATED);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * Get line types list
 * @public
 */
exports.listLineTypes = async (req, res, next) => {
  try {
    const list = await LineType.find(req.query);
    res.status(httpStatus.OK);
    res.json(list);
  } catch (error) {
    next(error);
  }
};

/**
 * Create Product Category
 * @public
 */
exports.createProductCategory = async (req, res, next) => {
  try {
    const entity = new ProductCategory(req.body);
    const saved = await entity.save();
    res.status(httpStatus.CREATED);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * Get product categories list
 * @public
 */
exports.listCategories = async (req, res, next) => {
  try {
    const list = await PostCategory.find(req.query);
    res.status(httpStatus.OK);
    res.json(list);
  } catch (error) {
    next(error);
  }
};

/**
 * Create Product Category Output
 * @public
 */
exports.createProductCategoryOutput = async (req, res, next) => {
  try {
    const entity = new ProductCategoryOutput(req.body);
    const saved = await entity.save();
    res.status(httpStatus.CREATED);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * Get product category outputs list
 * @public
 */
exports.listSubCategories = async (req, res, next) => {
  try {
    const list = await PostSubCategory.find(req.query);
    res.status(httpStatus.OK);
    res.json(list);
  } catch (error) {
    next(error);
  }
};

/**
 * Create Dietary Regulatory Label
 * @public
 */
exports.createDietaryRegulatoryLabel = async (req, res, next) => {
  try {
    const entity = new DietaryRegulatoryLabel(req.body);
    const saved = await entity.save();
    res.status(httpStatus.CREATED);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Dietary Regulatory Labels list
 * @public
 */
exports.listDietaryRegulatoryLabels = async (req, res, next) => {
  try {
    const list = await DietaryRegulatoryLabel.find(req.query);
    res.status(httpStatus.OK);
    res.json(list);
  } catch (error) {
    next(error);
  }
};

/**
 * Create Sustainability Label
 * @public
 */
exports.createSustainabilityLabel = async (req, res, next) => {
  try {
    const entity = new SustainabilityLabel(req.body);
    const saved = await entity.save();
    res.status(httpStatus.CREATED);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Sustainability Labels list
 * @public
 */
exports.listSustainabilityLabels = async (req, res, next) => {
  try {
    const list = await SustainabilityLabel.find(req.query);
    res.status(httpStatus.OK);
    res.json(list);
  } catch (error) {
    next(error);
  }
};

/**
 * Create Raw Material Traceability
 * @public
 */
exports.createRawMaterialsTraceability = async (req, res, next) => {
  try {
    const entity = new RawMaterialsTraceability(req.body);
    const saved = await entity.save();
    res.status(httpStatus.CREATED);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Raw Materials Traceability list
 * @public
 */
exports.listRawMaterialsTraceability = async (req, res, next) => {
  try {
    const list = await RawMaterialsTraceability.find(req.query);
    res.status(httpStatus.OK);
    res.json(list);
  } catch (error) {
    next(error);
  }
};

/**
 * Create Client
 * @public
 */
exports.createClient = async (req, res, next) => {
  try {
    const entity = new Client(req.body);
    const saved = await entity.save();
    res.status(httpStatus.CREATED);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Client list
 * @public
 */
exports.listClients = async (req, res, next) => {
  try {
    const list = await Client.find(req.query);
    res.status(httpStatus.OK);
    res.json(list);
  } catch (error) {
    next(error);
  }
};

/**
 * Create Contract Type
 * @public
 */
exports.createContractType = async (req, res, next) => {
  try {
    const entity = new ContractType(req.body);
    const saved = await entity.save();
    res.status(httpStatus.CREATED);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * List Contract Types
 * @public
 */
exports.listContractTypes = async (req, res, next) => {
  try {
    const list = await ContractType.find(req.query);
    res.status(httpStatus.OK);
    res.json(list);
  } catch (error) {
    next(error);
  }
};

/**
 * Create Gender
 * @public
 */
exports.createGender = async (req, res, next) => {
  try {
    const entity = new Gender(req.body);
    const saved = await entity.save();
    res.status(httpStatus.CREATED);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * List Genders
 * @public
 */
exports.listGenders = async (req, res, next) => {
  try {
    const list = await Gender.find(req.query);
    res.status(httpStatus.OK);
    res.json(list);
  } catch (error) {
    next(error);
  }
};

/**
 * Create Company
 * @public
 */
exports.createCompany = async (req, res, next) => {
  try {
    const entity = new Company(req.body);
    const saved = await entity.save();
    res.status(httpStatus.CREATED);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * List Companies
 * @public
 */
exports.listCompanies = async (req, res, next) => {
  try {
    const list = await Company.find(req.query);
    res.status(httpStatus.OK);
    res.json(list);
  } catch (error) {
    next(error);
  }
};

/**
 * Create Department
 * @public
 */
exports.createDepartment = async (req, res, next) => {
  try {
    const entity = new Department(req.body);
    const saved = await entity.save();
    res.status(httpStatus.CREATED);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * Create Department
 * @public
 */
exports.updateDepartment = async (req, res, next) => {
  try {
    const entity = new Department(req.body);
    entity.updatedBy = req.user._id;

    const newEntity = omit(entity.toObject(), '__v');
    const oldEntity = await Department.findById(entity._id);

    if (!oldEntity) {
      res.status(httpStatus.NOT_FOUND);
      res.json('Not found.');
      return next();
    }

    await oldEntity.update(newEntity, { override: true, upsert: true });
    const savedEntity = await Department.findById(entity._id);

    res.status(httpStatus.OK);
    res.json(savedEntity);
  } catch (error) {
    return next(error);
  }
};

/**
 * Create Department
 * @public
 */
exports.removeDepartment = async (req, res, next) => {
  try {
    const entity = await Department.findById(req.params.id);

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
 * List Departments
 * @public
 */
exports.listDepartments = async (req, res, next) => {
  try {
    const list = await Department.find({}).collation({locale: "en" }).sort({ name: 1 });
    res.status(httpStatus.OK);
    res.json(list);
  } catch (error) {
    next(error);
  }
};

/**
 * Create JobTitle
 * @public
 */
exports.createJobTitle = async (req, res, next) => {
  try {
    const entity = new JobTitle(req.body);
    const saved = await entity.save();
    res.status(httpStatus.CREATED);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * List JobTitles
 * @public
 */
exports.listJobTitles = async (req, res, next) => {
  try {
    const list = await JobTitle.find({}).collation({locale: "en" }).sort({ name: 1 });
    res.status(httpStatus.OK);
    res.json(list);
  } catch (error) {
    next(error);
  }
};

/**
 * Create JobTitle
 * @public
 */
 exports.updateJobTitle = async (req, res, next) => {
  try {
    const entity = new JobTitle(req.body);
    entity.updatedBy = req.user._id;
    const newEntity = omit(entity.toObject(), '__v');
    const oldEntity = await JobTitle.findById(entity._id);

    if (!oldEntity) {
      res.json('Not found.');
      return next();
    }

    await oldEntity.update(newEntity, { override: true, upsert: true });
    const savedEntity = await JobTitle.findById(entity._id);

    res.json(savedEntity);
  } catch (error) {
    return next(error);
  }
};

/**
 * Remove JobTitle
 * @public
 */
exports.removeJobTitle = async (req, res, next) => {
  try {
    const entity = await JobTitle.findById(req.params.id);

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
 * List JobTitles
 * @public
 */
exports.listMarketTypes = async (req, res, next) => {
  try {
    const list = await Market.find({});
    res.status(httpStatus.OK);
    res.json(list);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Brief Type by Enum
 * @public
 */
exports.getBriefTypeByGuid = async (req, res, next) => {
  try {
    const entity = await BriefType.find({ type: req.params.id });
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
 * Create PhonePrefix
 * @public
 */
exports.createPhonePrefix = async (req, res, next) => {
  try {
    const entity = new PhonePrefix(req.body);
    const saved = await entity.save();
    res.status(httpStatus.CREATED);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * List PhonePrefixes
 * @public
 */
exports.listPhonePrefixes = async (req, res, next) => {
  try {
    const list = await PhonePrefix.find(req.query);
    list.sort((a, b) => {
      const nameA = a.name.toLowerCase(); 
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) { return -1; }
      if (nameA > nameB) { return 1; }
      return 0;
    });
    res.status(httpStatus.OK);
    res.json(list);
  } catch (error) {
    next(error);
  }
};

/**
 * Create Allergen
 * @public
 */
exports.createAllergen = async (req, res, next) => {
  try {
    const entity = new Allergen(req.body);
    const saved = await entity.save();
    res.status(httpStatus.CREATED);
    res.json(saved);
  } catch (error) {
    next(error);
  }
};

/**
 * List Allergens
 * @public
 */
exports.listAllergens = async (req, res, next) => {
  try {
    const list = await Allergen.find(req.query);
    res.status(httpStatus.OK);
    res.json(list);
  } catch (error) {
    next(error);
  }
};
